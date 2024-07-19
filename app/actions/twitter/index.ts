"use server"

import { Client } from "twitter-api-sdk"

export async function fetchTweets() {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

    const response = await client.tweets.tweetsRecentSearch({
      query:
        'is:verified ("product-request" OR "someone should build" OR "product request" OR "feature request")',
      "tweet.fields": [
        "attachments",
        "author_id",
        "card_uri",
        "created_at",
        "entities",
        "id",
        "text",
        "public_metrics",
      ],
      expansions: [
        "author_id",
        "entities.mentions.username",
        "author_screen_name",
      ],
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

    return response
  } catch (e) {}
}

export async function fetchTwitterUsers(user_ids: string[]) {
  try {
    const client = new Client(process.env.TWITTER_BEARER_TOKEN as string)

    const response = await client.users.findUsersById({
      ids: user_ids,
      "user.fields": [
        "connection_status",
        "created_at",
        "description",
        "entities",
        "id",
        "location",
        "most_recent_tweet_id",
        "name",
        "pinned_tweet_id",
        "profile_banner_url",
        "profile_image_url",
        "public_metrics",
        "url",
        "username",
        "verified",
        "verified_type",
      ],
    })
    return response
  } catch (e) {}
}
