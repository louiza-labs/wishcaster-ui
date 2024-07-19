import { Cast as CastType } from "@/types"

type StatsObject = {
  [key: string]: {
    label: string
    value: string | number
    rank: number
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toString()
  }
}

export const generateStatsObjectForTopic = (
  topicStatsAndRankings: any | null
): StatsObject => {
  if (!topicStatsAndRankings) return {}

  const {
    count: countRank = 0,
    likes_count: likesRank = 0,
    recasts_count: recastsRank = 0,
    replies_count: repliesRank = 0,
  } = topicStatsAndRankings.rankings || {}

  const statsObject: StatsObject = {
    casts: {
      label: "Casts",
      value: formatNumber(topicStatsAndRankings.count || 0),
      rank: countRank,
    },
    likes: {
      label: "Likes",
      value: formatNumber(topicStatsAndRankings.likes || 0),
      rank: likesRank,
    },
    replies: {
      label: "Replies",
      value: formatNumber(topicStatsAndRankings.replies || 0),
      rank: repliesRank,
    },
    recasts: {
      label: "Recasts",
      value: formatNumber(topicStatsAndRankings.recasts || 0),
      rank: recastsRank,
    },
  }

  return statsObject
}

interface CategorySummary {
  id: string
  topic: string
  likes: number
  priorityLikes: number
  recasts: number
  replies: number
  count: number
  totalFollowers: number
  averageFollowerCount: number
  // powerBadgeCount: number
}

export function summarizeByCategory(
  casts: CastType[],
  sortField?: keyof CategorySummary
): CategorySummary[] {
  const summaries = new Map<string, CategorySummary>()
  casts.forEach((cast) => {
    const { category, reactions, replies, author } = cast
    if (!category || !(category && category.id)) return

    if (!summaries.has(category.id)) {
      summaries.set(category.id, {
        id: category.id.replace(/\s+/g, "-"),
        topic: category.label,
        likes: 0,
        priorityLikes: 0,
        recasts: 0,
        replies: 0,
        count: 0,
        averageFollowerCount: 0,
        totalFollowers: 0,
        // powerBadgeCount: 0
      })
    }

    const summary = summaries.get(category.id)!
    summary.likes += reactions.likes_count
    summary.recasts += reactions.recasts_count
    summary.replies += replies.count
    summary.count += 1
    summary.totalFollowers += author.follower_count
    summary.averageFollowerCount = Math.floor(
      summary.totalFollowers / summary.count
    )
    // if (author.power_badge) summary.powerBadgeCount += 1;
  })

  // Convert summaries to array and optionally sort
  let result = Array.from(summaries.values())
  if (sortField) {
    result.sort((a: any, b: any) => b[sortField] - a[sortField])
  }

  return result
}

export const generateStatsFromProfiles = (
  profiles: any[],
  cast: CastType,
  stat: string
) => {
  if (!profiles || !Array.isArray(profiles) || !cast) return { value: 0 }
  const profilesAsObject = profiles.reduce((profileObj, profile) => {
    const { fid, power_badge, active_status } = profile
    profileObj[fid] = { power_badge, active_status }
    return profileObj
  }, {})

  if (stat === "priority_likes") {
    const priorityLikes = profiles.reduce((count, profile) => {
      let isAPriorityLike = profile.power_badge
      if (isAPriorityLike) {
        count++
      }
      return count
    }, 0)
    return { value: priorityLikes }
  }
  return { value: 0 }
}

export const generateStatsObjectForCast = (
  cast: any,
  priorityLikes: number,
  channelRank: number,
  categoryRank: number
) => {
  if (!cast) return {}
  const statsObject = {
    channelRanking: { label: "Channel Rank", value: channelRank },
    categoryRanking: { label: "Topic Rank", value: categoryRank },
    likes: {
      label: "Likes",
      value: cast.reactions.likes_count,
    },
    priorityLikes: { label: "Power Badge Likes", value: priorityLikes },

    replies: { label: "Replies", value: cast.replies.count },
    recasts: { label: "Recasts", value: cast.reactions.recasts_count },
  }
  return statsObject
}

export const generateStatsObjectForTweet = (
  tweet: any,
  priorityLikes: number,
  channelRank: number,
  categoryRank: number
) => {
  if (!tweet) return {}
  const statsObject = {
    channelRanking: { label: "Channel Rank", value: channelRank },
    categoryRanking: { label: "Topic Rank", value: categoryRank },
    likes: {
      label: "Likes",
      value: tweet.public_metrics.like_count,
    },
    // priorityLikes: { label: "Power Badge Likes", value: priorityLikes },

    replies: { label: "Replies", value: tweet.public_metrics.reply_count },
    recasts: { label: "Retweets", value: tweet.public_metrics.retweet_count },
  }
  return statsObject
}

interface CategorySummary {
  id: string
  topic: string
  likes: number
  priorityLikes: number
  recasts: number
  replies: number
  count: number
  totalFollowers: number
  averageFollowerCount: number
  // powerBadgeCount: number
}

interface ReactionMetrics {
  likes_count: number
  recasts_count: number
  replies_count: number
}
interface User {
  fid: number
  custody_address: string
  username: string
  display_name: string
  pfp_url: string
  viewer_context?: {
    following: boolean
    followed_by: boolean
  }
  power_badge?: boolean
}
// Updated interfaces
interface AuthorReactions {
  author: User
  reactions: ReactionMetrics
  postCount: number
  // Count of posts by the author
}

// Function to aggregate and sort reactions per authoer
export function aggregateCastMetricsByUser(
  posts: CastType[],
  sortBy?: keyof ReactionMetrics
): AuthorReactions[] {
  const reactionMap = new Map<number, AuthorReactions>()

  posts.forEach((post) => {
    const authorId = post.author.fid
    if (!reactionMap.has(authorId)) {
      // Initialize the reactions object if it doesn't exist
      reactionMap.set(authorId, {
        ...post.author,
        reactions: {
          likes_count: 0,
          recasts_count: 0,
          replies_count: 0,
        },
        postCount: 0,
      } as any)
    }

    // Retrieve the existing or newly created authorReactions
    const authorReactions: any = reactionMap.get(authorId)

    // Update reactions and post count
    authorReactions.reactions.likes_count += post.reactions.likes_count
    authorReactions.reactions.recasts_count += post.reactions.recasts_count
    authorReactions.reactions.replies_count += post.replies.count
    authorReactions.postCount += 1
  })

  let results = Array.from(reactionMap.values())

  // Sort the results if a sort key is provided
  if (sortBy) {
    results.sort((a, b) => b.reactions[sortBy] - a.reactions[sortBy])
  }

  return results
}
