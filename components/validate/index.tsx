"use client"

import { sortCastsByProperty } from "@/lib/helpers"
import useValidate from "@/hooks/validate/useValidate"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CastsAndTweetsFeed from "@/components/feed/castsAndTweets"
import ValidateAudience from "@/components/validate/audience"
import Demand from "@/components/validate/demand"
import ProblemsFeed from "@/components/validate/problems"
import EngagementStats from "@/components/validate/tabs/engagement"
import UsersFeed from "@/components/validate/tabs/users"

interface ValidateTabsProps {
  tweetsAndCasts: any
  problems: any
  tweetsAndCastsForSimilarIdeas: any
  currentIdea: string
}

const Validate = ({
  tweetsAndCasts,
  problems,
  tweetsAndCastsForSimilarIdeas,
  currentIdea,
}: ValidateTabsProps) => {
  const {
    rawStatsMetricsForPosts,
    rawStatsbyUsers,
    formattedFarcasterDataForPieChart,
    formattedTwitterDataForPieChart,
    formattedOverallDataForPieChart,
    overallChartConfig,
    twitterChartConfig,
    farcasterChartConfig,
    overallAuthorChartConfig,
    overallAuthorChartData,
    overallAuthorSummaries,
    farcasterAuthorChartConfig,
    farcasterAuthorChartData,
    twitterAuthoChartData,
    twitterAuthorChartConfig,
  } = useValidate(tweetsAndCasts)
  const sortedPosts = sortCastsByProperty(tweetsAndCasts, "likes_count")

  return (
    <div className="grid w-full  grid-cols-12 gap-x-4">
      {/* <section className="col-span-2 flex flex-col md:flex-1">
          <h2 className="mb-4 text-xl font-bold">Engagement</h2>
          <Engagement rawStats={rawStatsMetricsForPosts} />
        </section> */}
      <section className="col-span-12 mb-4">
        <EngagementStats rawStats={rawStatsMetricsForPosts} />
      </section>
      <Tabs
        defaultValue="stats"
        className="col-span-12 mt-4 flex h-fit items-start justify-start  px-4 sm:px-0  md:items-center  lg:flex-col lg:gap-x-20"
      >
        <TabsList className="flex w-full  flex-row items-start justify-center gap-x-6  bg-transparent  text-lg font-semibold  sm:h-full">
          {/* <TabsTrigger value="count">Count</TabsTrigger> */}
          {/* <TabsTrigger className="  text-left" value="info">
            Info
          </TabsTrigger> */}
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
          <TabsTrigger
            className="flex flex-row items-center gap-x-2 text-left"
            value="related"
          >
            Related Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent
          className=" grid h-fit grid-cols-12 gap-x-4 "
          value="stats"
        >
          <section className="col-span-4 md:flex-1">
            <h2 className="mb-4 text-xl font-bold">Audience Breakdown</h2>

            <div className="flex flex-col gap-y-3">
              <ValidateAudience posts={tweetsAndCasts} />
              {/* <LineComboChart /> */}
            </div>
            {/* <div className="flex flex-col items-start gap-y-4">
          <PieChart
            title={"Overall Engagement Breakdown"}
            description={""}
            chartData={formattedOverallDataForPieChart}
            config={overallChartConfig}
            chartDataKey={"value"}
            labelDataKey={"labelKey"}
            tooltipKey={"value"}
          />
          <div className="flex flex-row gap-x-4">
            <PieChart
              title={"Farcaster Engagement Breakdown"}
              description={""}
              chartData={formattedFarcasterDataForPieChart}
              config={farcasterChartConfig}
              chartDataKey={"value"}
              labelDataKey={"labelKey"}
              tooltipKey={"value"}
            />
            <PieChart
              title={"Twitter Engagement Breakdown"}
              description={""}
              chartData={formattedTwitterDataForPieChart}
              config={twitterChartConfig}
              chartDataKey={"value"}
              labelDataKey={"labelKey"} // This should match the label key used in formatted data
              tooltipKey={"value"} // Ensure this matches the correct key
            />
          </div>
          {/* <VerticalBarChart /> */}

            {/* <div className="flex flex-row gap-x-4">
            <HorizontalBarChart />
            <HorizontalBarChart />
          </div> */}
            {/* </div> */}
          </section>
          <section className="md:flex-2 col-span-4 flex flex-col items-start ">
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
          <section className="col-span-4 md:flex-1">
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
            {/* <div className="flex flex-col items-start gap-y-4">
          <VerticalBarChart
            title="Overall Author Engagement"
            description="Aggregated statistics by author"
            config={overallAuthorChartConfig}
            chartData={overallAuthorChartData}
            xDataKey="followers" // or any other key you want to visualize
            yDataKey="author"
            tooltipKey="followers"
            footerTitle="Author Engagement Analysis"
            footerDescription="Displays aggregated engagement metrics by author."
          />
          <div className="flex flex-row gap-x-4">
            <HorizontalBarChart
              title="Farcaster Author Engagement"
              description="Aggregated statistics by author on Farcaster"
              config={farcasterAuthorChartConfig}
              chartData={farcasterAuthorChartData}
              xDataKey="followers" // or any other key you want to visualize
              yDataKey="author"
              tooltipKey="followers"
              footerTitle="Author Engagement Analysis"
              footerDescription="Displays aggregated engagement metrics by author."
            />
            <HorizontalBarChart
              title="Twitter Author Engagement"
              description="Aggregated statistics by author on Twitter"
              config={twitterAuthorChartConfig}
              chartData={twitterAuthoChartData}
              xDataKey="followers" // or any other key you want to visualize
              yDataKey="author"
              tooltipKey="followers"
              footerTitle="Author Engagement Analysis"
              footerDescription="Displays aggregated engagement metrics by author."
            />
          </div>
          <UsersFeed usersStats={rawStatsbyUsers} />
        </div> */}
          </section>
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
      </Tabs>
    </div>
  )
}

export default Validate
