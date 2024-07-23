"use server"

import { Client, auth } from "twitter-api-sdk"

export async function fetchTweets(nextCursor = "") {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)
    let domainEntities = `(context:67.1158813612409929728 OR context:66.847869481888096256 OR context:131.1491481998862348291 OR context:131.913142676819648512 OR context:30.781974596794716162 OR context:46.1557697333571112960 OR context:30.781974596752842752)`
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
      ],
      sort_order: "relevancy",
      max_results: 100,
      next_token: nextCursor && nextCursor.length ? nextCursor : undefined,
      expansions: ["author_id", "entities.mentions.username"],
      "media.fields": ["public_metrics", "type", "url"],
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
    const { data, errors, meta } = response
    return { data, errors, meta }
  } catch (e) {
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

// switch to using a time-frame param after testing POC
export async function fetchHistoricalTweets() {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

    const response = await client.tweets.tweetsFullarchiveSearch({
      query:
        'is:verified ("product-request:" OR "someone should build" OR "will pay money for:" OR "somone build" OR "someone should build:" OR "feature request:" OR "Please add:" OR "Feature request")',
      start_time: "2024-06-01T00:00:00.000Z",
      end_time: "2024-07-19T00:00:00.000Z",
      sort_order: "relevancy",
      "tweet.fields": [
        "attachments",
        "author_id",
        "context_annotations",
        "conversation_id",
        "created_at",
        "id",
        "public_metrics",
        "referenced_tweets",
        "text",
      ],
      expansions: [
        "attachments.media_keys",
        "attachments.poll_ids",
        "author_id",
        "edit_history_tweet_ids",
        "entities.mentions.username",
        "geo.place_id",
        "in_reply_to_user_id",
        "referenced_tweets.id",
        "referenced_tweets.id.author_id",
      ],
      "media.fields": [
        "alt_text",
        "duration_ms",
        "height",
        "media_key",
        "preview_image_url",
        "promoted_metrics",
        "public_metrics",
        "type",
        "url",
        "variants",
        "width",
      ],
    })
    const { data, errors, meta } = response
    return { data, errors, meta }
  } catch (e) {
    return { data: [], errors: e }
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
      ],
      expansions: ["author_id", "entities.mentions.username"],
      "media.fields": ["public_metrics", "type", "url"],
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
    const { data, errors } = response
    return { data, errors }
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
    console.log("the res for getting likes", response)
    return response
  } catch (e) {
    console.log("the error getting likes", e)
  }
}
