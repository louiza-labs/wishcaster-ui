"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import
  {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import
  {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function Component() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}


 {/* <Tabs
        defaultValue="stats"
        className="col-span-12 mt-4 flex h-fit items-start justify-start gap-y-4  border px-4  sm:px-0 md:items-center  lg:flex-col "
      >
        <TabsList className="flex w-full  flex-row items-start justify-center gap-x-6  bg-transparent  text-lg font-semibold  sm:h-full">
          <TabsTrigger
            className="flex flex-row items-center gap-x-2 text-left"
            value="stats"
          >
            Insights
          </TabsTrigger>

          <TabsTrigger
            className="flex flex-row items-center gap-x-2 text-left"
            value="posts"
          >
            Top Posts
          </TabsTrigger>
          <TabsTrigger
            className="flex flex-row items-center gap-x-2 text-left"
            value="users"
          >
            Top Users
          </TabsTrigger>
          {/* <TabsTrigger
            className="flex flex-row items-center gap-x-2 text-left"
            value="related"
          >
            Related Projects
          </TabsTrigger> */}
          </TabsList>

          <TabsContent
            className="border-blue grid h-fit w-full grid-cols-12 gap-x-4 "
            value="stats"
          >
            <div className="col-span-3">
              <h2 className="mb-4 text-xl font-bold">Top Posts</h2>
  
              <CastsAndTweetsFeed
                timeFilterParam={""}
                nextCursor={""}
                columns={"grid-cols-1"}
                //  topic={""}
                casts={[]}
                tweets={sortedPosts.slice(0, 10)}
              />
            </div>
  
            <section className="col-span-2 md:flex-1">
              <h2 className="mb-4 text-xl font-bold">Audience Breakdown</h2>
  
              <div className="flex flex-col gap-y-3">
                <ValidateAudience posts={tweetsAndCasts} />
                {/* <LineComboChart /> */}
              </div>
            </section>
            <section className="md:flex-2 col-span-2 flex flex-col items-start ">
              <h2 className="mb-4 text-xl font-bold">
                Potential Unsolved Problems
              </h2>
              <div className="flex h-screen w-full flex-col gap-y-3 overflow-y-scroll">
                <ProblemsFeed problemsData={problems} />
                {/* <DonutComboChart />
                <VerticalBarComboChart /> */}
              </div>
              {/* <CastsAndTweetsFeed
            timeFilterParam={""}
            nextCursor={""}
            columns={"grid-cols-1"}
            topic={""}
            casts={[]}
            tweets={sortedPosts.slice(0, 10)}
          /> */}
            </section>
            <section className="col-span-2 md:flex-1">
              <h2 className="mb-4 text-xl font-bold">Demand Outlook</h2>
              <div className="flex w-full flex-col gap-y-3">
                {/* <DonutComboChart />
                <VerticalBarComboChart /> */}
                <Demand
                  tweetsAndCastsForCurrentIdea={tweetsAndCasts}
                  tweetsAndCastsForSimilarIdeas={tweetsAndCastsForSimilarIdeas}
                  currentIdea={currentIdea}
                />
              </div>
            </section>
            <div className="col-span-3">
              <h2 className="mb-4 text-xl font-bold">Top Users</h2>
  
              <UsersFeed usersStats={rawStatsbyUsers} />
            </div>
          </TabsContent>
          <TabsContent className=" h-full" value="posts">
            <CastsAndTweetsFeed
              timeFilterParam={""}
              nextCursor={""}
              //  columns={"grid-cols-2"}
              //  topic={""}
              casts={[]}
              tweets={sortedPosts.slice(0, 10)}
            />
          </TabsContent>
  
          <TabsContent className="h-full" value="users">
            <UsersFeed usersStats={rawStatsbyUsers} />
          </TabsContent>
          {/* <TabsContent className="h-full" value="related">
            <RelatedProjects
              searchIdea={currentIdea}
              similarIdeas={similarIdeas}
            />
          </TabsContent> */}
        </Tabs> */}