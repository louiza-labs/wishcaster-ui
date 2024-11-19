import { RefreshCw, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AiActionPlanCardProps {
  aiInsight: string
  onRefresh: () => void
}

export function AiActionPlanCard({
  aiInsight,
  onRefresh,
}: AiActionPlanCardProps) {
  return (
    <Card className="mb-8 bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-800">
            AI-Powered Action Plan
          </CardTitle>
          <CardDescription className="text-slate-600">
            Tailored recommendations based on social trends
          </CardDescription>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onRefresh}>
                <RefreshCw className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate new insight</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="mb-4 flex items-center">
            <Zap className="mr-2 size-6 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800">
              Recommended Action:
            </h3>
          </div>
          <p className="mb-6 text-lg text-slate-700">{aiInsight}</p>
          <Button
            className="w-full"
            size="lg"
            onClick={() => (window.location.href = "/implement-action")}
          >
            Implement This Action
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
