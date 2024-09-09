"use client"

import {
  addCategoryFieldsToCasts,
  categorizeArrayOfPosts,
  normalizePosts,
  sortPostsByProperty,
} from "@/lib/helpers"
import useFetchCastConversation from "@/hooks/farcaster/conversations/useFetchCastConversation"
import Post from "@/components/post"

interface TopRepliesProps {
  castHash: string
  notionResults?: any
}
const TopReplies = ({ castHash, notionResults }: TopRepliesProps) => {
  const { conversation } = useFetchCastConversation(castHash)
  const sortedRepliesByLikes = sortPostsByProperty(conversation, "likesCount")
  const topFiveRepliesByLikes = sortedRepliesByLikes.slice(0, 5)
  const categories = categorizeArrayOfPosts(topFiveRepliesByLikes) as any[]
  let postsWithCategories = addCategoryFieldsToCasts(
    topFiveRepliesByLikes,
    categories
  )
  postsWithCategories = postsWithCategories.map((postWithCategories) => {
    return {
      ...postWithCategories,
      category: postWithCategories.category ?? {
        label: "",
        id: "",
      },
    }
  })
  const normalizedTopFivePosts = normalizePosts(postsWithCategories)

  return (
    <div className="z-30 mt-2 flex h-full flex-col gap-y-4 overflow-y-auto px-4 md:px-0">
      {normalizedTopFivePosts && normalizedTopFivePosts.length ? (
        <div className="flex flex-col gap-y-4">
          <p className="text-xl font-bold">Top Replies</p>

          {normalizedTopFivePosts.map((reply: any) => (
            <Post
              key={reply.id}
              renderEmbeds={true}
              notionResults={notionResults}
              post={reply}
              asSingleRow={true}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default TopReplies
