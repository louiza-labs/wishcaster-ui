"use client"

import { LabelList, Pie, PieChart as PieChartElement } from "recharts"

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

interface PieChartProps {
  title?: string
  description?: string
  config: any
  chartData: any
  chartDataKey: string
  labelDataKey: string
  tooltipKey: string
  footerTitle?: string
  footerDescription?: string
}

export function PieChart({
  title,
  description,
  config,
  chartData,
  chartDataKey,
  labelDataKey,
  tooltipKey,
  footerDescription,
  footerTitle,
}: PieChartProps) {
  return (
    <Card className="flex flex-col">
      {title || description ? (
        <CardHeader className="items-center pb-0">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square min-h-[200px]"
        >
          <PieChartElement>
            <ChartTooltip
              content={<ChartTooltipContent nameKey={tooltipKey} hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey={chartDataKey}
              // fill={config[chartDataKey]?.color}
            >
              <LabelList
                dataKey={labelDataKey}
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={
                  (value: keyof typeof config) => {
                    console.log("the value", value)
                    console.log("the config", config)

                    return config[value]?.label || value
                  } // Ensure fallback to value
                }
              />
            </Pie>
          </PieChartElement>
        </ChartContainer>
      </CardContent>
      {footerTitle || footerDescription ? (
        <CardFooter className="flex-col gap-2 text-sm">
          {footerTitle ? (
            <div className="flex items-center gap-2 font-medium leading-none">
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
