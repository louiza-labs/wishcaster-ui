// Function to format audience segment data for charting
export function formatChartData(audienceSegments: any, metricKey: any) {
  const metricHasDepth = metricKey.includes(".")
  const splitMetricKeyArr = metricKey.split(".")
  const metricKey1 = splitMetricKeyArr[0]
  const metricKey2 = splitMetricKeyArr[1]
  return audienceSegments.map((segment: any) => ({
    segmentName: segment.segmentName,
    value: metricHasDepth
      ? segment[metricKey1][metricKey2]
      : segment[metricKey],
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

export function generateChartConfig(
  metricLabel: string,
  gradientId: string,
  labelColor: string
) {
  return {
    metric: {
      label: metricLabel,
      color: `url(#${gradientId})`, // Reference the gradient
    },
    label: {
      color: `hsl(${labelColor})`,
    },
  } satisfies any
}
