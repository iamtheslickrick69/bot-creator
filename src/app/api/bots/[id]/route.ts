import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/bots/[id] - Get a specific bot
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

    // Fetch bot with related data
    const { data: bot, error } = await supabase
      .from('bots')
      .select(`
        *,
        bot_appearance (*),
        lead_capture_settings (*),
        knowledge_sources (*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    return NextResponse.json({ bot })
  } catch (error) {
    console.error('Error in GET /api/bots/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/bots/[id] - Update a bot
export async function PATCH(
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
    const { data: existingBot } = await supabase
      .from('bots')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existingBot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    const body = await request.json()

    // Update bot
    const botUpdates: Record<string, unknown> = {}
    if (body.name !== undefined) botUpdates.name = body.name
    if (body.description !== undefined) botUpdates.description = body.description
    if (body.websiteUrl !== undefined) botUpdates.website_url = body.websiteUrl
    if (body.industry !== undefined) botUpdates.industry = body.industry
    if (body.botName !== undefined) botUpdates.bot_name = body.botName
    if (body.tone !== undefined) botUpdates.tone = body.tone
    if (body.customInstructions !== undefined) botUpdates.custom_instructions = body.customInstructions
    if (body.welcomeMessage !== undefined) botUpdates.welcome_message = body.welcomeMessage
    if (body.fallbackMessage !== undefined) botUpdates.fallback_message = body.fallbackMessage
    if (body.status !== undefined) botUpdates.status = body.status
    if (body.isPublished !== undefined) {
      botUpdates.is_published = body.isPublished
      if (body.isPublished) {
        botUpdates.published_at = new Date().toISOString()
      }
    }

    if (Object.keys(botUpdates).length > 0) {
      // @ts-ignore - Supabase types unavailable in demo mode
      const { error: botError } = await supabase
        .from('bots')
        .update(botUpdates)
        .eq('id', id)

      if (botError) {
        console.error('Error updating bot:', botError)
        return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 })
      }
    }

    // Update appearance if provided
    if (body.appearance) {
      const appearanceUpdates: Record<string, unknown> = {}
      if (body.appearance.avatarType !== undefined) appearanceUpdates.avatar_type = body.appearance.avatarType
      if (body.appearance.avatarPreset !== undefined) appearanceUpdates.avatar_preset = body.appearance.avatarPreset
      if (body.appearance.avatarUrl !== undefined) appearanceUpdates.avatar_url = body.appearance.avatarUrl
      if (body.appearance.primaryColor !== undefined) appearanceUpdates.primary_color = body.appearance.primaryColor
      if (body.appearance.secondaryColor !== undefined) appearanceUpdates.secondary_color = body.appearance.secondaryColor
      if (body.appearance.position !== undefined) appearanceUpdates.position = body.appearance.position

      if (Object.keys(appearanceUpdates).length > 0) {
        // @ts-ignore - Supabase types unavailable in demo mode
        await supabase
          .from('bot_appearance')
          .update(appearanceUpdates)
          .eq('bot_id', id)
      }
    }

    // Update lead capture settings if provided
    if (body.leadCapture) {
      const leadCaptureUpdates: Record<string, unknown> = {}
      if (body.leadCapture.isEnabled !== undefined) leadCaptureUpdates.is_enabled = body.leadCapture.isEnabled
      if (body.leadCapture.collectName !== undefined) leadCaptureUpdates.collect_name = body.leadCapture.collectName
      if (body.leadCapture.nameRequired !== undefined) leadCaptureUpdates.name_required = body.leadCapture.nameRequired
      if (body.leadCapture.collectEmail !== undefined) leadCaptureUpdates.collect_email = body.leadCapture.collectEmail
      if (body.leadCapture.emailRequired !== undefined) leadCaptureUpdates.email_required = body.leadCapture.emailRequired
      if (body.leadCapture.collectPhone !== undefined) leadCaptureUpdates.collect_phone = body.leadCapture.collectPhone
      if (body.leadCapture.phoneRequired !== undefined) leadCaptureUpdates.phone_required = body.leadCapture.phoneRequired
      if (body.leadCapture.triggerType !== undefined) leadCaptureUpdates.trigger_type = body.leadCapture.triggerType
      if (body.leadCapture.triggerAfterMessages !== undefined) leadCaptureUpdates.trigger_after_messages = body.leadCapture.triggerAfterMessages

      if (Object.keys(leadCaptureUpdates).length > 0) {
        // @ts-ignore - Supabase types unavailable in demo mode
        await supabase
          .from('lead_capture_settings')
          .update(leadCaptureUpdates)
          .eq('bot_id', id)
      }
    }

    // Fetch updated bot
    const { data: bot } = await supabase
      .from('bots')
      .select(`
        *,
        bot_appearance (*),
        lead_capture_settings (*)
      `)
      .eq('id', id)
      .single()

    return NextResponse.json({ bot })
  } catch (error) {
    console.error('Error in PATCH /api/bots/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/bots/[id] - Delete a bot
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

    // Verify bot ownership and delete
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting bot:', error)
      return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/bots/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
