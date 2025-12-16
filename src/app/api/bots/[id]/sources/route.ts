import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding, chunkText } from '@/lib/anthropic'

// GET /api/bots/[id]/sources - List knowledge sources for a bot
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify bot ownership
    const { data: bot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Fetch sources
    const { data: sources, error } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('bot_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sources:', error)
      return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 })
    }

    return NextResponse.json({ sources })
  } catch (error) {
    console.error('Error in GET /api/bots/[id]/sources:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/bots/[id]/sources - Add a knowledge source
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify bot ownership
    const { data: bot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    const body = await request.json()
    const { type, name, content, url } = body

    // Create knowledge source
    // @ts-ignore - Supabase types unavailable in demo mode
    const { data: source, error: sourceError } = await supabase
      .from('knowledge_sources')
      .insert({
        bot_id: id,
        source_type: type,
        name: name || url || 'Untitled',
        url: type === 'url' ? url : null,
        content: type === 'text' ? content : null,
        status: 'pending',
        character_count: content?.length || 0,
      })
      .select()
      .single()

    if (sourceError) {
      console.error('Error creating source:', sourceError)
      return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })
    }

    // Process the source asynchronously
    processKnowledgeSource(source.id, id, type, content || url, supabase)

    return NextResponse.json({ source }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/bots/[id]/sources:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Process knowledge source (async)
async function processKnowledgeSource(
  sourceId: string,
  botId: string,
  type: string,
  content: string,
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  try {
    // Update status to processing
    // @ts-ignore - Supabase types unavailable in demo mode
    await supabase
      .from('knowledge_sources')
      .update({ status: 'processing' })
      .eq('id', sourceId)

    let textContent = content

    // If URL, fetch and extract content
    if (type === 'url') {
      try {
        const response = await fetch(content)
        const html = await response.text()
        // Simple HTML to text extraction (in production, use a proper parser)
        textContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      } catch (fetchError) {
        console.error('Error fetching URL:', fetchError)
        // @ts-ignore - Supabase types unavailable in demo mode
        await supabase
          .from('knowledge_sources')
          .update({
            status: 'error',
            error_message: 'Failed to fetch URL content',
          })
          .eq('id', sourceId)
        return
      }
    }

    // Chunk the text
    const chunks = chunkText(textContent)

    // Generate embeddings and store chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      try {
        const embedding = await generateEmbedding(chunk)

        // @ts-ignore - Supabase types unavailable in demo mode
        await supabase.from('knowledge_chunks').insert({
          source_id: sourceId,
          bot_id: botId,
          content: chunk,
          embedding: embedding,
          chunk_index: i,
          metadata: { source_type: type },
        })
      } catch (embeddingError) {
        console.error('Error generating embedding for chunk:', embeddingError)
      }
    }

    // Update source status
    await supabase
      .from('knowledge_sources')
      .update({
        status: 'completed',
        chunk_count: chunks.length,
        character_count: textContent.length,
        processed_at: new Date().toISOString(),
      })
      .eq('id', sourceId)

    // Update bot's last trained timestamp
    await supabase
      .from('bots')
      .update({ last_trained_at: new Date().toISOString() })
      .eq('id', botId)
  } catch (error) {
    console.error('Error processing knowledge source:', error)
    await supabase
      .from('knowledge_sources')
      .update({
        status: 'error',
        error_message: 'Failed to process content',
      })
      .eq('id', sourceId)
  }
}
