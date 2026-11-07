import { buildMockMarketStatus, buildMockWatchlists } from "@/lib/server/mock-market-data"
import { summarizeCedears } from "@/lib/server/market-calculations"
import type { MarketSnapshot, SettlementMode } from "@/lib/types/market"

interface BrokerPayload {
  marketStatus: MarketSnapshot["marketStatus"]
  watchlists: MarketSnapshot["watchlists"]
}

const BROKER_BASE_URL = process.env.BROKER_BASE_URL
const BROKER_API_KEY = process.env.BROKER_API_KEY

const mapBrokerPayload = (payload: BrokerPayload): MarketSnapshot => {
  const updatedAt = new Date().toISOString()
  return {
    source: "broker",
    updatedAt,
    marketStatus: payload.marketStatus,
    watchlists: payload.watchlists,
    summary: {
      cedears: summarizeCedears(payload.watchlists.cedears),
    },
  }
}

const getMockSnapshot = (settlement: SettlementMode): MarketSnapshot => {
  const now = new Date()
  const watchlists = buildMockWatchlists(settlement)
  return {
    source: "mock",
    updatedAt: now.toISOString(),
    marketStatus: buildMockMarketStatus(now),
    watchlists,
    summary: {
      cedears: summarizeCedears(watchlists.cedears),
    },
  }
}

const fetchBrokerSnapshot = async (settlement: SettlementMode): Promise<MarketSnapshot | null> => {
  if (!BROKER_BASE_URL || !BROKER_API_KEY) return null

  const url = `${BROKER_BASE_URL.replace(/\/$/, "")}/market/snapshot?settlement=${settlement}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BROKER_API_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Broker API error ${response.status}`)
  }

  const payload = (await response.json()) as BrokerPayload
  return mapBrokerPayload(payload)
}

export const getMarketSnapshot = async (settlement: SettlementMode): Promise<MarketSnapshot> => {
  try {
    const brokerSnapshot = await fetchBrokerSnapshot(settlement)
    if (brokerSnapshot) return brokerSnapshot
  } catch (error) {
    console.error("Broker fetch failed, fallback to mock:", error)
  }

  return getMockSnapshot(settlement)
}
