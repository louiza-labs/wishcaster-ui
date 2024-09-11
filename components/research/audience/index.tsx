"use client"

import { useMemo } from "react"

import useValidateAudience from "@/hooks/validate/audience/useValidateAudience"
import AudienceSegmentPostsBreakdown from "@/components/research/audience/AudienceSegmentPostsBreakdown"

interface ValidateAudienceProps {
  posts: Array<any> // Replace 'any' with the actual type of posts if possible
}

const ValidateAudience = ({ posts }: ValidateAudienceProps) => {
  const {
    postsCountChartConfig,
    postsCountChartsData,
    totalLikesChartConfig,
    totalLikesData,
    postsByChannelCountChartConfig,
    postsByChannelCountChartsData,
  } = useValidateAudience(posts)

  // Memoize the data to avoid unnecessary rerenders
  const memoizedPostsCountChartsData = useMemo(
    () => postsCountChartsData,
    [postsCountChartsData]
  )
  const memoizedPostsCountChartConfig = useMemo(
    () => postsCountChartConfig,
    [postsCountChartConfig]
  )

  return (
    <div className="flex w-full flex-col items-center gap-y-4 lg:flex-row lg:gap-x-4">
      <div className="size-full rounded-xl border border-input bg-background px-6 py-8 shadow-lg">
        <AudienceSegmentPostsBreakdown
          data={memoizedPostsCountChartsData}
          dataKey="value"
          headerText="Who's asking for this?"
          descriptionText="Post Count by Audience Segment"
          footerText="Showing post counts by audience segment"
          chartConfig={memoizedPostsCountChartConfig}
        />
      </div>
      {/* Uncomment if needed */}
      {/* <div className="size-full rounded-xl border border-input bg-background px-6 py-8 shadow-lg">
        <AudienceSegmentPostsBreakdown
          data={postsByChannelCountChartsData}
          dataKey="value"
          headerText="Where are they asking this?"
          descriptionText="Total Likes by Audience Segment"
          footerText="Showing total likes by audience segment"
          chartConfig={postsByChannelCountChartConfig}
        />
      </div> */}
    </div>
  )
}

export default ValidateAudience
