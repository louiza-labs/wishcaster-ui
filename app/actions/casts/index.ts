"use server"

import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk"
import axios from "axios"

import { calculateStartDate } from "@/lib/utils"

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
export const fetchNormalizedCast = async (hash: string, viewerFID = 0) => {
  try {
    const buildUrl = () => {
      let baseUrl = `${process.env.API_SERVICE_URL}/farcaster/get_normalized_cast?castHash=${hash}`

      if (viewerFID) {
        baseUrl += `&viewer_fid=${viewerFID}`
      }
      return baseUrl
    }
    const url = buildUrl()
    const config = {
      headers: {
        accept: "application/json",
      },
    }

    const response = await axios.get(url, config)

    const data = response.data // Axios wraps the response data in a `data` property
    // Assuming the API returns an object with casts and cursor for the next batch
    const returnObject = {
      data,
    }

    return returnObject
  } catch (error) {
    console.error("Error fetching normalized cast:", error)
    return { data: {}, nextCursor: "", error: error }
  }
}

export const fetchFarcasterCastForUsers = async (
  userFID: number,
  viewerFID: number,
  cursor = ""
) => {
  try {
    const buildUrl = () => {
      let baseUrl = `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&with_recasts=true&limit=100&fids=${userFID}`
      if (cursor && cursor.length) {
        baseUrl += `&cursor=${cursor}`
      }
      if (viewerFID) {
        baseUrl += `&viewer_fid=${viewerFID}`
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

export async function fetchCastsUntilCovered(
  channelId: string,
  range: "24-hours" | "7-days" | "30-days" | "ytd",
  userFID = 0
) {
  let allCasts = [] as any[]
  let cursor = null
  const startDate = calculateStartDate(range)

  do {
    const { casts, nextCursor } = await fetchChannelCasts(
      channelId,
      cursor,
      userFID
    )
    allCasts = allCasts.concat(casts)
    cursor = nextCursor
    // Check if the last cast's timestamp is earlier than the start date
    if (
      new Date(
        casts[casts.length - 1]
          ? casts[casts.length - 1].timestamp
          : new Date().getUTCDate()
      ) < startDate
    ) {
      break // Stop fetching more data as the range is covered
    }
  } while (cursor)

  // Filter casts to ensure only those within the date range are included
  const filteredPosts = allCasts.filter(
    (cast) => new Date(cast.timestamp) >= startDate
  )
  return {
    casts: filteredPosts,
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
