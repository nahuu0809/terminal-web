"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Star, 
  TrendingUp, 
  Wallet,
  Bell,
  Settings
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    badge: null
  },
  {
    title: "Watchlists",
    icon: Star,
    href: "/watchlists",
    badge: "3"
  },
  {
    title: "Positions",
    icon: TrendingUp,
    href: "/positions",
    badge: null
  },
  {
    title: "Account",
    icon: Wallet,
    href: "/account",
    badge: null
  },
  {
    title: "Alerts",
    icon: Bell,
    href: "/alerts",
    badge: "2"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    badge: null
  }
]

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-60 border-r border-border", className)}>
      <ScrollArea className="h-full py-4">
        <div className="space-y-1 px-3">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
