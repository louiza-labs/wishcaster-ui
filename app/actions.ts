"use server"

import { Cast } from "@/types"
import { openai } from "@ai-sdk/openai"
import {
  FeedType,
  FilterType,
  NeynarAPIClient,
  isApiErrorResponse,
} from "@neynar/nodejs-sdk"
import { generateObject } from "ai"
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

export const fetchChannelCasts = async (channelId: string, cursor = "") => {
  try {
    const buildItChannelUrl = "https://warpcast.com/~/channel/someone-build"

    const feed = await neynarClient.fetchFeed(FeedType.Filter, {
      filterType: FilterType.ParentUrl,
      channelId,
      parentUrl: buildItChannelUrl,
      cursor: cursor && cursor.length ? cursor : undefined,
      limit: 100,
      withRecasts: false,
    })
    const returnObject = {
      casts: feed.casts,
      nextCursor: feed.next.cursor,
    }
    return returnObject
  } catch (error) {
    console.error(error)
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
