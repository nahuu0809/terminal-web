import { NextResponse } from "next/server"
import { getMarketSnapshot } from "@/lib/server/market-service"
import type { SettlementMode } from "@/lib/types/market"

const toSettlement = (value: string | null): SettlementMode => {
  if (value === "24hs") return "24hs"
  return "CI"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const settlement = toSettlement(searchParams.get("settlement"))

  const snapshot = await getMarketSnapshot(settlement)
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
