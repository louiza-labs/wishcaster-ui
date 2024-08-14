"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Tooltip } from "recharts"

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
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RadarChart
        cx="50%"
        cy="50%"
        // className="size-full"
        outerRadius="65%"
        data={chartData}
      >
        <PolarGrid gridType="circle" radialLines={false} />
        <PolarAngleAxis dataKey="name" fontSize={8} />
        <Radar
          name="Demand Score"
          dataKey="demandScore"
          fill="var(--color-demand)"
          fillOpacity={0.6}
        />
        <Tooltip content={<ChartTooltipContent />} />
        {/* <Legend /> */}
      </RadarChart>
    </ChartContainer>
  )
}
