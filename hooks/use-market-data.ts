"use client"

import { useEffect, useMemo, useState } from "react"
import type { MarketSnapshot, SettlementMode } from "@/lib/types/market"

interface UseMarketDataOptions {
  settlement: SettlementMode
  refreshMs?: number
}

interface UseMarketDataResult {
  data: MarketSnapshot | null
  isLoading: boolean
  error: string | null
}

export const useMarketData = ({
  settlement,
  refreshMs = 5000,
}: UseMarketDataOptions): UseMarketDataResult => {
  const [data, setData] = useState<MarketSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const endpoint = useMemo(
    () => `/api/market?settlement=${encodeURIComponent(settlement)}`,
    [settlement],
  )

  useEffect(() => {
    let mounted = true
    let intervalId: ReturnType<typeof setInterval> | null = null

    const load = async () => {
      try {
        const response = await fetch(endpoint, { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }
        const snapshot = (await response.json()) as MarketSnapshot
        if (mounted) {
          setData(snapshot)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error")
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void load()
    intervalId = setInterval(() => {
      void load()
    }, refreshMs)

    return () => {
      mounted = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [endpoint, refreshMs])

  return { data, isLoading, error }
}
