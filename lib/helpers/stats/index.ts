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
    impression_count: impressionRank = 0,
    bookmark_count: bookmarkRank = 0,
  } = topicStatsAndRankings.rankings || {}

  const statsObject: StatsObject = {
    casts: {
      label: "Tweets",
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
    retweets: {
      label: "Retweets",
      value: formatNumber(topicStatsAndRankings.recasts || 0),
      rank: recastsRank,
    },
    impressions: {
      label: "Impressions",
      value: formatNumber(topicStatsAndRankings.impressions || 0),
      rank: impressionRank,
    },
    bookmarks: {
      label: "Bookmarks",
      value: formatNumber(topicStatsAndRankings.bookmarks || 0),
      rank: bookmarkRank,
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
  bookmarks: number
  impressions: number
  // powerBadgeCount: number
}

export function summarizeByCategory(
  posts: any[],
  sortField?: keyof CategorySummary
): CategorySummary[] {
  const summaries = new Map<string, CategorySummary>()
  posts.forEach((post) => {
    const { category, reactions, replies, author } = post
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
        impressions: 0,
        bookmarks: 0,
        averageFollowerCount: 0,
        totalFollowers: 0,
        // powerBadgeCount: 0
      })
    }

    const summary = summaries.get(category.id)!
    summary.likes +=
      post.object === "cast"
        ? reactions.likes_count
        : post.public_metrics.like_count
    summary.recasts +=
      post.object === "cast"
        ? reactions.recasts_count
        : post.public_metrics.retweet_count
    summary.replies +=
      post.object === "cast" ? replies.count : post.public_metrics.reply_count
    summary.bookmarks +=
      post.object === "cast" ? 0 : post.public_metrics.bookmark_count
    summary.impressions +=
      post.object === "cast" ? 0 : post.public_metrics.impression_count

    summary.count += 1
    summary.totalFollowers += post.object === "cast" ? author.follower_count : 0
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
    // channelRanking: { label: "Overall Rank", value: channelRank },
    categoryRanking: { label: "Topic Rank", value: categoryRank },
    likes: {
      label: "Likes",
      value: tweet.public_metrics.like_count,
    },
    // priorityLikes: { label: "Power Badge Likes", value: priorityLikes },

    replies: { label: "Replies", value: tweet.public_metrics.reply_count },
    recasts: { label: "Retweets", value: tweet.public_metrics.retweet_count },
    impressions: {
      label: "Impressions",
      value: tweet.public_metrics.impression_count,
    },
    bookmarks: {
      label: "Bookmarks",
      value: tweet.public_metrics.bookmark_count,
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

interface PostSummary {
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

export function summarizePosts(posts: any[]): {
  overall: PostSummary
  farcaster: PostSummary
  twitter: PostSummary
} {
  const initialSummary: PostSummary = {
    likes: 0,
    priorityLikes: 0,
    recasts: 0,
    replies: 0,
    count: 0,
    impressions: 0,
    bookmarks: 0,
    totalFollowers: 0,
    averageFollowerCount: 0,
  }

  const summary = {
    overall: { ...initialSummary },
    farcaster: { ...initialSummary },
    twitter: { ...initialSummary },
  }

  posts.forEach((post) => {
    const targetSummary =
      post.object === "cast" ? summary.farcaster : summary.twitter

    summary.overall.likes +=
      post.object === "cast"
        ? post.reactions.likes_count
        : post.public_metrics.like_count
    targetSummary.likes +=
      post.object === "cast"
        ? post.reactions.likes_count
        : post.public_metrics.like_count

    summary.overall.recasts +=
      post.object === "cast"
        ? post.reactions.recasts_count
        : post.public_metrics.retweet_count
    targetSummary.recasts +=
      post.object === "cast"
        ? post.reactions.recasts_count
        : post.public_metrics.retweet_count

    summary.overall.replies +=
      post.object === "cast"
        ? post.replies.count
        : post.public_metrics.reply_count
    targetSummary.replies +=
      post.object === "cast"
        ? post.replies.count
        : post.public_metrics.reply_count

    summary.overall.bookmarks +=
      post.object === "cast" ? 0 : post.public_metrics.bookmark_count
    targetSummary.bookmarks +=
      post.object === "cast" ? 0 : post.public_metrics.bookmark_count

    summary.overall.impressions +=
      post.object === "cast" ? 0 : post.public_metrics.impression_count
    targetSummary.impressions +=
      post.object === "cast" ? 0 : post.public_metrics.impression_count

    summary.overall.count += 1
    targetSummary.count += 1

    summary.overall.totalFollowers +=
      post.object === "cast" ? post.author.follower_count : 0
    targetSummary.totalFollowers +=
      post.object === "cast" ? post.author.follower_count : 0
  })

  // Calculate the average follower count only if there are posts
  if (summary.overall.count > 0) {
    summary.overall.averageFollowerCount = Math.floor(
      summary.overall.totalFollowers / summary.overall.count
    )
  }

  if (summary.farcaster.count > 0) {
    summary.farcaster.averageFollowerCount = Math.floor(
      summary.farcaster.totalFollowers / summary.farcaster.count
    )
  }

  if (summary.twitter.count > 0) {
    summary.twitter.averageFollowerCount = Math.floor(
      summary.twitter.totalFollowers / summary.twitter.count
    )
  }

  return summary
}

interface AuthorSummary {
  user: any // More specific type can be defined based on the structure of 'author'
  likes: number
  recasts: number
  replies: number
  impressions: number
  bookmarks: number
  totalPosts: number
}

export function summarizeByAuthor(posts: any[]): AuthorSummary[] {
  const summaries = new Map<string, AuthorSummary>()

  posts.forEach((post) => {
    const isCast = post.object === "cast"
    const userId = isCast ? post.author.fid : post.author_id
    const user = isCast ? post.author : post.user

    if (!userId || !user) return // Skip if no valid author identifier

    if (!summaries.has(userId)) {
      summaries.set(userId, {
        user: user,
        likes: 0,
        recasts: 0,
        replies: 0,
        impressions: 0,
        bookmarks: 0,
        totalPosts: 0,
      })
    }

    const summary = summaries.get(userId)!
    summary.likes += isCast
      ? post.reactions.likes_count
      : post.public_metrics.like_count
    summary.recasts += isCast
      ? post.reactions.recasts_count
      : post.public_metrics.retweet_count
    summary.replies += isCast
      ? post.replies.count
      : post.public_metrics.reply_count
    summary.impressions += isCast ? 0 : post.public_metrics.impression_count
    summary.bookmarks += isCast ? 0 : post.public_metrics.bookmark_count
    summary.totalPosts += 1
  })

  return Array.from(summaries.values())
}

interface AuthorSummary {
  user: any
  likes: number
  recasts: number
  replies: number
  impressions: number
  bookmarks: number
  totalPosts: number
}

interface PlatformAuthorSummary {
  overall: AuthorSummary[]
  farcaster: AuthorSummary[]
  twitter: AuthorSummary[]
}

export function summarizeByAuthorAndPlatform(
  posts: any[]
): PlatformAuthorSummary {
  const initialAuthorSummary = {
    likes: 0,
    recasts: 0,
    replies: 0,
    impressions: 0,
    bookmarks: 0,
    totalPosts: 0,
  }

  const summaries = {
    overall: new Map<string, AuthorSummary>(),
    farcaster: new Map<string, AuthorSummary>(),
    twitter: new Map<string, AuthorSummary>(),
  }

  posts.forEach((post) => {
    const isCast = post.object === "cast"
    const userId = isCast ? post.author.fid : post.author_id
    const user = isCast ? post.author : post.user

    if (!userId || !user) return // Skip if no valid author identifier

    // Function to update the summary map
    const updateSummary = (summaryMap: Map<string, AuthorSummary>) => {
      if (!summaryMap.has(userId)) {
        summaryMap.set(userId, {
          user: user,
          ...initialAuthorSummary,
        })
      }
      const summary = summaryMap.get(userId)!
      summary.likes += isCast
        ? post.reactions.likes_count
        : post.public_metrics.like_count
      summary.recasts += isCast
        ? post.reactions.recasts_count
        : post.public_metrics.retweet_count
      summary.replies += isCast
        ? post.replies.count
        : post.public_metrics.reply_count
      summary.impressions += isCast ? 0 : post.public_metrics.impression_count
      summary.bookmarks += isCast ? 0 : post.public_metrics.bookmark_count
      summary.totalPosts += 1
    }

    // Update all summaries
    updateSummary(summaries.overall)
    if (isCast) {
      updateSummary(summaries.farcaster)
    } else {
      updateSummary(summaries.twitter)
    }
  })

  // Convert maps to arrays
  const convertMapToArray = (summaryMap: Map<string, AuthorSummary>) =>
    Array.from(summaryMap.values())

  return {
    overall: convertMapToArray(summaries.overall),
    farcaster: convertMapToArray(summaries.farcaster),
    twitter: convertMapToArray(summaries.twitter),
  }
}

interface ProblemObject {
  hashes: string[]
  problem: string
  description: string
  sentiment: string
  metrics?: Metrics
}

interface MetricsSource {
  object: string
  hash: string
  thread_hash?: string
  parent_hash?: string | null
  parent_url?: string
  root_parent_url?: string
  parent_author?: {
    fid: number | null
  }
  author: Author
  text: string
  timestamp: string
  embeds?: any[]
  reactions?: Reactions
  replies?: {
    count: number
  }
  channel?: {
    object: string
    id: string
    name: string
    image_url: string
  }
  mentioned_profiles?: any[]
  category?: {
    label: string
    id: string
  }
  public_metrics?: {
    like_count: number
    retweet_count: number
    reply_count: number
    bookmark_count: number
    impression_count: number
  }
}

interface Author {
  object: string
  fid: number
  custody_address?: string
  username: string
  display_name: string
  pfp_url?: string
  profile?: {
    bio?: {
      text?: string
    }
  }
  follower_count: number
  following_count?: number
  verifications?: string[]
  verified_addresses?: {
    eth_addresses?: string[]
    sol_addresses?: string[]
  }
  active_status?: string
  power_badge?: boolean
}

interface Reactions {
  likes_count: number
  recasts_count: number
  likes?: {
    fid: number
    fname: string
  }[]
  recasts?: any[]
}

interface Metrics {
  totalLikes: number
  totalRecasts: number
  totalReplies: number
  totalBookmarks: number
  totalImpressions: number
}

export function addMetricsToProblems(
  problems: ProblemObject[],
  metricsSources: MetricsSource[]
): ProblemObject[] {
  return problems.map((problem) => {
    const aggregatedMetrics: Metrics = {
      totalLikes: 0,
      totalRecasts: 0,
      totalReplies: 0,
      totalBookmarks: 0,
      totalImpressions: 0,
    }

    problem.hashes.forEach((hash) => {
      metricsSources.forEach((source) => {
        if (source.hash === hash) {
          // Aggregate metrics based on object type
          if (source.object === "cast") {
            aggregatedMetrics.totalLikes += source.reactions?.likes_count || 0
            aggregatedMetrics.totalRecasts +=
              source.reactions?.recasts_count || 0
            aggregatedMetrics.totalReplies += source.replies?.count || 0
            aggregatedMetrics.totalBookmarks += 0 // Cast doesn't have bookmarks
            aggregatedMetrics.totalImpressions += 0 // Cast doesn't have impressions
          } else if (source.public_metrics) {
            aggregatedMetrics.totalLikes +=
              source.public_metrics.like_count || 0
            aggregatedMetrics.totalRecasts +=
              source.public_metrics.retweet_count || 0
            aggregatedMetrics.totalReplies +=
              source.public_metrics.reply_count || 0
            aggregatedMetrics.totalBookmarks +=
              source.public_metrics.bookmark_count || 0
            aggregatedMetrics.totalImpressions +=
              source.public_metrics.impression_count || 0
          }
        }
      })
    })

    return {
      ...problem,
      metrics: aggregatedMetrics,
    }
  })
}

interface Idea {
  name: string
  description: string
}

interface Post {
  text: string
  object?: string
  idea?: string // Add the idea field to associate with matching ideas
  reactions?: {
    likes_count: number
    recasts_count: number
  }
  public_metrics?: {
    like_count: number
    retweet_count: number
    reply_count: number
    bookmark_count: number
    impression_count: number
  }
  replies?: {
    count: number
  }
  author?: {
    follower_count: number
  }
  // Other relevant fields
}

interface PostSummary {
  likes: number
  recasts: number
  replies: number
  impressions: number
  bookmarks: number
  count: number
  totalFollowers: number
  averageFollowerCount: number
}

/**
 * Summarizes engagement metrics for each idea.
 * @param posts - Array of posts, each associated with an idea.
 * @returns A map of idea names to their engagement summaries.
 */
export function summarizePostsByIdea(
  posts: Post[]
): Record<string, PostSummary> {
  const summaries: Record<string, PostSummary> = {}

  posts.forEach((post) => {
    if (post.idea) {
      const ideas = post.idea.split(", ").map((idea) => idea.trim())
      ideas.forEach((idea) => {
        if (!summaries[idea]) {
          summaries[idea] = {
            likes: 0,
            recasts: 0,
            replies: 0,
            impressions: 0,
            bookmarks: 0,
            count: 0,
            totalFollowers: 0,
            averageFollowerCount: 0,
          }
        }

        const summary = summaries[idea]
        const isFarcaster = post.object === "cast"

        // Accumulate likes
        const likes = isFarcaster
          ? post.reactions?.likes_count || 0
          : post.public_metrics?.like_count || 0
        summary.likes += likes

        // Accumulate recasts/retweets
        const recasts = isFarcaster
          ? post.reactions?.recasts_count || 0
          : post.public_metrics?.retweet_count || 0
        summary.recasts += recasts

        // Accumulate replies
        const replies = isFarcaster
          ? post.replies?.count || 0
          : post.public_metrics?.reply_count || 0
        summary.replies += replies

        // Accumulate bookmarks and impressions (Twitter-specific)
        if (!isFarcaster) {
          summary.bookmarks += post.public_metrics?.bookmark_count || 0
          summary.impressions += post.public_metrics?.impression_count || 0
        }

        // Count the number of posts
        summary.count += 1

        // Accumulate total followers
        const followers = isFarcaster ? post.author?.follower_count || 0 : 0
        summary.totalFollowers += followers
      })
    }
  })

  // Calculate the average follower count for each idea
  Object.values(summaries).forEach((summary) => {
    if (summary.count > 0) {
      summary.averageFollowerCount = Math.floor(
        summary.totalFollowers / summary.count
      )
    }
  })

  return summaries
}
