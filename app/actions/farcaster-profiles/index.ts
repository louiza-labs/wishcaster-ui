"use server"

import { NeynarAPIClient } from "@neynar/nodejs-sdk"
import axios from "axios"

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string)

// Function to build the URL with user IDs and viewer FID
function buildUrl(userIDs: string, userFID: number): string {
  // Trim any trailing commas from userIDs
  const trimmedUserIDs = userIDs.replace(/,+$/, "")
  let baseUrl = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${trimmedUserIDs}`
  if (userFID) {
    baseUrl += `&viewer_fid=${userFID}`
  }
  return baseUrl
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
