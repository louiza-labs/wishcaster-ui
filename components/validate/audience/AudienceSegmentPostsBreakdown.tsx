"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardTitle>{headerText}</CardTitle>
        <CardDescription>{descriptionText}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="segmentName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={8}
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
                className="fill-[--color-label]"
                fontSize={10}
              />
              <LabelList
                dataKey={dataKey}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {footerText}
        </div> */}
      </CardFooter>
    </Card>
  )
}

export default AudienceSegmentPostsBreakdown
