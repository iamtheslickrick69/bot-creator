import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// Lazy-loaded clients to avoid build-time initialization
let anthropicInstance: Anthropic | null = null
let openaiInstance: OpenAI | null = null

export function getAnthropic(): Anthropic {
  if (!anthropicInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set')
    }
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropicInstance
}

export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

// For backwards compatibility
export const anthropic = new Proxy({} as Anthropic, {
  get(target, prop) {
    return getAnthropic()[prop as keyof Anthropic]
  }
})

export const openai = new Proxy({} as OpenAI, {
  get(target, prop) {
    return getOpenAI()[prop as keyof OpenAI]
  }
})

// Generate embeddings for text using OpenAI
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

// Generate chat completion with context using Claude 3.5 Sonnet
export async function generateChatResponse({
  messages,
  context,
  botConfig,
}: {
  messages: { role: 'user' | 'assistant'; content: string }[]
  context: string
  botConfig: {
    botName: string
    tone: string
    customInstructions?: string
    fallbackMessage: string
    model?: string
    temperature?: number
    maxTokens?: number
  }
}): Promise<{ content: string; tokensUsed: number }> {
  const systemPrompt = buildSystemPrompt(botConfig, context)

  // Convert messages to Anthropic format
  const anthropicMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  const response = await anthropic.messages.create({
    model: botConfig.model || 'claude-3-5-sonnet-20241022',
    max_tokens: botConfig.maxTokens || 1024,
    temperature: botConfig.temperature || 0.7,
    system: systemPrompt,
    messages: anthropicMessages,
  })

  const content = response.content[0]?.type === 'text'
    ? response.content[0].text
    : botConfig.fallbackMessage

  return {
    content,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  }
}

function buildSystemPrompt(
  botConfig: {
    botName: string
    tone: string
    customInstructions?: string
    fallbackMessage: string
  },
  context: string
): string {
  const toneInstructions = {
    professional: 'Communicate in a professional, business-like manner. Be concise and informative.',
    friendly: 'Be warm, approachable, and helpful. Use a conversational tone while remaining informative.',
    casual: 'Be relaxed and conversational. Feel free to use casual language and be personable.',
    custom: botConfig.customInstructions || '',
  }

  return `You are ${botConfig.botName}, an AI assistant for a business website.

PERSONALITY & TONE:
${toneInstructions[botConfig.tone as keyof typeof toneInstructions] || toneInstructions.friendly}

KNOWLEDGE BASE:
Use the following information to answer questions. Only use this information - do not make up facts.
If you cannot answer based on the provided context, say: "${botConfig.fallbackMessage}"

---
${context}
---

GUIDELINES:
1. Be helpful and accurate
2. Keep responses concise but complete
3. If asked about pricing, hours, or specific details not in context, suggest contacting the business directly
4. Do not mention that you are an AI or that you're using a knowledge base
5. Stay in character as ${botConfig.botName}
6. If the user wants to speak with a human, acknowledge their request and let them know someone will follow up`
}

// Split text into chunks for embedding
export function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const sentences = text.split(/[.!?]+\s+/)
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
      }
      currentChunk = sentence
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks.filter(chunk => chunk.length > 50) // Filter out very short chunks
}
