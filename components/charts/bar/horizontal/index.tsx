"use client"

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface HorizontalBarChartProps {
  title?: string
  description?: string
  config: any
  chartData: any
  xDataKey: string
  yDataKey: string
  tooltipKey: string
  footerTitle?: string
  footerDescription?: string
}

export function HorizontalBarChart({
  title,
  description,
  config,
  chartData,
  xDataKey,
  yDataKey,
  tooltipKey,
  footerDescription,
  footerTitle,
}: HorizontalBarChartProps) {
  return (
    <Card>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <RechartsBarChart
            accessibilityLayer
            data={chartData}
            layout="horizontal"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey={yDataKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={
                (value) => config[value as keyof typeof config]?.label || value // Ensure fallback to value
              }
            />
            <XAxis dataKey={xDataKey} type="number" hide={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={xDataKey}
              fill={config[xDataKey]?.color}
              layout="horizontal"
              radius={5}
            />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
      {footerTitle || footerDescription ? (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footerTitle ? (
            <div className="flex gap-2 font-medium leading-none">
              {footerTitle}
            </div>
          ) : null}
          {footerDescription ? (
            <div className="leading-none text-muted-foreground">
              {footerDescription}
            </div>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  )
}
