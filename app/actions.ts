"use server"

import { Cast } from "@/types"
import { openai } from "@ai-sdk/openai"
import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk"
import { generateObject } from "ai"
import axios from "axios"
import { z } from "zod"

// import { google } from "googleapis"
import { PRODUCT_CATEGORIES } from "@/lib/constants"

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
