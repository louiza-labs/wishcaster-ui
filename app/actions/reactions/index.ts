"use server"

import { NeynarAPIClient } from "@neynar/nodejs-sdk"
import axios from "axios"

// import { google } from "googleapis"

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string)

export async function fetchCastReactionsForUser(userFID: number, cursor = "") {
  try {
    const response: any = await neynarClient.fetchUserReactions(
      userFID,
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
