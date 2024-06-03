"use server"

import { NeynarAPIClient } from "@neynar/nodejs-sdk"
import axios from "axios"

// import { google } from "googleapis"

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string)

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
