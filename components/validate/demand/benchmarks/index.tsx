"use client"

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Function to generate chart data from benchmark data
function generateChartData(
  benchmarkData: { name: string; demandScore: number }[]
) {
  return benchmarkData.map((item) => ({
    name: item.name,
    demandScore: item.demandScore * 100, // Convert to percentage for display
  }))
}

const chartConfig = {
  demandScore: {
    label: "Demand Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

// Component to display radar chart for demand scores comparison
export default function BenchmarkComparison({
  benchmarkData,
}: {
  benchmarkData: { name: string; demandScore: number }[]
}) {
  const chartData = generateChartData(benchmarkData)

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Demand Score Comparison</CardTitle>
        <CardDescription>Visualize Demand Across Ideas</CardDescription>
      </CardHeader>
      <CardContent className=" pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <RadarChart cx="50%" cy="50%" outerRadius="90%" data={chartData}>
            <PolarGrid gridType="circle" radialLines={false} />
            <PolarAngleAxis dataKey="name" fontSize={8} />
            <Radar
              name="Demand Score"
              dataKey="demandScore"
              fill="var(--color-demand)"
              fillOpacity={0.6}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Demand score trends <TrendingUp className="size-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Based on market analysis
        </div>
      </CardFooter> */}
    </Card>
  )
}
