import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/bots/[id]/publish - Publish a bot
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
      .select('id, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Check if bot has knowledge sources
    const { count: sourceCount } = await supabase
      .from('knowledge_sources')
      .select('*', { count: 'exact', head: true })
      .eq('bot_id', id)
      .eq('status', 'completed')

    if (!sourceCount || sourceCount === 0) {
      return NextResponse.json(
        { error: 'Bot must have at least one trained knowledge source before publishing' },
        { status: 400 }
      )
    }

    // Publish bot
    // @ts-ignore - Supabase types unavailable in demo mode
    const { error } = await supabase
      .from('bots')
      .update({
        is_published: true,
        status: 'active',
        published_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error publishing bot:', error)
      return NextResponse.json({ error: 'Failed to publish bot' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/bots/[id]/publish:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/bots/[id]/publish - Unpublish (pause) a bot
export async function DELETE(
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

    // Verify bot ownership and unpublish
    // @ts-ignore - Supabase types unavailable in demo mode
    const { error } = await supabase
      .from('bots')
      .update({
        is_published: false,
        status: 'paused',
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error unpublishing bot:', error)
      return NextResponse.json({ error: 'Failed to unpublish bot' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/bots/[id]/publish:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
