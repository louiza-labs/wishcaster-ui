"use server"

import { Cast } from "@/types"
import { openai } from "@ai-sdk/openai"
import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk"
import { generateObject } from "ai"
import axios from "axios"
import { z } from "zod"

// import { google } from "googleapis"
import { PRODUCT_CATEGORIES } from "@/lib/constants"
import { calculateStartDate } from "@/lib/helpers"

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string)

export const fetchFarcasterCast = async (hash: string) => {
  try {
    const castResponse = await neynarClient.lookUpCastByHashOrWarpcastUrl(
      hash,
      "hash"
    )
    const cast = castResponse.cast
    return cast
  } catch (error) {
    if (isApiErrorResponse(error)) {
      console.log("API Error", error.response.data)
    } else {
      console.log("Generic Error", error)
    }
  }
}

export const fetchChannelCasts = async (
  channelId: string,
  cursor = "",
  userFID = 0
) => {
  try {
    const buildUrl = () => {
      let baseUrl =
        "https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=channel_id&channel_id=someone-build&limit=100"
      if (cursor && cursor.length) {
        baseUrl += `&cursor=${cursor}`
      }
      if (userFID) {
        baseUrl += `&viewer_fid=${userFID}`
      }
      return baseUrl
    }
    const url = buildUrl()
    const config = {
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY, // You should secure your API key
      },
    }

    const response = await axios.get(url, config)
    const data = response.data // Axios wraps the response data in a `data` property
    // Assuming the API returns an object with casts and cursor for the next batch
    const returnObject = {
      casts: data.casts,
      nextCursor: data.next.cursor,
    }

    return returnObject
  } catch (error) {
    console.error("Error fetching channel casts:", error)
    return { casts: [], nextCursor: "", error: error }
  }
}

export const categorizeCastsAsRequests = async (casts: Cast[]) => {
  try {
    const prompt = `Based on the following product categories: ${PRODUCT_CATEGORIES}, categorize each product request into the category that fits it best. Ensure that each request is categorized and done so effectively. Please include in the response for each categorization both the Product Request and categorization. For each product request, you are to only provide a single category, that is the one of the best fit. The product requests to categorize for are as follows: ${casts
      .map((message: any, i: number) => `Request ${i + 1}:\n${message.text}`)
      .join("\n\n")}
      
      Here are some examples to follow:
       1. if a request is about 'AMA Frames', it should be categorized under the 'Frames' category. 
       2. if a request is about 'browser extensions', it should be categorized under the 'Extensions' category.
       3. if a request is about 'grant programs', it should be categorized under the 'Grants' category
       4. if a request is about 'Swaps', it should be categorized under the 'DeFi' category
       5. if a request is about 'Staking or Lending', it should be categorized under the 'DeFi' category
       6. if a request is about 'Clients', it should be categorized under the clients category
       
      
       Please follow similar guidelines for all requests.
      `
    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      prompt,
      maxRetries: 4,
      // maxTokens: 600,
      schema: z.object({
        categorizedRequests: z.array(
          z.object({
            request: z.string(),
            category: z.string(),
          })
        ),
      }),
    })
    return result.object.categorizedRequests
  } catch (error) {
    console.log(error)
    return casts
  }
}

export const fetchFarcasterProfile = async (username: string) => {
  try {
    const userResponse = await neynarClient.lookupUserByUsername(username)
    const userObject = userResponse.result.user
    return userObject
  } catch (error) {
    console.error(error)
    return { casts: [], nextCursor: "", error: error }
  }
}

export async function fetchCastsUntilCovered(
  channelId: string,
  range: "24-hours" | "7-days" | "30-days" | "ytd"
) {
  let allCasts = [] as any[]
  let cursor = null
  const startDate = calculateStartDate(range)

  do {
    const { casts, nextCursor } = await fetchChannelCasts(channelId, cursor)
    allCasts = allCasts.concat(casts)
    cursor = nextCursor
    // Check if the last cast's timestamp is earlier than the start date
    if (new Date(casts[casts.length - 1].timestamp) < startDate) {
      break // Stop fetching more data as the range is covered
    }
  } while (cursor)

  // Filter casts to ensure only those within the date range are included
  const filteredCasts = allCasts.filter(
    (cast) => new Date(cast.timestamp) >= startDate
  )
  return {
    casts: filteredCasts,
    nextCursor: cursor,
  }
}

// Helper function to split the user IDs into chunks of 100
function chunkUserIds(userIds: string[], maxChunkSize: number): string[][] {
  const chunks: string[][] = []
  for (let i = 0; i < userIds.length; i += maxChunkSize) {
    chunks.push(userIds.slice(i, i + maxChunkSize))
  }
  return chunks
}

// Function to fetch users with support for batching requests
export async function fetchFarcasterUsers(listOfUsers: string, userFID = 0) {
  try {
    const userIds = listOfUsers.split(",")
    const chunks = chunkUserIds(userIds, 100)

    const users = []
    for (const chunk of chunks) {
      const url = buildUrl(chunk.join(","), userFID)
      const config = {
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY, // Ensure your API key is securely configured
        },
      }
      const response = await axios.get(url, config)
      users.push(...response.data.users) // Collecting users from each chunk
    }

    return { users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { users: [], error }
  }
}

// Function to build the URL with user IDs and viewer FID
function buildUrl(userIDs: string, userFID: number): string {
  let baseUrl = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${userIDs}`
  if (userFID) {
    baseUrl += `&viewer_fid=${userFID}`
  }
  return baseUrl
}

export const fetchCastReactions = async (castHash: string, cursor = "") => {
  try {
    const response: any = await neynarClient.fetchReactionsForCast(
      castHash,
      "all",
      {
        limit: 100,
        cursor: cursor && cursor.length ? cursor : undefined,
      }
    )
    const reactions = response.reactions // Axios wraps the response data in a `data` property
    const nextCursor = response.cursor
    // Assuming the API returns an object with casts and cursor for the next batch
    const returnObject = {
      reactions: reactions,
      cursor: nextCursor,
    }

    return returnObject
  } catch (error) {
    console.error("Error fetching reactions:", error)
    return { reactions: [], cursor: cursor, error: error }
  }
}

export async function fetchCastsReactionsUntilCovered(
  castHash: string,
  castLikesCount: number,
  castReactionsCount: number
) {
  let allReactions = [] as any[]
  let cursor: null | string = null
  const totalReactions = castLikesCount + castReactionsCount

  do {
    const buildUrl = () => {
      let baseUrl = `https://api.neynar.com/v2/farcaster/reactions/cast?hash=${castHash}&types=all&limit=100`

      baseUrl += `&cursor=${cursor}`

      return baseUrl
    }
    const url = buildUrl()
    const config = {
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY, // You should secure your API key
      },
    }

    const response = await axios.get(url, config)
    const { reactions, cursor: nextCursor } = response.data

    allReactions = allReactions.concat(reactions)
    cursor = nextCursor
    // Check if the last cast's timestamp is earlier than the start date
    if (allReactions.length === totalReactions) {
      break // Stop fetching more data as the range is covered
    }
  } while (cursor)

  // Filter casts to ensure only those within the date range are included
  const reactionsObject = {
    likes: allReactions.filter((reaction) => reaction.reaction_type === "like"),
    recasts: allReactions.filter(
      (reaction) => reaction.reaction_type === "recast"
    ),
  }
  return {
    reactionsObject: reactionsObject,
    nextCursor: cursor,
  }
}

export const sendCast = async (
  signer: string,
  text: string,
  parentCastHash = "",
  embeds = [],
  channel = "",
  usersFID = 0
) => {
  try {
    if (!(signer && signer.length && text && text.length)) return
    const response = await neynarClient.publishCast(signer, text, {
      channelId: channel && channel.length ? channel : undefined,
      embeds: embeds && embeds.length ? embeds : undefined,
      parent_author_fid: usersFID ? usersFID : undefined,
      replyTo:
        parentCastHash && parentCastHash.length ? parentCastHash : undefined,
    })
    return { hash: response.hash }
  } catch (e) {
    console.log("error sending cast", e)
    return {
      error: e,
      hash: "",
    }
  }
}

export const fetchCastConversation = async (castHash: string, userFID = 0) => {
  try {
    const buildUrl = () => {
      let baseUrl = `https://api.neynar.com/v2/farcaster/cast/conversation?identifier=${castHash}&type=hash&reply_depth=2`

      if (userFID) {
        baseUrl += `&viewer_fid=${userFID}`
      }
      return baseUrl
    }
    const url = buildUrl()
    const config = {
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY, // You should secure your API key
      },
    }

    const response = await axios.get(url, config)
    const data = response.data // Axios wraps the response data in a `data` property
    const returnObject = {
      conversation: data.conversation.cast.direct_replies,
    }
    return returnObject
  } catch (error) {
    console.error("Error fetching channel casts:", error)
    return { conversation: [], error: error }
  }
}

export const fetchChannelWithSearch = async (channelSearchTerm: string) => {
  try {
    const buildUrl = () => {
      let baseUrl = `https://api.neynar.com/v2/farcaster/channel/search?q=${channelSearchTerm}`

      return baseUrl
    }
    const url = buildUrl()
    const config = {
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY, // You should secure your API key
      },
    }

    const response = await axios.get(url, config)
    const { channels } = response.data

    // Filter casts to ensure only those within the date range are included

    return {
      channels: channels,
    }
  } catch (error) {
    console.error("Error fetching channel:", error)
    return { channels: [], error: error }
  }
}

export const fetchAllChannels = async () => {
  try {
    let allChannels = [] as any[]
    let cursor: null | string = null

    do {
      const buildUrl = () => {
        let baseUrl = `https://api.neynar.com/v2/farcaster/channel/list?limit=50`

        baseUrl += `&cursor=${cursor}`

        return baseUrl
      }
      const url = buildUrl()
      const config = {
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY, // You should secure your API key
        },
      }

      const response = await axios.get(url, config)
      const { reactions, cursor: nextCursor } = response.data

      allChannels = allChannels.concat(reactions)
      cursor = nextCursor
    } while (cursor)

    // Filter casts to ensure only those within the date range are included

    return {
      channels: allChannels,
      nextCursor: cursor,
    }
  } catch (error) {
    console.error("Error fetching channels:", error)
    return { channels: [], error: error }
  }
}
