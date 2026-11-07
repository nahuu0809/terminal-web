export type WatchlistKey = "cedears" | "acciones" | "on" | "caucion"
export type SettlementMode = "CI" | "24hs"
export type CurrencyMode = "ARS" | "USD"
export type DataSource = "mock" | "broker"

export interface MarketIndex {
  value: number
  change: number
}

export interface MarketStatus {
  status: "OPEN" | "CLOSED"
  time: string
  merval: MarketIndex
  sp500: MarketIndex
  dolarMep: number
  dolarCcl: number
}

export interface CedearRow {
  ticker: string
  name: string
  priceARS: number
  priceUSD: number
  tcImplicit: number
  tcRef: number
  diff: number
  spread: number
  volume: number
  varDay: number
}

export interface AccionRow {
  ticker: string
  name: string
  price: number
  varDay: number
  volume: number
  bid: number
  ask: number
  spread: number
}

export interface OnRow {
  ticker: string
  name: string
  price: number
  parity: number
  tir: number
  duration: number
  nextCoupon: string
  currency: string
  law: string
  volume: number
}

export interface CaucionRow {
  plazo: number
  tna: number
  tea: number
  amount: number
  settlement: SettlementMode
}

export interface MarketWatchlists {
  cedears: CedearRow[]
  acciones: AccionRow[]
  on: OnRow[]
  caucion: CaucionRow[]
}

export interface CedearSummary {
  avgTcImplicit: number
  avgSpread: number
}

export interface MarketSummary {
  cedears: CedearSummary
}

export interface MarketSnapshot {
  source: DataSource
  updatedAt: string
  marketStatus: MarketStatus
  watchlists: MarketWatchlists
  summary: MarketSummary
}
