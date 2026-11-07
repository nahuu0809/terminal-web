import type { CedearRow, CedearSummary } from "@/lib/types/market"

const round = (value: number, decimals = 2) => {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export const calculateDiffPercent = (implicitTc: number, tcRef: number) => {
  if (tcRef === 0) return 0
  return round(((implicitTc - tcRef) / tcRef) * 100, 2)
}

export const summarizeCedears = (cedears: CedearRow[]): CedearSummary => {
  if (cedears.length === 0) {
    return { avgTcImplicit: 0, avgSpread: 0 }
  }

  const totals = cedears.reduce(
    (acc, item) => {
      acc.tc += item.tcImplicit
      acc.spread += item.spread
      return acc
    },
    { tc: 0, spread: 0 },
  )

  return {
    avgTcImplicit: round(totals.tc / cedears.length, 2),
    avgSpread: round(totals.spread / cedears.length, 2),
  }
}
