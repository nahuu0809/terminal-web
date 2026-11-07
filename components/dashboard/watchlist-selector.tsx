"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Settings2 } from "lucide-react"

const watchlists = [
  { id: "1", name: "Top CEDEARs", count: 15 },
  { id: "2", name: "Argentine Stocks", count: 8 },
  { id: "3", name: "Tech Giants", count: 12 }
]

export function WatchlistSelector() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Select defaultValue="1">
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select watchlist" />
          </SelectTrigger>
          <SelectContent>
            {watchlists.map((watchlist) => (
              <SelectItem key={watchlist.id} value={watchlist.id}>
                {watchlist.name} ({watchlist.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Select defaultValue="ci">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ci">Settlement: CI</SelectItem>
            <SelectItem value="24hs">Settlement: 24HS</SelectItem>
            <SelectItem value="all">All Settlements</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="ars">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ars">Currency: ARS</SelectItem>
            <SelectItem value="usd">Currency: USD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
