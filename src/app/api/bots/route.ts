import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { BotInsert } from '@/types/database'

// GET /api/bots - List all bots for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch bots with related data
    const { data: bots, error } = await supabase
      .from('bots')
      .select(`
        *,
        bot_appearance (*),
        lead_capture_settings (*),
        knowledge_sources (count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bots:', error)
      return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 })
    }

    return NextResponse.json({ bots })
  } catch (error) {
    console.error('Error in GET /api/bots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/bots - Create a new bot
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's bot limit
    const { data: profile } = await supabase
      .from('profiles')
      .select('bot_limit')
      .eq('id', user.id)
      .single()

    const { count: botCount } = await supabase
      .from('bots')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (profile && botCount !== null && botCount >= profile.bot_limit) {
      return NextResponse.json(
        { error: 'Bot limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Create bot
    const botData: BotInsert = {
      user_id: user.id,
      name: body.name,
      description: body.description || null,
      website_url: body.websiteUrl || null,
      industry: body.industry || null,
      bot_name: body.botName || 'AI Assistant',
      tone: body.tone || 'friendly',
      custom_instructions: body.customInstructions || null,
      welcome_message: body.welcomeMessage || 'Hi! How can I help you today?',
      fallback_message: body.fallbackMessage || "I'm not sure about that. Would you like to speak with a human?",
      status: 'active',
      is_published: true,
    }

    const { data: bot, error: botError } = await supabase
      .from('bots')
      .insert(botData)
      .select()
      .single()

    if (botError) {
      console.error('Error creating bot:', botError)
      return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 })
    }

    // Create default appearance settings
    const { error: appearanceError } = await supabase
      .from('bot_appearance')
      .insert({
        bot_id: bot.id,
        avatar_type: body.avatarType || 'preset',
        avatar_preset: body.avatarPreset || 'bot-1',
        avatar_url: body.avatarUrl || null,
        primary_color: body.primaryColor || '#3B82F6',
        secondary_color: body.secondaryColor || '#1E40AF',
        position: body.position || 'bottom-right',
      })

    if (appearanceError) {
      console.error('Error creating appearance:', appearanceError)
    }

    // Create default lead capture settings
    const { error: leadCaptureError } = await supabase
      .from('lead_capture_settings')
      .insert({
        bot_id: bot.id,
        is_enabled: body.leadCaptureEnabled ?? true,
        collect_name: body.collectName ?? true,
        name_required: body.nameRequired ?? false,
        collect_email: body.collectEmail ?? true,
        email_required: body.emailRequired ?? true,
        collect_phone: body.collectPhone ?? false,
        phone_required: body.phoneRequired ?? false,
        trigger_type: body.triggerType || 'after_messages',
        trigger_after_messages: body.triggerAfterMessages || 2,
      })

    if (leadCaptureError) {
      console.error('Error creating lead capture settings:', leadCaptureError)
    }

    // Fetch the complete bot with relations
    const { data: completeBots } = await supabase
      .from('bots')
      .select(`
        *,
        bot_appearance (*),
        lead_capture_settings (*)
      `)
      .eq('id', bot.id)
      .single()

    return NextResponse.json({ bot: completeBots }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/bots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
