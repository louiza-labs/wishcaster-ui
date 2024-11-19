import { Cast as CastType, NormalizedPostType } from "@/types"

export const buildRankings = (
  posts: NormalizedPostType[],
  focus: keyof NormalizedPostType,
  metric: "likesCount" | "commentsCount" | "sharesCount" | "count",
  limit: number
): { name: string; value: number }[] => {
  if (!posts || posts.length === 0 || !Array.isArray(posts)) {
    return []
  }

  const metricsMap = new Map<string, number>()

  posts.forEach((post) => {
    const focusValue =
      focus === "category" && post[focus]
        ? post[focus]?.id || ""
        : (post[focus] as string)

    if (metric === "count") {
      metricsMap.set(focusValue, (metricsMap.get(focusValue) || 0) + 1)
    } else {
      const metricValue = post[metric] || 0
      metricsMap.set(
        focusValue,
        (metricsMap.get(focusValue) || 0) + metricValue
      )
    }
  })

  const sorted = Array.from(metricsMap)
    .map(([name, value]) => ({ name, value }))
    .filter((metric) => metric.name && metric.name.length > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)

  return sorted
}

const filterItems = (
  items: NormalizedPostType[],
  target: NormalizedPostType,
  filterField?: keyof NormalizedPostType
): NormalizedPostType[] => {
  if (!filterField || target[filterField] === undefined) return items

  if (filterField === "category") {
    return items.filter(
      (item) => item["category"]?.id === target["category"]?.id // Use optional chaining
    )
  }

  return items.filter((item) => item[filterField] === target[filterField])
}

export function getRanking(
  target: NormalizedPostType,
  items: NormalizedPostType[],
  metric: "likesCount" | "sharesCount" | "commentsCount",
  filterField?: keyof NormalizedPostType
): number | null {
  const filteredItems = filterItems(items, target, filterField)

  const getValueByMetric = (objectToGetValueFrom: NormalizedPostType) => {
    if (metric === "likesCount") {
      return objectToGetValueFrom.likesCount || 0
    }
    if (metric === "sharesCount") {
      return objectToGetValueFrom.sharesCount || 0
    }
    if (metric === "commentsCount") {
      return objectToGetValueFrom.commentsCount || 0
    }
    return 0
  }

  filteredItems.sort((a, b) => getValueByMetric(b) - getValueByMetric(a))

  for (let rank = 0; rank < filteredItems.length; rank++) {
    if (getValueByMetric(filteredItems[rank]) === getValueByMetric(target)) {
      return rank + 1
    }
  }

  return null
}

export function getTweetRanking(
  target: CastType,
  items: CastType[],
  metric: "likes" | "retweets" | "replies",
  filterField?: keyof CastType
): number | null {
  // Apply filtering only if filterField is provided and the target has this property defined
  const filteredItems =
    filterField && target[filterField] !== undefined
      ? filterField === "category"
        ? items.filter(
            (item) =>
              item["category"] &&
              target["category"] &&
              item["category"].id === target["category"].id
          )
        : items.filter((item) => item[filterField] === target[filterField])
      : items

  const getValueByMetric = (objectToGetValueFrom: any) => {
    if (metric === "likes") {
      if (objectToGetValueFrom.object === "cast") {
        return objectToGetValueFrom.reactions.likes_count
      }
      return objectToGetValueFrom.public_metrics.like_count
    }
    if (metric === "retweets") {
      if (objectToGetValueFrom.object === "cast") {
        return objectToGetValueFrom.reactions.recasts_count
      }
      return objectToGetValueFrom.public_metrics.retweet_count
    }
    if (metric === "replies") {
      if (objectToGetValueFrom.object === "cast") {
        return objectToGetValueFrom.replies
      }
      return objectToGetValueFrom.public_metrics.reply_count
    }
    return 0
  }

  // Sort the filtered items by value in descending order
  filteredItems.sort((a, b) => getValueByMetric(b) - getValueByMetric(a))

  // Find the rank of the target item by comparing values
  for (let rank = 0; rank < filteredItems.length; rank++) {
    if (getValueByMetric(filteredItems[rank]) === getValueByMetric(target)) {
      return rank + 1 // Return rank starting from 1 (more human-readable)
    }
  }

  // If no matching value is found, return null
  return null
}

type TopicRanking = {
  category: string
  rankings: {
    likes_count: number
    recasts_count: number
    replies_count: number
    count: number
  }
}
export function rankTopics(
  posts: any[],
  metrics = ["likes_count", "recasts_count", "replies_count", "count"],
  specificCategoryId?: string
): { [categoryId: string]: any } | any | null {
  // Initialize storage for metrics per category
  const categoryMetrics: {
    [categoryId: string]: {
      likes_count: number
      recasts_count: number
      replies_count: number
      count: number
    }
  } = {}

  // Aggregate metrics for each category
  posts.forEach((post) => {
    const categoryId = post.category?.id
    if (!categoryId) return

    if (!categoryMetrics[categoryId]) {
      categoryMetrics[categoryId] = {
        likes_count: 0,
        recasts_count: 0,
        replies_count: 0,
        count: 0,
      }
    }

    categoryMetrics[categoryId].likes_count += post.likesCount

    categoryMetrics[categoryId].recasts_count += post.sharesCount

    categoryMetrics[categoryId].replies_count += post.commentsCount
    categoryMetrics[categoryId].count += 1
  })

  // Create a sorted list of categories for each metric
  metrics.forEach((metric) => {
    const sortedCategories = Object.entries(categoryMetrics).sort(
      ([, a]: any, [, b]: any) => b[metric] - a[metric]
    )

    // Assign ranking based on the sorted order
    sortedCategories.forEach(([categoryId], index) => {
      const categoryToUpdate: any = categoryMetrics[categoryId]
      categoryToUpdate[`${metric}_rank`] = index + 1
    })
  })

  // If specificCategoryId is provided, return its metrics and rankings
  if (specificCategoryId) {
    return categoryMetrics[specificCategoryId] || null
  }

  return categoryMetrics
}

interface Post {
  id: string
  text: string
  likesCount: number
  sharesCount: number
  // Add other properties as needed
}

interface KeywordStats {
  count: number
  likes: number
  shares: number
}

interface TopKeywords {
  [keyword: string]: KeywordStats
}

export function getTopKeywords(
  posts: Post[],
  keywords: string[],
  industry: string
): TopKeywords {
  const topKeywords: TopKeywords = {}

  // Convert keywords to lowercase for case-insensitive matching
  const lowercaseKeywords = keywords.map((k) => k.toLowerCase())

  // Filter posts by industry (assuming there's an 'industry' field in the Post interface)
  const relevantPosts = posts.filter(
    (post) => (post as any).industry === industry
  )

  relevantPosts.forEach((post) => {
    const lowercaseText = post.text.toLowerCase()

    lowercaseKeywords.forEach((keyword) => {
      if (lowercaseText.includes(keyword)) {
        if (!topKeywords[keyword]) {
          topKeywords[keyword] = { count: 0, likes: 0, shares: 0 }
        }
        topKeywords[keyword].count++
        topKeywords[keyword].likes += post.likesCount
        topKeywords[keyword].shares += post.sharesCount
      }
    })
  })

  // Sort keywords by count (descending order)
  const sortedKeywords = Object.entries(topKeywords).sort(
    (a, b) => b[1].count - a[1].count
  )

  // Return top 10 keywords or all if less than 10
  return Object.fromEntries(sortedKeywords.slice(0, 10))
}
