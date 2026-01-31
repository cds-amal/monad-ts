import { useState, useCallback } from 'react'
import { Wallet, Token } from '../types'
import { useServices } from '../services/ServicesContext'

export function useWallet() {
  const { connectWallet, disconnectWallet, getTokens } = useServices()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const connectedWallet = await connectWallet()
      setWallet(connectedWallet)
      const walletTokens = await getTokens()
      setTokens(walletTokens)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }, [connectWallet, getTokens])

  const disconnect = useCallback(async () => {
    setLoading(true)
    try {
      await disconnectWallet()
      setWallet(null)
      setTokens([])
    } finally {
      setLoading(false)
    }
  }, [disconnectWallet])

  const refreshTokens = useCallback(async () => {
    if (!wallet) return
    const walletTokens = await getTokens()
    setTokens(walletTokens)
  }, [wallet, getTokens])

  return {
    wallet,
    tokens,
    loading,
    error,
    connect,
    disconnect,
    refreshTokens,
  }
}
