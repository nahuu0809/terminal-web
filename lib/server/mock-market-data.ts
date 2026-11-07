import type { MarketStatus, MarketWatchlists } from "@/lib/types/market"
import { calculateDiffPercent } from "@/lib/server/market-calculations"

const BASE_TC_REF = 1225

const cedearsBase = [
  { ticker: "AAPL", name: "Apple Inc.", priceARS: 28450, priceUSD: 234.5, spread: 0.12, volume: 145000, varDay: 1.2 },
  { ticker: "MSFT", name: "Microsoft Corp.", priceARS: 52800, priceUSD: 435.2, spread: 0.15, volume: 98000, varDay: -0.5 },
  { ticker: "GOOGL", name: "Alphabet Inc.", priceARS: 18900, priceUSD: 155.4, spread: 0.18, volume: 76000, varDay: 0.8 },
  { ticker: "MELI", name: "MercadoLibre", priceARS: 204500, priceUSD: 1680.5, spread: 0.11, volume: 45000, varDay: -1.1 },
  { ticker: "TSLA", name: "Tesla Inc.", priceARS: 34200, priceUSD: 278.9, spread: 0.22, volume: 112000, varDay: 2.3 },
  { ticker: "NVDA", name: "NVIDIA Corp.", priceARS: 15800, priceUSD: 128.75, spread: 0.25, volume: 156000, varDay: 3.5 },
]

export const buildMockWatchlists = (settlement: "CI" | "24hs"): MarketWatchlists => {
  const tcRef = settlement === "CI" ? BASE_TC_REF : BASE_TC_REF + 8.5

  const cedears = cedearsBase.map((item) => {
    const tcImplicit = Number((item.priceARS / item.priceUSD).toFixed(2))
    return {
      ...item,
      tcImplicit,
      tcRef,
      diff: calculateDiffPercent(tcImplicit, tcRef),
    }
  })

  return {
    cedears,
    acciones: [
      { ticker: "GGAL", name: "Grupo Financiero Galicia", price: 8450, varDay: 2.1, volume: 2400000, bid: 8440, ask: 8460, spread: 0.24 },
      { ticker: "YPF", name: "YPF S.A.", price: 42800, varDay: -1.3, volume: 980000, bid: 42750, ask: 42850, spread: 0.23 },
      { ticker: "PAMP", name: "Pampa Energia", price: 5670, varDay: 0.8, volume: 1560000, bid: 5665, ask: 5675, spread: 0.18 },
      { ticker: "ALUA", name: "Aluar Aluminio", price: 12300, varDay: 1.5, volume: 890000, bid: 12290, ask: 12310, spread: 0.16 },
      { ticker: "TRAN", name: "Transener", price: 3890, varDay: -0.5, volume: 670000, bid: 3885, ask: 3895, spread: 0.26 },
    ],
    on: [
      { ticker: "YCA2O", name: "YPF 2026", price: 96.5, parity: 96.5, tir: 18.5, duration: 2.3, nextCoupon: "15/05/2026", currency: "USD", law: "NY", volume: 450000 },
      { ticker: "PARY26", name: "Pampa 2026", price: 94.2, parity: 94.2, tir: 19.8, duration: 1.8, nextCoupon: "01/08/2026", currency: "USD", law: "NY", volume: 280000 },
      { ticker: "TV28", name: "TGS 2028", price: 89.8, parity: 89.8, tir: 16.2, duration: 3.5, nextCoupon: "22/11/2026", currency: "USD", law: "ARG", volume: 190000 },
      { ticker: "AY24", name: "IRSA 2024", price: 102.3, parity: 102.3, tir: 12.1, duration: 0.5, nextCoupon: "30/06/2026", currency: "USD", law: "NY", volume: 120000 },
    ],
    caucion: [
      { plazo: 1, tna: 38.5, tea: 46.8, amount: 1000000, settlement: "CI" },
      { plazo: 3, tna: 39.2, tea: 47.9, amount: 1000000, settlement: "CI" },
      { plazo: 7, tna: 40.1, tea: 49.2, amount: 1000000, settlement: "CI" },
      { plazo: 14, tna: 41.5, tea: 51.1, amount: 1000000, settlement: "CI" },
      { plazo: 30, tna: 43.2, tea: 53.6, amount: 1000000, settlement: "CI" },
    ],
  }
}

export const buildMockMarketStatus = (updatedAt: Date): MarketStatus => {
  return {
    status: "OPEN",
    time: updatedAt.toLocaleTimeString("es-AR", { hour12: false }),
    merval: { value: 2875432.5, change: 1.84 },
    sp500: { value: 5234.18, change: 0.42 },
    dolarMep: 1225,
    dolarCcl: 1235.5,
  }
}
