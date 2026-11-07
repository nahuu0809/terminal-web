"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, User, DollarSign } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PPI</span>
            </div>
            <h1 className="text-lg font-semibold">Market Terminal</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <span className="h-2 w-2 rounded-full bg-positive mr-1.5 animate-pulse" />
              Market Open
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">USD/ARS MEP</span>
              <span className="font-mono font-semibold">1,245.50</span>
              <span className="text-positive text-xs">+0.5%</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">CCL</span>
              <span className="font-mono font-semibold">1,258.00</span>
              <span className="text-positive text-xs">+0.8%</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account 5822741</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DollarSign className="mr-2 h-4 w-4" />
                Balance: $1,212.02 USD
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
