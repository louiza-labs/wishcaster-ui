import { Cast as CastType } from "@/types"

export const buildRankings = (
  casts: CastType[],
  focus: keyof CastType,
  metric: "likes_count" | "replies_count" | "recasts_count" | "count",
  limit: number
): { name: string; value: number }[] => {
  if (!casts || casts.length === 0 || !Array.isArray(casts)) {
    return []
  }

  // Create an object to accumulate metrics
  const metricsMap = new Map<string, number>()

  casts.forEach((cast: any) => {
    const focusValue =
      focus === "category" && cast[focus]
        ? cast[focus].id
        : focus === "category" && !cast[focus]
        ? ""
        : (cast[focus] as string) // Ensuring the value is treated as a string
    if (metric === "count") {
      // Count occurrences of each focus value
      metricsMap.set(focusValue, (metricsMap.get(focusValue) || 0) + 1)
    } else if (metric === "replies_count") {
      const metricValue =
        cast.object === "cast"
          ? cast["replies"]["count"] || 0
          : cast.public_metrics.reply_count || 0
      metricsMap.set(
        focusValue,
        (metricsMap.get(focusValue) || 0) + metricValue
      )
    } else {
      const metricValue =
        cast.object === "cast"
          ? cast["reactions"][metric] || 0
          : cast.public_metrics[
              metric === "likes_count" ? "like_count" : "retweet_count"
            ] || 0

      metricsMap.set(
        focusValue,
        (metricsMap.get(focusValue) || 0) + metricValue
      )

      // Sum the metric values for each focus value
    }
  })

  // Convert the map into an array, sort it, and slice it to the limit
  const sorted = Array.from(metricsMap)
    .map(([name, value]) => ({ name, value }))
    .filter((metric) => metric.name && metric.name.length > 0)
    .sort((a, b) => b.value - a.value) // Sort in descending order by value
    .slice(0, limit)

  return sorted
}

export function getRanking(
  target: CastType,
  items: CastType[],
  metric: "likes" | "recasts" | "replies",
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
      return objectToGetValueFrom.reactions
        ? objectToGetValueFrom.reactions.likes_count
        : 0
    }
    if (metric === "recasts") {
      return objectToGetValueFrom.reactions
        ? objectToGetValueFrom.reactions.recasts_count
        : 0
    }
    if (metric === "replies") {
      return objectToGetValueFrom.reactions ? objectToGetValueFrom.replies : 0
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
  casts: any[],
  topic = ""
): TopicRanking[] | TopicRanking | null {
  // Initialize storage for metrics per category
  const metrics: {
    [key: string]: {
      likes_count: number
      recasts_count: number
      replies_count: number
      count: number
    }
  } = {}

  // Aggregate metrics for each category
  casts.forEach((cast) => {
    if (!(cast.category && cast.category.id)) return
    const category = cast.category.id
    if (!metrics[category]) {
      metrics[category] = {
        likes_count: 0,
        recasts_count: 0,
        replies_count: 0,
        count: 0,
      }
    }
    metrics[category].likes_count +=
      cast.object === "cast"
        ? cast.reactions.likes_count
        : cast.public_metrics.like_count
    metrics[category].recasts_count +=
      cast.object === "cast"
        ? cast.reactions.recasts_count
        : cast.public_metrics.retweet_count
    metrics[category].replies_count +=
      cast.object === "cast"
        ? cast.replies.count
        : cast.public_metrics.reply_count
    metrics[category].count += 1
  })

  // Convert the metrics object to an array
  const categories = Object.entries(metrics).map(([category, data]) => ({
    category,
    rankings: { ...data },
  }))

  // Calculate rankings for each metric, including count
  const sortableMetrics = [
    "likes_count",
    "recasts_count",
    "replies_count",
    "count",
  ]
  sortableMetrics.forEach((metric) => {
    const sorted = [...categories].sort(
      (a: any, b: any) => b.rankings[metric] - a.rankings[metric]
    )
    sorted.forEach((cat, index) => {
      const categoryToUpdate: any = categories.find(
        (c) => c.category === cat.category
      )
      categoryToUpdate.rankings[metric] = index + 1
    })
  })

  if (topic && topic.length) {
    const selectedTopic = categories.find(
      (category) => category.category === topic
    )
    return selectedTopic || null // Return null if no topic matches
  }

  return categories
}
