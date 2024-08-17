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
    <ChartContainer config={chartConfig} className="w-full lg:min-h-[200px]">
      <RadarChart
        cx="50%"
        cy="50%"
        // className="size-full"
        outerRadius="55%"
        data={chartData}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={1} />
            <stop
              offset="100%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0.6}
            />
          </linearGradient>
        </defs>
        <PolarGrid gridType="circle" radialLines={false} />
        <PolarAngleAxis dataKey="name" fontSize={8} />
        <Radar
          name="Demand Score"
          dataKey="demandScore"
          fill="url(#gradient)"
          fillOpacity={0.6}
        />
        <Tooltip content={<ChartTooltipContent />} />
        {/* <Legend /> */}
      </RadarChart>
    </ChartContainer>
  )
}
