import { useState, useCallback } from 'react'
import { Wallet, Token } from '../types'
import { web3Service } from '../services/mockWeb3'

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const connectedWallet = await web3Service.connectWallet()
      setWallet(connectedWallet)
      const walletTokens = await web3Service.getTokens()
      setTokens(walletTokens)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    setLoading(true)
    try {
      await web3Service.disconnectWallet()
      setWallet(null)
      setTokens([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshTokens = useCallback(async () => {
    if (!wallet) return
    const walletTokens = await web3Service.getTokens()
    setTokens(walletTokens)
  }, [wallet])

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
