// Function to format audience segment data for charting
export function formatChartData(audienceSegments: any, metricKey: any) {
  return audienceSegments.map((segment) => ({
    segmentName: segment.segmentName,
    value: segment[metricKey],
  }))
}

// Example function to retrieve and format data specifically for post count
export function getChartDataForPostCount(audienceSegments: any) {
  return formatChartData(audienceSegments, "postCount")
}

// You can also create similar functions for other metrics, such as totalLikes, totalRecasts, totalReplies
export function getChartDataForLikes(audienceSegments: any) {
  return formatChartData(audienceSegments, "engagementStats.totalLikes")
}

export function generateChartConfig(metricLabel, color, labelColor) {
  return {
    metric: {
      label: metricLabel,
      color: `hsl(${color})`,
    },
    label: {
      color: `hsl(${labelColor})`,
    },
  } satisfies any
}
