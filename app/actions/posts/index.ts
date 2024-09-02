"use server"

import axios from "axios"

interface FetchPostsParams {
  timePeriod: string
  channelId: string
  searchTerm?: string
}

export async function fetchPosts({
  timePeriod,
  channelId,
  searchTerm = "",
}: FetchPostsParams): Promise<any> {
  try {
    const response = await axios.get(
      `${process.env.API_SERVICE_URL}/posts/get_posts_from_db`,
      {
        params: {
          timePeriod,
          channelId,
          searchTerm,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}
