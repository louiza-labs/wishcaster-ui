"use server"

import { Client, auth } from "twitter-api-sdk"

import {
  addMediaToTweets,
  addUserInfoToTweets,
  extractUserIdsFromTweets,
} from "@/lib/helpers"

export async function fetchTweets(nextCursor = "") {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)
    const response = await client.tweets.tweetsRecentSearch({
      query:
        'lang:en is:verified (context:131.1491481998862348291 OR context:131.913142676819648512 OR context:46.1557697333571112960) ("product-request" OR "who\'s building" OR "someone should build" OR "will pay money for:" OR "someone build" OR "someone should make" OR "feature request" OR "please add")',
      "tweet.fields": [
        "attachments",
        "author_id",
        "created_at",
        "entities",
        "id",
        "text",
        "public_metrics",
        "referenced_tweets",
        "source",
      ],
      sort_order: "relevancy",
      max_results: 100,
      next_token: nextCursor && nextCursor.length ? nextCursor : undefined,
      expansions: [
        "author_id",
        "entities.mentions.username",
        "attachments.media_keys",
        "referenced_tweets.id",
      ],
      "media.fields": [
        "public_metrics",
        "type",
        "url",
        "alt_text",
        "duration_ms",
        "variants",
        "width",
        "height",
        "preview_image_url",
        "media_key",
      ],
      "user.fields": [
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "name",
        "profile_image_url",
        "public_metrics",
        "url",
        "username",
        "verified",
        "withheld",
      ],
    })
    const { data, errors, meta, includes } = response
    return { data, errors, meta, includes }
  } catch (e) {
    return { data: [], errors: e }
  }
}

export async function fetchTweetsWithSearch(
  searchKeywordsOrPhrases: string,
  nextCursor = ""
) {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

    const response = await client.tweets.tweetsRecentSearch({
      query: `lang:en  ${searchKeywordsOrPhrases}`,
      "tweet.fields": [
        "attachments",
        "author_id",
        "created_at",
        "entities",
        "id",
        "text",
        "public_metrics",
        "referenced_tweets",
        "source",
      ],
      sort_order: "relevancy",
      max_results: 100,
      next_token: nextCursor && nextCursor.length ? nextCursor : undefined,
      expansions: [
        "author_id",
        "entities.mentions.username",
        "attachments.media_keys",
        "referenced_tweets.id",
      ],
      "media.fields": [
        "public_metrics",
        "type",
        "url",
        "alt_text",
        "duration_ms",
        "variants",
        "width",
        "height",
        "preview_image_url",
        "media_key",
      ],
      "user.fields": [
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "name",
        "profile_image_url",
        "public_metrics",
        "url",
        "username",
        "verified",
        "withheld",
      ],
    })
    const { data, errors, meta, includes } = response

    return { data, errors, meta, includes }
  } catch (e) {
    console.log("the error fetching tweets with search", e)
    return { data: [], errors: e }
  }
}

export async function fetchTweetsUntilCovered() {
  let allTweets = [] as any[]
  let cursor = null

  do {
    const { data, meta } = await fetchTweets()

    allTweets = allTweets.concat(data)
    cursor = meta ? meta.next_token : ""
    // Check if the last cast's timestamp is earlier than the start date
  } while (cursor)

  return {
    tweets: allTweets,
    nextCursor: cursor,
  }
}

export async function fetchTweetsWithSearchUntilCovered(
  searchKeywordsOrPhrases: string,
  nextCursor = ""
) {
  let allTweets = [] as any[]
  let cursor: any = nextCursor

  do {
    try {
      const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)
      const response = await client.tweets.tweetsRecentSearch({
        query: `lang:en ${searchKeywordsOrPhrases}`,
        "tweet.fields": [
          "attachments",
          "author_id",
          "created_at",
          "entities",
          "id",
          "text",
          "public_metrics",
          "referenced_tweets",
          "source",
        ],
        sort_order: "relevancy",
        max_results: 100,
        next_token: cursor && cursor.length ? cursor : undefined,
        expansions: [
          "author_id",
          "entities.mentions.username",
          "attachments.media_keys",
          "referenced_tweets.id",
        ],
        "media.fields": [
          "public_metrics",
          "type",
          "url",
          "alt_text",
          "duration_ms",
          "variants",
          "width",
          "height",
          "preview_image_url",
          "media_key",
        ],
        "user.fields": [
          "created_at",
          "description",
          "entities",
          "id",
          "location",
          "name",
          "profile_image_url",
          "public_metrics",
          "url",
          "username",
          "verified",
          "withheld",
        ],
      })

      const { data, meta, includes } = response
      allTweets = allTweets.concat(data)

      // Update cursor for the next iteration
      cursor = meta && meta.next_token ? meta.next_token : null
    } catch (e) {
      console.error("Error fetching tweets with search:", e)
      break // Exit the loop if there is an error
    }
  } while (cursor) // Continue fetching until no more pages are available

  return {
    tweets: allTweets,
    nextCursor: cursor,
  }
}

async function fetchChunk(chunk: string) {
  const { data } = await fetchTwitterUsers(chunk.split(","))
  return data
}

export async function fetchTwitterUsersUntilCovered(twitterUserIds: string[]) {
  try {
    let allTweets = [] as any[]

    // Split the twitterUserIds into chunks of 100 IDs each
    const chunks = []
    for (let i = 0; i < twitterUserIds.length; i += 100) {
      chunks.push(twitterUserIds.slice(i, i + 100).join(","))
    }

    // Fetch data for each chunk sequentially
    for (const chunk of chunks) {
      const chunkTweets = await fetchChunk(chunk)
      allTweets = allTweets.concat(chunkTweets)
    }

    return {
      tweets: allTweets,
    }
  } catch (e) {
    console.log("the error fetching users", e)
    return {
      tweets: [],
    }
  }
}

export async function fetchTwitterUsers(user_ids: string[]) {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

    const response = await client.users.findUsersById({
      ids: user_ids,

      "user.fields": [
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "name",
        "pinned_tweet_id",
        "profile_image_url",
        "public_metrics",
        "url",
        "username",
        "verified",
      ],
    })
    const { data, errors } = response
    return { data, errors }
  } catch (e) {
    return { data: [], errors: e }
  }
}

export async function fetchTweetByIds(tweetId: string) {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

    const response = await client.tweets.findTweetById(tweetId, {
      "tweet.fields": [
        "attachments",
        "author_id",
        "created_at",
        "entities",
        "id",
        "text",
        "public_metrics",
        "referenced_tweets",
        "source",
      ],
      expansions: [
        "author_id",
        "entities.mentions.username",
        "attachments.media_keys",
        "referenced_tweets.id",
      ],
      "media.fields": [
        "public_metrics",
        "type",
        "url",
        "alt_text",
        "duration_ms",
        "variants",
        "width",
        "height",
        "preview_image_url",
        "media_key",
      ],
      "user.fields": [
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "name",
        "profile_image_url",
        "public_metrics",
        "url",
        "username",
        "verified",
        "withheld",
      ],
    })
    const { data, errors, includes } = response
    return { data, errors, includes }
  } catch (e) {
    return { data: {}, errors: e }
  }
}

export async function fetchTweetsByIds(tweetIds: string[]) {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

    const response = await client.tweets.findTweetsById({
      ids: tweetIds,
      "tweet.fields": [
        "attachments",
        "author_id",
        "created_at",
        "entities",
        "id",
        "text",
        "public_metrics",
        "referenced_tweets",
        "source",
      ],
      expansions: [
        "author_id",
        "entities.mentions.username",
        "attachments.media_keys",
        "referenced_tweets.id",
      ],
      "media.fields": [
        "public_metrics",
        "type",
        "url",
        "alt_text",
        "duration_ms",
        "variants",
        "width",
        "height",
        "preview_image_url",
        "media_key",
      ],
      "user.fields": [
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "name",
        "profile_image_url",
        "public_metrics",
        "url",
        "username",
        "verified",
      ],
    })
    const { data, errors, includes } = response
    return { data, errors, includes }
  } catch (e) {
    return { data: {}, errors: e }
  }
}

export async function fetchLikesForTweet(tweetId: string) {
  try {
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000
    const URL = (process.env.URL as string) || "http://127.0.0.1"

    const authClient = new auth.OAuth2User({
      client_id: process.env.TWITTER_CLIENT_ID as string,
      client_secret: process.env.TWITTER_CLIENT_SECRET as string,
      callback: `${URL}:${PORT}/callback`,
      scopes: ["like.read", "tweet.read", "users.read"],
    })
    const client = new Client(authClient)

    const response = await client.users.tweetsIdLikingUsers(
      "1754888991164498373",
      {
        "user.fields": [
          "created_at",
          "description",
          "entities",
          "name",
          "profile_image_url",
          "public_metrics",
          "url",
          "username",
          "verified",
        ],
        "tweet.fields": ["id"],
      }
    )
    return response
  } catch (e) {
    console.log("the error getting likes", e)
  }
}

async function fetchInChunks<T>(
  ids: string[],
  fetchFunction: (ids: string[]) => Promise<{ data: T[] }>,
  chunkSize = 100
): Promise<T[]> {
  const chunks = []
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize)
    chunks.push(chunk)
  }

  const promises = chunks.map((chunk) => fetchFunction(chunk))
  const responses = await Promise.all(promises)

  // Flatten the array of arrays into a single array
  const results = responses.flatMap((response) => response.data || [])

  return results
}

export async function getAndAddReferencedTweets(tweets: any) {
  try {
    if (!Array.isArray(tweets)) {
      throw new TypeError("Expected tweets to be an array")
    }

    let referenceIds: any = []
    // Step 1: Build an object of reference tweet IDs
    const objectOfReferencedTweetIds = tweets.reduce(
      (objectOfReferenceTweetIdsToBuild: any, tweet: any) => {
        if (!objectOfReferenceTweetIdsToBuild[tweet.id]) {
          if (tweet.referenced_tweets && tweet.referenced_tweets.length) {
            const referenceTweetId = tweet.referenced_tweets[0].id

            referenceIds.push(tweet.referenced_tweets[0].id)
            objectOfReferenceTweetIdsToBuild[tweet.id] = referenceTweetId
          }
        }
        return objectOfReferenceTweetIdsToBuild
      },
      {}
    )

    if (referenceIds.length === 0) {
      return tweets
    }

    // Step 2: Fetch tweets based on reference IDs
    const fetchedTweets: any = await fetchInChunks(
      referenceIds,
      fetchTweetsByIds as any
    )
    if (!fetchedTweets || fetchedTweets.length === 0) return tweets

    const userIds = extractUserIdsFromTweets(fetchedTweets)

    // Step 3: Fetch users based on user IDs
    const users = await fetchInChunks(userIds, fetchTwitterUsers as any)
    if (!users || users.length === 0) {
      return tweets
    }

    // Step 4: Add media to fetched tweets
    const tweetsWithMedia = addMediaToTweets(
      fetchedTweets,
      fetchedTweets.map((tweet: any) => tweet.includes)
    )

    // Step 5: Add user info to fetched tweets
    const tweetsWithUsers = addUserInfoToTweets(tweetsWithMedia, users)

    // Step 6: Merge fetched tweets with users into the original tweets array
    const updatedTweets = tweets.map((tweet: any) => {
      const referenceTweetId = objectOfReferencedTweetIds[tweet.id]
      if (referenceTweetId) {
        const referencedTweet = tweetsWithUsers.find(
          (t: any) => t.id === referenceTweetId
        )
        if (referencedTweet) {
          return {
            ...tweet,
            referenced_tweet: referencedTweet,
          }
        }
      }
      return tweet
    })

    return updatedTweets
  } catch (e) {
    console.error("Error in getAndAddReferencedTweets:", e)
    return tweets
  }
}
