"use server"

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
