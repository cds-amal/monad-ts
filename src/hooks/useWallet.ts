import { useState, useCallback } from 'react'
import { useWeb3 } from '../context'
import { Wallet, Token } from '../ports'

export function useWallet() {
  const web3 = useWeb3()

  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const connectedWallet = await web3.connectWallet()
      setWallet(connectedWallet)
      const walletTokens = await web3.getTokens()
      setTokens(walletTokens)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }, [web3])

  const disconnect = useCallback(async () => {
    setLoading(true)
    try {
      await web3.disconnectWallet()
      setWallet(null)
      setTokens([])
    } finally {
      setLoading(false)
    }
  }, [web3])

  const refreshTokens = useCallback(async () => {
    if (!wallet) return
    const walletTokens = await web3.getTokens()
    setTokens(walletTokens)
  }, [wallet, web3])

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
