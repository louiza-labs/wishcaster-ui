"use client"

import useValidateAudience from "@/hooks/validate/audience/useValidateAudience"
import AudienceSegmentPostsBreakdown from "@/components/research/audience/AudienceSegmentPostsBreakdown"

const ValidateAudience = ({ posts }: any) => {
  const {
    postsCountChartConfig,
    postsCountChartsData,
    totalLikesChartConfig,
    totalLikesData,
    postsByChannelCountChartConfig,
    postsByChannelCountChartsData,
  } = useValidateAudience(posts)

  return (
    <div className="flex w-full flex-row items-center gap-x-4">
      <div className="size-full rounded-xl border border-input bg-background px-6 py-8 shadow-lg ">
        <AudienceSegmentPostsBreakdown
          data={postsCountChartsData}
          dataKey="value"
          headerText="Who's asking for this?"
          descriptionText="Post Count by Audience Segment"
          footerText="Showing post counts by audience segment"
          chartConfig={postsCountChartConfig}
        />
      </div>
      <div className="size-full rounded-xl border border-input bg-background px-6 py-8 shadow-lg ">
        <AudienceSegmentPostsBreakdown
          data={postsByChannelCountChartsData}
          dataKey="value"
          headerText="Where are they asking this?"
          descriptionText="Total Likes by Audience Segment"
          footerText="Showing total likes by audience segment"
          chartConfig={postsByChannelCountChartConfig}
        />
      </div>
    </div>
  )
}

export default ValidateAudience
