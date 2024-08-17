"use server"

import algoliasearch from "algoliasearch"

// Search-only version
// import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(
  process.env.ALGOLIA_CLIENT_ID ?? "",
  process.env.ALGOLIA_WRITE_API_KEY ?? ""
)
const index = client.initIndex("casts_and_tweets")

export const uploadPostsDataToAlgolia = async (posts: any[]) => {
  if (!process.env.ALGOLIA_CLIENT_ID || !process.env.ALGOLIA_WRITE_API_KEY)
    return posts

  try {
    const formattedPosts = posts.map((post: any) => {
      return {
        id: post.object === "cast" ? post.hash : post.id,
        text: post.text,
        category: post.category.id,
      }
    })

    index
      .saveObjects(formattedPosts, { autoGenerateObjectIDIfNotExist: true })
      .then(({ objectIDs }) => {})
  } catch (e) {
    console.log("the error uploading to algolia", e)
  }
}

export const searchPostsData = async (searchTerm: string) => {
  if (!process.env.ALGOLIA_CLIENT_ID || !process.env.ALGOLIA_WRITE_API_KEY)
    return []

  try {
    const response = await index.search(searchTerm)
    const { hits } = response
    return hits
  } catch (e) {
    console.log("the error searching index in algolia", e)
  }
}
