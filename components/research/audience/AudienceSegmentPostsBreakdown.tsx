"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Define props for the ChartComponent
interface ChartComponentProps {
  data: { segmentName: string; value: number }[]
  dataKey: string
  headerText: string
  descriptionText: string
  footerText: string
  chartConfig: ChartConfig
}

const AudienceSegmentPostsBreakdown = ({
  data,
  dataKey,
  headerText,
  descriptionText,

  footerText,
  chartConfig,
}: ChartComponentProps) => {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <p className="text-inter text-xl font-semibold">{headerText}</p>
      <ChartContainer
        config={chartConfig}
        className="max-h-[150px] min-h-[100px] w-full"
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            right: 16,
            left: 10,
          }}
        >
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.5}
              />
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0.5}
              />
            </linearGradient>
            {/* Add more gradients as needed */}
          </defs>
          {/* <CartesianGrid horizontal={false} /> */}
          <YAxis
            dataKey="segmentName"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={9}
            className=" font-semibold"
          />
          <XAxis type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey={dataKey}
            layout="vertical"
            fill={chartConfig.metric.color}
            radius={4}
          >
            <LabelList
              dataKey="segmentName"
              position="insideLeft"
              offset={8}
              className="fill-[--color-label] font-bold"
              fontSize={12}
            />
            <LabelList
              dataKey={dataKey}
              position="right"
              offset={8}
              className="fill-foreground  font-semibold"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default AudienceSegmentPostsBreakdown
