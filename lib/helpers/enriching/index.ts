import { eng } from "stopword"

// Pre-compile stop words list
const stopWordsList = new Set(eng)

export const addUserInfoToTweets = (tweets: any, users: any) => {
  if (!(tweets && tweets.length && users && users.length)) return tweets

  const usersObj = users.reduce((userObject: any, currentUser: any) => {
    const user_id = currentUser.id
    userObject[user_id] = currentUser
    return userObject
  }, {})

  return tweets.map((tweet: any) => {
    return {
      ...tweet,
      type: "tweet",
      hash: tweet.id,
      user: usersObj[tweet.author_id] ?? {},
    }
  })
}

export const addMediaToTweets = (tweets: any, includesObject: any) => {
  if (!(tweets && Array.isArray(tweets))) return tweets

  if (!includesObject || !(includesObject && includesObject.media)) {
    return tweets.map((tweet: any) => {
      return {
        ...tweet,
        media: [],
      }
    })
  } else {
    let mediaArray = includesObject.media
    const mediaAsObject = mediaArray.reduce(
      (mediaObject: any, currMedia: any) => {
        const mediaKey = currMedia.media_key
        if (!mediaObject[mediaKey]) {
          mediaObject[mediaKey] = currMedia
        }
        return mediaObject
      },
      {}
    )
    const tweetsWithMediaAdded = tweets.map((tweet: any) => {
      let mediaForTweet: any[] = []
      let tweetHasVideos = false
      const attachmentsForTweet = tweet.attachments
      if (attachmentsForTweet) {
        const mediaKeysForTweet = attachmentsForTweet.media_keys
        if (mediaKeysForTweet && mediaKeysForTweet.length) {
          mediaKeysForTweet.forEach((mediaKey: string) => {
            const mediaFromObject = mediaAsObject[mediaKey]

            if (mediaFromObject) {
              if (mediaFromObject.type && mediaFromObject.type === "video") {
                tweetHasVideos = true
              }
              mediaForTweet.push(mediaFromObject)
            }
          })
        }
      }
      return {
        ...tweet,
        media: mediaForTweet,
        hasVideo: tweetHasVideos,
      }
    })
    return tweetsWithMediaAdded
  }
}

interface Idea {
  name: string
  description: string
}

interface Post {
  text: string
  object?: string
  idea?: string // Add the idea field to associate with matching ideas
  // Other relevant fields
}

/**
 * Matches ideas to posts by checking for keywords in the post text.
 * @param ideas - An array of ideas with names and descriptions.
 * @param posts - An array of posts to match against.
 * @returns A mapping of each idea to its relevant posts.
 */
export function matchIdeasToPosts(ideas: Idea[], posts: Post[]): Post[] {
  // Preprocess the ideas into a map for easy access
  const ideaMatches: Record<string, Post[]> = {}

  ideas.forEach((idea) => {
    // Normalize and tokenize the idea's name and description
    const keywords = [
      ...idea.name.toLowerCase().split(/\s+/),
      ...idea.description.toLowerCase().split(/\s+/),
    ]

    // Filter stop words
    const filteredKeywords = keywords.filter((word) => !stopWordsList.has(word))

    posts.forEach((post) => {
      const postText = post.text.toLowerCase()

      // Check if any of the keywords match the post text
      const isMatch = filteredKeywords.some((keyword) =>
        postText.includes(keyword)
      )

      if (isMatch) {
        // Associate the post with the current idea
        if (!post.idea) {
          post.idea = idea.name
        } else {
          post.idea += `, ${idea.name}` // Support for multiple ideas
        }

        // Add post to the list of matches for this idea
        if (!ideaMatches[idea.name]) {
          ideaMatches[idea.name] = []
        }
        ideaMatches[idea.name].push(post)
      }
    })
  })

  return posts
}
