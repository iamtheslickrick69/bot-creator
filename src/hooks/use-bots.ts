'use client'

import { useState, useEffect, useCallback } from 'react'
import { BotWithRelations, KnowledgeSource } from '@/types/database'

export function useBots() {
  const [bots, setBots] = useState<BotWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBots = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bots')
      if (!response.ok) throw new Error('Failed to fetch bots')
      const data = await response.json()
      setBots(data.bots || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBots()
  }, [fetchBots])

  const createBot = async (botData: Record<string, unknown>) => {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create bot')
    }

    const data = await response.json()
    setBots((prev) => [data.bot, ...prev])
    return data.bot
  }

  const updateBot = async (id: string, updates: Record<string, unknown>) => {
    const response = await fetch(`/api/bots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update bot')
    }

    const data = await response.json()
    setBots((prev) => prev.map((b) => (b.id === id ? data.bot : b)))
    return data.bot
  }

  const deleteBot = async (id: string) => {
    const response = await fetch(`/api/bots/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete bot')
    }

    setBots((prev) => prev.filter((b) => b.id !== id))
  }

  const publishBot = async (id: string) => {
    const response = await fetch(`/api/bots/${id}/publish`, {
      method: 'POST',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to publish bot')
    }

    await fetchBots()
  }

  const pauseBot = async (id: string) => {
    const response = await fetch(`/api/bots/${id}/publish`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to pause bot')
    }

    await fetchBots()
  }

  return {
    bots,
    loading,
    error,
    refetch: fetchBots,
    createBot,
    updateBot,
    deleteBot,
    publishBot,
    pauseBot,
  }
}

export function useBot(id: string) {
  const [bot, setBot] = useState<BotWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBot = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/bots/${id}`)
      if (!response.ok) throw new Error('Failed to fetch bot')
      const data = await response.json()
      setBot(data.bot)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBot()
  }, [fetchBot])

  return { bot, loading, error, refetch: fetchBot }
}

export function useKnowledgeSources(botId: string) {
  const [sources, setSources] = useState<KnowledgeSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSources = useCallback(async () => {
    if (!botId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/bots/${botId}/sources`)
      if (!response.ok) throw new Error('Failed to fetch sources')
      const data = await response.json()
      setSources(data.sources || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [botId])

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const addSource = async (sourceData: {
    type: 'url' | 'text' | 'file'
    name: string
    content?: string
    url?: string
  }) => {
    const response = await fetch(`/api/bots/${botId}/sources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sourceData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add source')
    }

    const data = await response.json()
    setSources((prev) => [data.source, ...prev])
    return data.source
  }

  const deleteSource = async (sourceId: string) => {
    const response = await fetch(`/api/bots/${botId}/sources/${sourceId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete source')
    }

    setSources((prev) => prev.filter((s) => s.id !== sourceId))
  }

  const retrainBot = async () => {
    const response = await fetch(`/api/bots/${botId}/train`, {
      method: 'POST',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to retrain bot')
    }

    // Refetch sources to get updated statuses
    await fetchSources()
  }

  return {
    sources,
    loading,
    error,
    refetch: fetchSources,
    addSource,
    deleteSource,
    retrainBot,
  }
}
