"use server"

import axios from "axios"

interface FetchPostsParams {
  timePeriod: string
  channelId: string
  searchTerm?: string
  sortField?: "recent" | "likes_count" | "replies" | "recasts_count"
  userFID?: string
}

export async function fetchPosts({
  timePeriod,
  channelId,
  searchTerm = "",
  sortField,
  userFID,
}: FetchPostsParams): Promise<any> {
  try {
    const response = await axios.get(
      `${process.env.API_SERVICE_URL}/posts/get_normalized_posts`,
      {
        params: {
          timePeriod,
          channelId,
          searchTerm,
          sortField,
          userFID,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}
