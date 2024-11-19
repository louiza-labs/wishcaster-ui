import { TrendingUp } from "lucide-react"

import { KeywordTrend, topKeywords } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TopKeywordsCardProps {
  className?: string
}

export function TopKeywordsCard({ className }: TopKeywordsCardProps) {
  return (
    <Card className={`bg-white shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-slate-800">
          Top performing keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topKeywords.map((keyword) => (
            <KeywordRow key={keyword.keyword} {...keyword} />
          ))}
        </div>
        <Button
          className="mt-6 w-full"
          onClick={() => (window.location.href = "/product-roadmap")}
        >
          Update Product Roadmap
        </Button>
      </CardContent>
    </Card>
  )
}

interface KeywordRowProps {
  keyword: string
  count: number
  trend: KeywordTrend
}

function KeywordRow({ keyword, count, trend }: KeywordRowProps) {
  const trendIcon = {
    up: <TrendingUp className="size-4 text-green-500" />,
    down: <TrendingUp className="size-4 rotate-180 text-red-500" />,
    neutral: <TrendingUp className="size-4 rotate-90 text-yellow-500" />,
  }

  return (
    <div className="flex items-center">
      <div className="w-1/4 text-sm font-medium text-slate-600">{keyword}</div>
      <div className="flex w-3/4 items-center">
        <Progress
          value={(count / topKeywords[0].count) * 100}
          className="mr-2"
        />
        <span className="mr-2 text-sm text-slate-600">{count}</span>
        {trendIcon[trend]}
      </div>
    </div>
  )
}
