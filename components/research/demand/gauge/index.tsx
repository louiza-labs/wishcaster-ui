"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"

// Function to generate chart data based on the given demand score
function generateChartData(score: number) {
  return [
    {
      name: "Your Idea",
      demandScore: score * 100, // Convert score to percentage for display
      fill: "var(--color-demand)", // Use your color variable for the chart
    },
  ]
}

const chartConfig = {
  demandScore: {
    label: "Demand Score",
  },
  idea: {
    label: "Your Idea",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Demand score gauge component
export default function DemandScoreGauge({ score }: { score: number }) {
  const chartData = generateChartData(score)

  return (
    <ChartContainer config={chartConfig} className="min-h-[140px] w-full">
      <RadialBarChart
        data={chartData}
        startAngle={360}
        endAngle={0}
        innerRadius={65}
        outerRadius={91}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          polarRadius={[60, 50]}
        />
        <RadialBar dataKey="demandScore" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {chartData[0].demandScore.toFixed(1)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Demand Score
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
