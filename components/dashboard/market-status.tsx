import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const indices = [
  {
    name: "S&P MERVAL",
    value: "1,847,235.88",
    change: "+23,902.15",
    changePercent: "+1.31%",
    isPositive: true
  },
  {
    name: "S&P 500",
    value: "5,997.95",
    change: "+8.26",
    changePercent: "+0.14%",
    isPositive: true
  },
  {
    name: "DOW JONES",
    value: "43,025.88",
    change: "-156.78",
    changePercent: "-0.36%",
    isPositive: false
  },
  {
    name: "NASDAQ",
    value: "19,156.85",
    change: "+32.67",
    changePercent: "+0.17%",
    isPositive: true
  }
]

export function MarketStatus() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {indices.map((index) => (
        <Card key={index.name}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{index.name}</p>
                <p className="text-xl font-mono font-semibold">{index.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm font-medium ${index.isPositive ? 'text-positive' : 'text-negative'}`}>
                    {index.change}
                  </span>
                  <span className={`text-xs ${index.isPositive ? 'text-positive' : 'text-negative'}`}>
                    {index.changePercent}
                  </span>
                </div>
              </div>
              <div className={`${index.isPositive ? 'text-positive' : 'text-negative'}`}>
                {index.isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
