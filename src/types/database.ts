// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'starter' | 'professional' | 'business' | 'enterprise'
          subscription_status: 'active' | 'past_due' | 'canceled' | 'trialing'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          bot_limit: number
          conversation_limit: number
          conversations_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'starter' | 'professional' | 'business' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          bot_limit?: number
          conversation_limit?: number
          conversations_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'starter' | 'professional' | 'business' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          bot_limit?: number
          conversation_limit?: number
          conversations_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      bots: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          website_url: string | null
          industry: string | null
          bot_name: string
          tone: 'professional' | 'friendly' | 'casual' | 'custom'
          custom_instructions: string | null
          welcome_message: string
          fallback_message: string
          handoff_message: string
          status: 'draft' | 'training' | 'active' | 'paused' | 'error'
          is_published: boolean
          model: string
          temperature: number
          max_tokens: number
          total_conversations: number
          total_leads: number
          created_at: string
          updated_at: string
          last_trained_at: string | null
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          website_url?: string | null
          industry?: string | null
          bot_name?: string
          tone?: 'professional' | 'friendly' | 'casual' | 'custom'
          custom_instructions?: string | null
          welcome_message?: string
          fallback_message?: string
          handoff_message?: string
          status?: 'draft' | 'training' | 'active' | 'paused' | 'error'
          is_published?: boolean
          model?: string
          temperature?: number
          max_tokens?: number
          total_conversations?: number
          total_leads?: number
          created_at?: string
          updated_at?: string
          last_trained_at?: string | null
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          website_url?: string | null
          industry?: string | null
          bot_name?: string
          tone?: 'professional' | 'friendly' | 'casual' | 'custom'
          custom_instructions?: string | null
          welcome_message?: string
          fallback_message?: string
          handoff_message?: string
          status?: 'draft' | 'training' | 'active' | 'paused' | 'error'
          is_published?: boolean
          model?: string
          temperature?: number
          max_tokens?: number
          total_conversations?: number
          total_leads?: number
          created_at?: string
          updated_at?: string
          last_trained_at?: string | null
          published_at?: string | null
        }
      }
      bot_appearance: {
        Row: {
          id: string
          bot_id: string
          avatar_type: 'preset' | 'upload' | 'initials' | 'none'
          avatar_url: string | null
          avatar_preset: string
          primary_color: string
          secondary_color: string
          background_color: string
          text_color: string
          user_bubble_color: string
          bot_bubble_color: string
          position: 'bottom-right' | 'bottom-left'
          widget_size: 'compact' | 'standard' | 'expanded'
          show_powered_by: boolean
          custom_css: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bot_id: string
          avatar_type?: 'preset' | 'upload' | 'initials' | 'none'
          avatar_url?: string | null
          avatar_preset?: string
          primary_color?: string
          secondary_color?: string
          background_color?: string
          text_color?: string
          user_bubble_color?: string
          bot_bubble_color?: string
          position?: 'bottom-right' | 'bottom-left'
          widget_size?: 'compact' | 'standard' | 'expanded'
          show_powered_by?: boolean
          custom_css?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bot_id?: string
          avatar_type?: 'preset' | 'upload' | 'initials' | 'none'
          avatar_url?: string | null
          avatar_preset?: string
          primary_color?: string
          secondary_color?: string
          background_color?: string
          text_color?: string
          user_bubble_color?: string
          bot_bubble_color?: string
          position?: 'bottom-right' | 'bottom-left'
          widget_size?: 'compact' | 'standard' | 'expanded'
          show_powered_by?: boolean
          custom_css?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_capture_settings: {
        Row: {
          id: string
          bot_id: string
          is_enabled: boolean
          collect_name: boolean
          name_required: boolean
          collect_email: boolean
          email_required: boolean
          collect_phone: boolean
          phone_required: boolean
          custom_fields: Json
          trigger_type: 'before_first' | 'after_messages' | 'on_handoff' | 'custom'
          trigger_after_messages: number
          form_title: string
          form_description: string
          submit_button_text: string
          privacy_policy_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bot_id: string
          is_enabled?: boolean
          collect_name?: boolean
          name_required?: boolean
          collect_email?: boolean
          email_required?: boolean
          collect_phone?: boolean
          phone_required?: boolean
          custom_fields?: Json
          trigger_type?: 'before_first' | 'after_messages' | 'on_handoff' | 'custom'
          trigger_after_messages?: number
          form_title?: string
          form_description?: string
          submit_button_text?: string
          privacy_policy_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bot_id?: string
          is_enabled?: boolean
          collect_name?: boolean
          name_required?: boolean
          collect_email?: boolean
          email_required?: boolean
          collect_phone?: boolean
          phone_required?: boolean
          custom_fields?: Json
          trigger_type?: 'before_first' | 'after_messages' | 'on_handoff' | 'custom'
          trigger_after_messages?: number
          form_title?: string
          form_description?: string
          submit_button_text?: string
          privacy_policy_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_sources: {
        Row: {
          id: string
          bot_id: string
          source_type: 'url' | 'text' | 'file' | 'qa'
          name: string
          url: string | null
          content: string | null
          file_url: string | null
          file_name: string | null
          file_type: string | null
          file_size: number | null
          question: string | null
          answer: string | null
          status: 'pending' | 'processing' | 'completed' | 'error'
          error_message: string | null
          chunk_count: number
          character_count: number
          created_at: string
          updated_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          bot_id: string
          source_type: 'url' | 'text' | 'file' | 'qa'
          name: string
          url?: string | null
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          question?: string | null
          answer?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'error'
          error_message?: string | null
          chunk_count?: number
          character_count?: number
          created_at?: string
          updated_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          bot_id?: string
          source_type?: 'url' | 'text' | 'file' | 'qa'
          name?: string
          url?: string | null
          content?: string | null
          file_url?: string | null
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          question?: string | null
          answer?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'error'
          error_message?: string | null
          chunk_count?: number
          character_count?: number
          created_at?: string
          updated_at?: string
          processed_at?: string | null
        }
      }
      knowledge_chunks: {
        Row: {
          id: string
          source_id: string
          bot_id: string
          content: string
          embedding: number[] | null
          chunk_index: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          source_id: string
          bot_id: string
          content: string
          embedding?: number[] | null
          chunk_index: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          bot_id?: string
          content?: string
          embedding?: number[] | null
          chunk_index?: number
          metadata?: Json
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          bot_id: string
          session_id: string
          visitor_id: string | null
          status: 'active' | 'resolved' | 'handoff' | 'abandoned'
          lead_id: string | null
          message_count: number
          visitor_ip: string | null
          visitor_user_agent: string | null
          visitor_referrer: string | null
          visitor_page_url: string | null
          visitor_country: string | null
          visitor_city: string | null
          is_flagged: boolean
          flag_reason: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
          last_message_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          bot_id: string
          session_id: string
          visitor_id?: string | null
          status?: 'active' | 'resolved' | 'handoff' | 'abandoned'
          lead_id?: string | null
          message_count?: number
          visitor_ip?: string | null
          visitor_user_agent?: string | null
          visitor_referrer?: string | null
          visitor_page_url?: string | null
          visitor_country?: string | null
          visitor_city?: string | null
          is_flagged?: boolean
          flag_reason?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          last_message_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          bot_id?: string
          session_id?: string
          visitor_id?: string | null
          status?: 'active' | 'resolved' | 'handoff' | 'abandoned'
          lead_id?: string | null
          message_count?: number
          visitor_ip?: string | null
          visitor_user_agent?: string | null
          visitor_referrer?: string | null
          visitor_page_url?: string | null
          visitor_country?: string | null
          visitor_city?: string | null
          is_flagged?: boolean
          flag_reason?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
          last_message_at?: string
          resolved_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          model: string | null
          tokens_used: number | null
          latency_ms: number | null
          source_chunks: Json
          feedback: 'positive' | 'negative' | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          model?: string | null
          tokens_used?: number | null
          latency_ms?: number | null
          source_chunks?: Json
          feedback?: 'positive' | 'negative' | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          model?: string | null
          tokens_used?: number | null
          latency_ms?: number | null
          source_chunks?: Json
          feedback?: 'positive' | 'negative' | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          bot_id: string
          conversation_id: string | null
          name: string | null
          email: string | null
          phone: string | null
          custom_fields: Json
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          source_page: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bot_id: string
          conversation_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          custom_fields?: Json
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          source_page?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bot_id?: string
          conversation_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          custom_fields?: Json
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          source_page?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      search_similar_chunks: {
        Args: {
          p_bot_id: string
          p_query_embedding: number[]
          p_match_threshold?: number
          p_match_count?: number
        }
        Returns: {
          id: string
          content: string
          source_id: string
          similarity: number
        }[]
      }
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Bot = Database['public']['Tables']['bots']['Row']
export type BotAppearance = Database['public']['Tables']['bot_appearance']['Row']
export type LeadCaptureSettings = Database['public']['Tables']['lead_capture_settings']['Row']
export type KnowledgeSource = Database['public']['Tables']['knowledge_sources']['Row']
export type KnowledgeChunk = Database['public']['Tables']['knowledge_chunks']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']

// Insert types
export type BotInsert = Database['public']['Tables']['bots']['Insert']
export type BotUpdate = Database['public']['Tables']['bots']['Update']
export type KnowledgeSourceInsert = Database['public']['Tables']['knowledge_sources']['Insert']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

// Extended types with relations
export interface BotWithRelations extends Bot {
  appearance?: BotAppearance
  lead_capture?: LeadCaptureSettings
  sources?: KnowledgeSource[]
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
  lead?: Lead
}
