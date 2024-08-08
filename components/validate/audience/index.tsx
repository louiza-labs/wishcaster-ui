"use client"

import useValidateAudience from "@/hooks/validate/audience/useValidateAudience"
import AudienceSegmentPostsBreakdown from "@/components/validate/audience/AudienceSegmentPostsBreakdown"

const ValidateAudience = ({ posts }: any) => {
  const {
    postsCountChartConfig,
    postsCountChartsData,
    totalLikesChartConfig,
    totalLikesData,
  } = useValidateAudience(posts)

  return (
    <div className="flex flex-col gap-y-3">
      <AudienceSegmentPostsBreakdown
        data={postsCountChartsData}
        dataKey="value"
        headerText="Audience Segment Post Counts"
        descriptionText="Post Count by Audience Segment"
        footerText="Showing post counts by audience segment"
        chartConfig={postsCountChartConfig}
      />
      <AudienceSegmentPostsBreakdown
        data={totalLikesData}
        dataKey="value"
        headerText="Audience Segment Total Likes"
        descriptionText="Total Likes by Audience Segment"
        footerText="Showing total likes by audience segment"
        chartConfig={totalLikesChartConfig}
      />
    </div>
  )
}

export default ValidateAudience
