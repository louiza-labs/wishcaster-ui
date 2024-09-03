type PostSummary = {
  likes: number
  priorityLikes: number
  recasts: number
  replies: number
  count: number
  impressions: number
  bookmarks: number
  totalFollowers: number
  averageFollowerCount: number
}
// A list of colors for the charts to use
const graphColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A5",
  "#A533FF",
  "#33FFA5",
  "#FFA533",
  "#FF3333",
  "#33FF33",
  "#3333FF",
]

// Transforms a summary object into a config object for chart labels and colors
export const transformSummaryForChartConfig = (summary: PostSummary) => {
  return Object.keys(summary).map((key, index) => ({
    key,
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()), // Transform camelCase to readable format
  }))
}

// Builds a configuration for the chart using the given keys and labels
export const buildConfigForChart = (chartKeysAndLabels: any) => {
  const config = chartKeysAndLabels.reduce(
    (keyAndLabels: any, currentKeyAndLabel: any, index: number) => {
      keyAndLabels[currentKeyAndLabel.key] = {
        label: currentKeyAndLabel.label,
        color: graphColors[index % graphColors.length], // Cycle through colors
      }
      return keyAndLabels
    },
    {}
  )
  config.value = {
    label: "Value",
  }
  return config
}

// Transforms the summary object for use in a pie chart
export const transformSummaryForPieChart = (
  summary: any,
  config: Record<string, { label: string; color: string }>,
  fieldsToExclude: any = []
) => {
  return (
    Object.keys(summary)
      // .filter((key) => !fieldsToExclude.includes(key))
      .map((key) => {
        return {
          labelKey: key,
          dataKey: "value",
          label: config[key]?.label || key,
          value: summary[key],
          color: config[key]?.color || "#000000", // Default color if not found
        }
      })
  )
}

// Formats the data for the pie chart
export const formatDataForPiechart = (dataForChart: any, labelKey: string) => {
  return dataForChart.map((chartItem: any) => ({
    labelKey: chartItem.label,
    [chartItem.dataKey]: chartItem.value,
    fill: chartItem.color,
  }))
}

type ChartConfig = {
  label: string
  color: string
}

export const generateAverageFollowerData = (posts: any) => {
  let totalFollowers = 0
  posts.forEach((post: any) => {
    totalFollowers += post.totalFollowers
  })
  const averageFollowers =
    posts.length > 0 ? Math.round(totalFollowers / posts.length) : 0

  return [{ name: "Average Followers", followers: averageFollowers }]
}

export const formatTrendsData = (trends: any) => {
  return trends.map((trend: any) => ({
    time: trend.date, // assuming 'date' is a field in your trend data
    interest: trend.interestLevel, // assuming 'interestLevel' is a measure of search interest
  }))
}

const chartLabels = {
  likes: "Likes",
  recasts: "Recasts",
  replies: "Replies",
  impressions: "Impressions",
  bookmarks: "Bookmarks",
  totalPosts: "Total Posts",
  followers: "Followers",
}

export function transformAuthorSummariesForChart(authorSummaries: any[]) {
  return authorSummaries.map((summary) => ({
    author: summary.user.username || summary.user.name, // Use username or name as the identifier
    likes: summary.likes,
    recasts: summary.recasts,
    replies: summary.replies,
    impressions: summary.impressions,
    bookmarks: summary.bookmarks,
    totalPosts: summary.totalPosts,
    followers: summary.user.followerCount,
  }))
}
