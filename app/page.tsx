"use client"

import { useCallback, useMemo, useState } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Settings,
  TrendingUp,
} from "lucide-react"

import { useMarketData } from "@/hooks/use-market-data"
import type {
  AccionRow,
  CaucionRow,
  CedearRow,
  CurrencyMode,
  OnRow,
  SettlementMode,
  WatchlistKey,
} from "@/lib/types/market"

type CedearSortableKey =
  | "tcImplicit"
  | "priceARS"
  | "priceUSD"
  | "diff"
  | "spread"
  | "volume"
  | "varDay"

type SortDirection = "asc" | "desc"

const getUpdatedLabel = (updatedAt?: string) => {
  if (!updatedAt) return "Sin datos"
  const diffSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(updatedAt).getTime()) / 1000),
  )
  return `Actualizado hace ${diffSeconds}s`
}

export default function Home() {
  const [activeWatchlist, setActiveWatchlist] = useState<WatchlistKey>("cedears")
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>("ARS")
  const [settlementMode, setSettlementMode] = useState<SettlementMode>("CI")
  const [sortConfig, setSortConfig] = useState<{
    key: CedearSortableKey
    direction: SortDirection
  }>({
    key: "tcImplicit",
    direction: "asc",
  })

  const { data, isLoading, error } = useMarketData({
    settlement: settlementMode,
    refreshMs: 5000,
  })

  const formatNumber = useCallback((num: number, decimals = 2) => {
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  }, [])

  const formatCurrency = useCallback(
    (value: number, currency: CurrencyMode = "ARS") => {
      const symbol = currency === "USD" ? "US$" : "$"
      return `${symbol}${formatNumber(value)}`
    },
    [formatNumber],
  )

  const renderCellValue = useCallback(
    (value: number, type = "number", decimals = 2) => {
      if (type === "percent") {
        const isPositive = value >= 0
        return (
          <span className={isPositive ? "text-green-400" : "text-red-400"}>
            {isPositive ? "+" : ""}
            {formatNumber(value, decimals)}%
          </span>
        )
      }
      return formatNumber(value, decimals)
    },
    [formatNumber],
  )

  const fxRate = data?.marketStatus.dolarMep ?? 1

  const sortedCedears = useMemo(() => {
    const list = data?.watchlists.cedears ?? []
    return [...list].sort((a, b) => {
      const multiplier = sortConfig.direction === "asc" ? 1 : -1
      return (a[sortConfig.key] - b[sortConfig.key]) * multiplier
    })
  }, [data?.watchlists.cedears, sortConfig])

  const acciones = data?.watchlists.acciones ?? []
  const onList = data?.watchlists.on ?? []
  const caucion = data?.watchlists.caucion ?? []

  const sourceLabel = data?.source === "broker" ? "Broker API" : "Mock data"
  const updatedLabel = getUpdatedLabel(data?.updatedAt)

  const renderCedearsTable = (rows: CedearRow[]) => {
    return (
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900">
            <tr>
              <th className="p-2 text-left font-semibold text-slate-400">Ticker</th>
              <th className="p-2 text-left font-semibold text-slate-400">Nombre</th>
              <th className="p-2 text-right font-semibold text-slate-400">Precio ARS</th>
              <th className="p-2 text-right font-semibold text-slate-400">Precio USD</th>
              <th
                className="group cursor-pointer select-none p-2 text-right font-semibold text-slate-400 transition-colors hover:text-cyan-400"
                onClick={() =>
                  setSortConfig((current) => ({
                    key: "tcImplicit",
                    direction: current.direction === "asc" ? "desc" : "asc",
                  }))
                }
              >
                <div className="flex items-center justify-end gap-1">
                  <span>TC Impl. {settlementMode}</span>
                  {sortConfig.key === "tcImplicit" ? (
                    sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )
                  ) : (
                    <div className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50">
                      <ChevronUp className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </th>
              <th className="p-2 text-right font-semibold text-slate-400">TC Ref</th>
              <th className="p-2 text-right font-semibold text-slate-400">Diff %</th>
              <th className="p-2 text-right font-semibold text-slate-400">Spread %</th>
              <th className="p-2 text-right font-semibold text-slate-400">Volumen</th>
              <th className="p-2 text-right font-semibold text-slate-400">Var %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr
                key={item.ticker}
                className="cursor-pointer border-b border-slate-800 transition-colors duration-150 hover:bg-slate-800/50"
              >
                <td className="p-2 font-mono font-bold text-cyan-400">{item.ticker}</td>
                <td className="p-2 text-slate-300">{item.name}</td>
                <td className="p-2 text-right font-mono text-slate-100">
                  {formatCurrency(item.priceARS, "ARS")}
                </td>
                <td className="p-2 text-right font-mono text-slate-100">
                  {formatCurrency(item.priceUSD, "USD")}
                </td>
                <td className="p-2 text-right font-mono font-bold text-amber-400">
                  {formatNumber(item.tcImplicit)}
                </td>
                <td className="p-2 text-right font-mono text-slate-400">{formatNumber(item.tcRef)}</td>
                <td className="p-2 text-right font-mono">{renderCellValue(item.diff, "percent")}</td>
                <td className="p-2 text-right font-mono text-slate-300">{formatNumber(item.spread)}</td>
                <td className="p-2 text-right font-mono text-slate-400">{formatNumber(item.volume, 0)}</td>
                <td className="p-2 text-right font-mono">{renderCellValue(item.varDay, "percent")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderAccionesTable = (rows: AccionRow[]) => {
    const toDisplay = (value: number) =>
      currencyMode === "USD" ? value / fxRate : value

    return (
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900">
            <tr>
              <th className="p-2 text-left font-semibold text-slate-400">Ticker</th>
              <th className="p-2 text-left font-semibold text-slate-400">Nombre</th>
              <th className="p-2 text-right font-semibold text-slate-400">Precio</th>
              <th className="p-2 text-right font-semibold text-slate-400">Var %</th>
              <th className="p-2 text-right font-semibold text-slate-400">Volumen</th>
              <th className="p-2 text-right font-semibold text-slate-400">Bid</th>
              <th className="p-2 text-right font-semibold text-slate-400">Ask</th>
              <th className="p-2 text-right font-semibold text-slate-400">Spread %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr
                key={item.ticker}
                className="cursor-pointer border-b border-slate-800 transition-colors duration-150 hover:bg-slate-800/50"
              >
                <td className="p-2 font-mono font-bold text-cyan-400">{item.ticker}</td>
                <td className="p-2 text-slate-300">{item.name}</td>
                <td className="p-2 text-right font-mono font-bold text-slate-100">
                  {formatCurrency(toDisplay(item.price), currencyMode)}
                </td>
                <td className="p-2 text-right font-mono">{renderCellValue(item.varDay, "percent")}</td>
                <td className="p-2 text-right font-mono text-slate-400">{formatNumber(item.volume, 0)}</td>
                <td className="p-2 text-right font-mono text-green-400">
                  {formatCurrency(toDisplay(item.bid), currencyMode)}
                </td>
                <td className="p-2 text-right font-mono text-red-400">
                  {formatCurrency(toDisplay(item.ask), currencyMode)}
                </td>
                <td className="p-2 text-right font-mono text-slate-300">{formatNumber(item.spread)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderONTable = (rows: OnRow[]) => {
    return (
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900">
            <tr>
              <th className="p-2 text-left font-semibold text-slate-400">Ticker</th>
              <th className="p-2 text-left font-semibold text-slate-400">Nombre</th>
              <th className="p-2 text-right font-semibold text-slate-400">Precio</th>
              <th className="p-2 text-right font-semibold text-slate-400">Paridad</th>
              <th className="p-2 text-right font-semibold text-slate-400">TIR %</th>
              <th className="p-2 text-right font-semibold text-slate-400">Duration</th>
              <th className="p-2 text-left font-semibold text-slate-400">Prox. Cupon</th>
              <th className="p-2 text-center font-semibold text-slate-400">Moneda</th>
              <th className="p-2 text-center font-semibold text-slate-400">Ley</th>
              <th className="p-2 text-right font-semibold text-slate-400">Volumen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr
                key={item.ticker}
                className="cursor-pointer border-b border-slate-800 transition-colors duration-150 hover:bg-slate-800/50"
              >
                <td className="p-2 font-mono font-bold text-cyan-400">{item.ticker}</td>
                <td className="p-2 text-slate-300">{item.name}</td>
                <td className="p-2 text-right font-mono text-slate-100">{formatNumber(item.price)}</td>
                <td className="p-2 text-right font-mono text-slate-300">{formatNumber(item.parity)}</td>
                <td className="p-2 text-right font-mono font-bold text-green-400">{formatNumber(item.tir)}</td>
                <td className="p-2 text-right font-mono text-slate-400">{formatNumber(item.duration)}</td>
                <td className="p-2 font-mono text-slate-300">{item.nextCoupon}</td>
                <td className="p-2 text-center font-mono text-amber-400">{item.currency}</td>
                <td className="p-2 text-center font-mono text-slate-400">{item.law}</td>
                <td className="p-2 text-right font-mono text-slate-400">{formatNumber(item.volume, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderCaucionTable = (rows: CaucionRow[]) => {
    return (
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900">
            <tr>
              <th className="p-2 text-right font-semibold text-slate-400">Plazo (dias)</th>
              <th className="p-2 text-right font-semibold text-slate-400">TNA %</th>
              <th className="p-2 text-right font-semibold text-slate-400">TEA %</th>
              <th className="p-2 text-right font-semibold text-slate-400">Monto</th>
              <th className="p-2 text-center font-semibold text-slate-400">Settlement</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr
                key={`${item.plazo}-${item.settlement}`}
                className="cursor-pointer border-b border-slate-800 transition-colors duration-150 hover:bg-slate-800/50"
              >
                <td className="p-2 text-right font-mono font-semibold text-slate-100">{item.plazo}</td>
                <td className="p-2 text-right font-mono font-bold text-green-400">{formatNumber(item.tna)}</td>
                <td className="p-2 text-right font-mono text-slate-300">{formatNumber(item.tea)}</td>
                <td className="p-2 text-right font-mono text-slate-300">{formatCurrency(item.amount, "ARS")}</td>
                <td className="p-2 text-center font-mono text-[10px] uppercase tracking-wide text-slate-400">
                  {item.settlement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-cyan-400" />
              <h1 className="text-lg font-bold tracking-tight">Financial Terminal</h1>
            </div>

            <div className="ml-8 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    data?.marketStatus.status === "OPEN" ? "animate-pulse bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="font-mono text-slate-400">{data?.marketStatus.status ?? "..."}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono text-slate-300">{data?.marketStatus.time ?? "--:--:--"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500">MERVAL</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold">
                  {formatNumber(data?.marketStatus.merval.value ?? 0, 2)}
                </span>
                <span
                  className={`font-mono ${
                    (data?.marketStatus.merval.change ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {(data?.marketStatus.merval.change ?? 0) >= 0 ? "+" : ""}
                  {formatNumber(data?.marketStatus.merval.change ?? 0, 2)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500">S&P 500</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold">
                  {formatNumber(data?.marketStatus.sp500.value ?? 0, 2)}
                </span>
                <span
                  className={`font-mono ${
                    (data?.marketStatus.sp500.change ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {(data?.marketStatus.sp500.change ?? 0) >= 0 ? "+" : ""}
                  {formatNumber(data?.marketStatus.sp500.change ?? 0, 2)}%
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500">MEP</span>
              <span className="font-mono font-bold text-amber-400">
                {formatCurrency(data?.marketStatus.dolarMep ?? 0, "ARS")}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500">CCL</span>
              <span className="font-mono font-bold text-amber-400">
                {formatCurrency(data?.marketStatus.dolarCcl ?? 0, "ARS")}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={currencyMode === "ARS"}
                className={`rounded px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-slate-900 ${
                  currencyMode === "ARS"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
                onClick={() => setCurrencyMode("ARS")}
              >
                ARS
              </button>
              <button
                type="button"
                aria-pressed={currencyMode === "USD"}
                className={`rounded px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-slate-900 ${
                  currencyMode === "USD"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
                onClick={() => setCurrencyMode("USD")}
              >
                USD
              </button>

              <div className="mx-1 h-6 w-px bg-slate-700" />

              <button
                type="button"
                aria-pressed={settlementMode === "CI"}
                className={`rounded px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-slate-900 ${
                  settlementMode === "CI"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
                onClick={() => setSettlementMode("CI")}
              >
                CI
              </button>
              <button
                type="button"
                aria-pressed={settlementMode === "24hs"}
                className={`rounded px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-slate-900 ${
                  settlementMode === "24hs"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
                onClick={() => setSettlementMode("24hs")}
              >
                24hs
              </button>
            </div>

            <Settings className="ml-2 h-5 w-5 cursor-pointer text-slate-500 transition-colors hover:text-slate-300" />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        <aside className="w-48 border-r border-slate-800 bg-slate-900/40 p-3">
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveWatchlist("cedears")}
              aria-label="Ver CEDEARs"
              aria-pressed={activeWatchlist === "cedears"}
              className={`w-full rounded px-3 py-2 text-left text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                activeWatchlist === "cedears"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                CEDEARs
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveWatchlist("acciones")}
              className={`w-full rounded px-3 py-2 text-left text-sm font-medium transition-all ${
                activeWatchlist === "acciones"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Acciones
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveWatchlist("on")}
              className={`w-full rounded px-3 py-2 text-left text-sm font-medium transition-all ${
                activeWatchlist === "on"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Obligaciones Neg.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveWatchlist("caucion")}
              className={`w-full rounded px-3 py-2 text-left text-sm font-medium transition-all ${
                activeWatchlist === "caucion"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Caucion
              </div>
            </button>

            <div className="mt-4 border-t border-slate-800 pt-4">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Herramientas
              </div>
              <button
                type="button"
                className="w-full rounded px-3 py-2 text-left text-sm font-medium text-slate-400 transition-all hover:bg-slate-800/50 hover:text-slate-200"
              >
                Posiciones
              </button>
              <button
                type="button"
                className="w-full rounded px-3 py-2 text-left text-sm font-medium text-slate-400 transition-all hover:bg-slate-800/50 hover:text-slate-200"
              >
                Alertas
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/30 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-200">
                {activeWatchlist === "cedears" && "CEDEARs - TC Implicito"}
                {activeWatchlist === "acciones" && "Acciones Argentinas"}
                {activeWatchlist === "on" && "Obligaciones Negociables"}
                {activeWatchlist === "caucion" && "Caucion Colocadora"}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="font-mono">{updatedLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="border-b border-red-900/50 bg-red-950/40 px-4 py-2 text-xs text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                Error actualizando datos: {error}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto bg-slate-950/50">
            {isLoading && !data ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Cargando mercado...
              </div>
            ) : (
              <>
                {activeWatchlist === "cedears" && renderCedearsTable(sortedCedears)}
                {activeWatchlist === "acciones" && renderAccionesTable(acciones)}
                {activeWatchlist === "on" && renderONTable(onList)}
                {activeWatchlist === "caucion" && renderCaucionTable(caucion)}
              </>
            )}
          </div>

          <div className="border-t border-slate-800 bg-slate-900/30 px-4 py-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Instrumentos:</span>
                  <span className="font-mono font-bold text-slate-100">
                    {activeWatchlist === "cedears" && sortedCedears.length}
                    {activeWatchlist === "acciones" && acciones.length}
                    {activeWatchlist === "on" && onList.length}
                    {activeWatchlist === "caucion" && caucion.length}
                  </span>
                </div>

                {activeWatchlist === "cedears" && (
                  <>
                    <div className="h-4 w-px bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">TC Prom:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {formatNumber(data?.summary.cedears.avgTcImplicit ?? 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Spread Prom:</span>
                      <span className="font-mono font-bold text-slate-300">
                        {formatNumber(data?.summary.cedears.avgSpread ?? 0)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-600">Terminal v1.1.0</span>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span className="font-mono text-[10px] text-slate-600">{sourceLabel}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
