"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown } from "lucide-react"

interface Instrument {
  ticker: string
  name: string
  type: "CEDEAR" | "ACCION" | "ON" | "CAUCION"
  price: number
  change: number
  changePercent: number
  volume: string
  tcImplicit?: number
  settlement: string
}

const mockInstruments: Instrument[] = [
  {
    ticker: "GGAL",
    name: "Grupo Financiero Galicia",
    type: "ACCION",
    price: 15450.50,
    change: 356.20,
    changePercent: 2.36,
    volume: "1.2M",
    settlement: "CI"
  },
  {
    ticker: "KO",
    name: "Coca-Cola Co",
    type: "CEDEAR",
    price: 3500.00,
    change: -38.50,
    changePercent: -1.09,
    volume: "485K",
    tcImplicit: 1245.32,
    settlement: "24HS"
  },
  {
    ticker: "AAPL",
    name: "Apple Inc",
    type: "CEDEAR",
    price: 25890.00,
    change: 478.00,
    changePercent: 1.88,
    volume: "752K",
    tcImplicit: 1248.56,
    settlement: "CI"
  },
  {
    ticker: "YPF",
    name: "YPF Sociedad Anonima",
    type: "ACCION",
    price: 28750.00,
    change: -125.00,
    changePercent: -0.43,
    volume: "890K",
    settlement: "CI"
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc Class A",
    type: "CEDEAR",
    price: 18950.00,
    change: 245.30,
    changePercent: 1.31,
    volume: "312K",
    tcImplicit: 1242.18,
    settlement: "24HS"
  },
  {
    ticker: "BBAR",
    name: "Banco BBVA Argentina",
    type: "ACCION",
    price: 8920.00,
    change: 178.50,
    changePercent: 2.04,
    volume: "1.8M",
    settlement: "CI"
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc",
    type: "CEDEAR",
    price: 42300.00,
    change: -892.00,
    changePercent: -2.07,
    volume: "623K",
    tcImplicit: 1251.42,
    settlement: "CI"
  },
  {
    ticker: "PAMP",
    name: "Pampa Energia",
    type: "ACCION",
    price: 6780.00,
    change: 89.00,
    changePercent: 1.33,
    volume: "456K",
    settlement: "24HS"
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp",
    type: "CEDEAR",
    price: 58920.00,
    change: 1245.00,
    changePercent: 2.16,
    volume: "892K",
    tcImplicit: 1243.89,
    settlement: "CI"
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc",
    type: "CEDEAR",
    price: 28456.00,
    change: -234.50,
    changePercent: -0.82,
    volume: "534K",
    tcImplicit: 1247.23,
    settlement: "24HS"
  }
]

export function InstrumentsTable() {
  return (
    <div className="border border-border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Ticker</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Change %</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-right">TC Implicit</TableHead>
            <TableHead>Settlement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockInstruments.map((instrument) => {
            const isPositive = instrument.change > 0
            return (
              <TableRow key={instrument.ticker} className="hover:bg-accent/50">
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Star className="h-3 w-3" />
                  </Button>
                </TableCell>
                <TableCell className="font-mono font-semibold">
                  {instrument.ticker}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {instrument.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {instrument.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${instrument.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`flex items-center justify-end gap-1 font-mono ${isPositive ? 'text-positive' : 'text-negative'}`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {instrument.change > 0 ? '+' : ''}{instrument.change.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                    {instrument.changePercent > 0 ? '+' : ''}{instrument.changePercent.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {instrument.volume}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {instrument.tcImplicit ? `$${instrument.tcImplicit.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {instrument.settlement}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
