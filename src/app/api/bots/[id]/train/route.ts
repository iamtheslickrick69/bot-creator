import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding, chunkText } from '@/lib/anthropic'

// POST /api/bots/[id]/train - Retrain all knowledge sources
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

    // Update bot status
    await supabase
      .from('bots')
      .update({ status: 'training' })
      .eq('id', id)

    // Get all sources
    const { data: sources } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('bot_id', id)

    if (!sources || sources.length === 0) {
      await supabase
        .from('bots')
        .update({ status: 'draft' })
        .eq('id', id)
      return NextResponse.json({ error: 'No knowledge sources to train' }, { status: 400 })
    }

    // Process each source asynchronously
    retrainAllSources(id, sources, supabase)

    return NextResponse.json({
      success: true,
      message: 'Training started',
      sourceCount: sources.length,
    })
  } catch (error) {
    console.error('Error in POST /api/bots/[id]/train:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function retrainAllSources(
  botId: string,
  sources: Array<{
    id: string
    source_type: string
    content: string | null
    url: string | null
  }>,
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  try {
    // Delete all existing chunks for this bot
    await supabase.from('knowledge_chunks').delete().eq('bot_id', botId)

    // Reprocess each source
    for (const source of sources) {
      await supabase
        .from('knowledge_sources')
        .update({ status: 'processing' })
        .eq('id', source.id)

      let textContent = source.content || ''

      // If URL, fetch and extract content
      if (source.source_type === 'url' && source.url) {
        try {
          const response = await fetch(source.url)
          const html = await response.text()
          textContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        } catch (fetchError) {
          console.error('Error fetching URL:', fetchError)
          await supabase
            .from('knowledge_sources')
            .update({
              status: 'error',
              error_message: 'Failed to fetch URL content',
            })
            .eq('id', source.id)
          continue
        }
      }

      // Chunk and embed
      const chunks = chunkText(textContent)

      for (let i = 0; i < chunks.length; i++) {
        try {
          const embedding = await generateEmbedding(chunks[i])

          await supabase.from('knowledge_chunks').insert({
            source_id: source.id,
            bot_id: botId,
            content: chunks[i],
            embedding: embedding,
            chunk_index: i,
            metadata: { source_type: source.source_type },
          })
        } catch (embeddingError) {
          console.error('Error generating embedding:', embeddingError)
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
        .eq('id', source.id)
    }

    // Update bot status
    await supabase
      .from('bots')
      .update({
        status: 'active',
        last_trained_at: new Date().toISOString(),
      })
      .eq('id', botId)
  } catch (error) {
    console.error('Error retraining sources:', error)
    await supabase
      .from('bots')
      .update({ status: 'error' })
      .eq('id', botId)
  }
}
