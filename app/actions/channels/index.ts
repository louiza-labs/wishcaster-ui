"use server"

import { NeynarAPIClient } from "@neynar/nodejs-sdk"
import axios from "axios"

// import { google } from "googleapis"

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string)

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
