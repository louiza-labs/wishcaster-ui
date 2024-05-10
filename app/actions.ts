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
import axios from "axios"
import { mnemonicToAccount } from "viem/accounts"
import { z } from "zod"

// import { google } from "googleapis"
import { PRODUCT_CATEGORIES } from "@/lib/constants"

//NEYNAR INFO

const testKey = "NEYNAR_API_DOCS"
// Instantiate the client
const neynarClient = new NeynarAPIClient(
  testKey ? testKey : (process.env.NEYNAR_API_KEY as string)
)
const FARCASTER_DEVELOPER_MNEMONIC = process.env.FARCASTER_DEVELOPER_MNEMONIC
const FARCASTER_DEVELOPER_FID = process.env.FARCASTER_DEVELOPER_FID

type CastPayload = {
  text: string
  signer_uuid: number
}

const generate_signature = async function (public_key: string) {
  // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
  const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
    name: "Farcaster SignedKeyRequestValidator",
    version: "1",
    chainId: 10,
    verifyingContract:
      "0x00000000fc700472606ed4fa22623acf62c60553" as `0x${string}`,
  }

  // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
  const SIGNED_KEY_REQUEST_TYPE = [
    { name: "requestFid", type: "uint256" },
    { name: "key", type: "bytes" },
    { name: "deadline", type: "uint256" },
  ]

  const account = mnemonicToAccount(
    FARCASTER_DEVELOPER_MNEMONIC ? FARCASTER_DEVELOPER_MNEMONIC : ""
  )

  // Generates an expiration date for the signature
  // e.g. 1693927665
  const deadline = Math.floor(Date.now() / 1000) + 86400 // signature is valid for 1 day from now
  // You should pass the same value generated here into the POST /signer/signed-key Neynar API

  // Generates the signature
  const signature = await account.signTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: "SignedKeyRequest",
    message: {
      requestFid: BigInt(FARCASTER_DEVELOPER_FID as string),
      key: public_key,
      deadline: BigInt(deadline),
    },
  })

  // Logging the deadline and signature to be used in the POST /signer/signed-key Neynar API
  return { deadline, signature }
}

export async function createAndStoreSigner() {
  try {
    const createSignerResponse = await axios.post(
      "https://api.neynar.com/v2/farcaster/signer",
      {},
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    )

    const { deadline, signature } = await generate_signature(
      createSignerResponse.data.public_key
    )

    const signedKeyResponse = await axios.post(
      "https://api.neynar.com/v2/farcaster/signer/signed_key",
      {
        signer_uuid: createSignerResponse.data.signer_uuid,
        app_fid: FARCASTER_DEVELOPER_FID,
        deadline,
        signature,
      },
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    )

    return signedKeyResponse.data
  } catch (error) {
    console.error(error)
    return { error: "Internal Server Error" }
  }
}

export async function fetchFarcasterSigner(userParams: any) {
  try {
    const response = await axios.get(
      "https://api.neynar.com/v2/farcaster/signer",
      {
        params: userParams,
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(error)
    return { error: "Internal Server Error" }
  }
}

export const fetchFarcasterUser = async (userFID: number, viewerFID = 0) => {
  try {
    // 19960 (Required*) => fid of user  we are looking for
    // 191 (Optional) => fid of the viewer
    // Get more info @ https://docs.neynar.com/reference/user-v1
    const userResponse = await neynarClient.lookupUserByFid(userFID, viewerFID)
    const user = userResponse?.result?.user
    // Stringify and log the response
    return user
  } catch (error) {
    // isApiErrorResponse can be used to check for Neynar API errors
    if (isApiErrorResponse(error)) {
      console.log("API Error", error.response.data)
    } else {
      console.log("Generic Error", error)
    }
  }
}

export const fetchFarcasterFollowers = async (
  userFID: number,
  viewerFID: number
) => {
  try {
    const followersResponse = viewerFID
      ? await neynarClient.fetchUserFollowers(userFID, { viewerFid: viewerFID })
      : await neynarClient.fetchUserFollowers(userFID)
    const followers = followersResponse.result.users
    return followers
  } catch (error) {
    if (isApiErrorResponse(error)) {
      console.log("API Error", error.response.data)
    } else {
      console.log("Generic Error", error)
    }
  }
}

export const fetchFarcasterFollowing = async (
  userFID: number,
  viewerFID: number
) => {
  try {
    const followingResponse = viewerFID
      ? await neynarClient.fetchUserFollowing(userFID, { viewerFid: viewerFID })
      : await neynarClient.fetchUserFollowing(userFID)
    const following = followingResponse.result.users
    return following
  } catch (error) {
    if (isApiErrorResponse(error)) {
      console.log("API Error", error.response.data)
    } else {
      console.log("Generic Error", error)
    }
  }
}

export const sendCast = async (castInfo: CastPayload) => {
  try {
    const response = await axios.post(
      "https://api.neynar.com/v2/farcaster/cast",
      castInfo,
      {
        headers: {
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(error)
    return { error: "Internal Server Error" }
  }
}

export const fetchChannelCasts = async (channelId: string, cursor = "") => {
  try {
    // let url = `https://api.neynar.com/v2/farcaster/feed?feed_type=following&channel_id=${channelId}&with_recasts=true&limit=100`
    // if (cursor && cursor.length) {
    //   url += `&cursor=${cursor}`
    // }

    const memesChannelUrl = "https://warpcast.com/~/channel/someone-build"

    const feed = await neynarClient.fetchFeed(FeedType.Filter, {
      filterType: FilterType.ParentUrl,
      channelId,
      parentUrl: memesChannelUrl,
      cursor: cursor && cursor.length ? cursor : undefined,
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
    const prompt = `Based on the following product categories: ${PRODUCT_CATEGORIES}, categorize each product request into the category that fits it best. Ensure that each request is categorized and done so effectively. Please include in the response for each categorization both the Product Request and categorization. The product requests to categorize for are as follows: ${casts
      .map((message: any, i: number) => `Request ${i + 1}:\n${message.text}`)
      .join("\n\n")}
      
      For example, if a request is about 'AMA Frames' it should be categorized under the 'Frames' category. Please follow similar guidelines for all requests.
      `
    const result = await generateObject({
      model: openai("gpt-4"),
      prompt,
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
    return { error: "Failed to process request", message: error }
  }
}
