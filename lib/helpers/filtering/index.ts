import { Category, NormalizedPostType } from "@/types"

export const filterDuplicateCategory = (categories: Category[]) => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
}
export const filterDuplicateCategories = (
  categories: Category[]
): Category[] => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
  const categoriesIndex = categories.reduce(
    (categoriesObj: any, category: any) => {
      if (!categoriesObj[category.category.id]) {
        categoriesObj[category.category.id] = category.category
      }
      return categoriesObj
    },
    {}
  )

  return Object.values(categoriesIndex)
}

export const searchPostsForTerm = (
  posts: NormalizedPostType[],
  searchTerm: string
): NormalizedPostType[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim()
  return posts.filter((cast) =>
    cast.text.toLowerCase().includes(lowerCaseSearchTerm)
  )
}

export const filterReactionsByChannel = (reactions: any, channelId: string) => {
  if (reactions && reactions.length) {
    return reactions.filter(
      (reaction: any) => reaction.channel && reaction.channel.id === channelId
    )
  }
  return reactions
}

export const removeDuplicateTweets = (tweets: any) => {
  let tweetObj: any = {}
  return tweets.reduce((filteredTweets: any, currentTweet: any) => {
    let tweetText = currentTweet.text
    if (!tweetObj[tweetText]) {
      tweetObj[tweetText] = currentTweet.id
      filteredTweets.push(currentTweet)
    }
    return filteredTweets
  }, [])
}

interface IPost {
  id: string
  author: {
    id: number
    username: string
    displayName: string
    profileImageUrl: string
    bio: string
    verified: boolean
    followerCount: number
    followingCount: number
  }
  text: string
  createdAt: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  mediaUrls: string[]
  category: {
    label: string
    id: string
  }
  platform: string
  threadInfo: {
    parentPostId: string | null
    rootPostId: string
  }
  tagline: string
  mentionedProfiles: any[]
}

export function filterPostsByKeywordsAndIndustry(
  posts: IPost[],
  keywords: string[],
  industry: string
): IPost[] {
  return posts.filter((post) => {
    // Check if the post's text includes any of the keywords (case-insensitive)
    const hasKeyword = keywords.some((keyword) =>
      post.text.toLowerCase().includes(keyword.toLowerCase())
    )

    // Check if the post's category matches the specified industry (case-insensitive)
    const matchesIndustry =
      (post.category.label ?? "").toLowerCase() === industry.toLowerCase()

    // Return true if the post has at least one keyword and matches the industry
    return hasKeyword && matchesIndustry
  })
}
