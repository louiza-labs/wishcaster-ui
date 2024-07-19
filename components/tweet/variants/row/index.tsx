"use client"

import { useState } from "react"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import useAddTaglineToHash from "@/hooks/farcaster/casts/useAddTaglineToHash"
import { Card } from "@/components/ui/card"
import TweetAsRowHeader from "@/components/tweet/variants/row/Avatar"
import TweetAsRowContent from "@/components/tweet/variants/row/Content"
import TweetFooter from "@/components/tweet/variants/row/Footer"

interface TweetProps {
  text: string
  username: string
  likes: number
  replies: number
  retweets: number
  user: any
  notionResults: any
  tweet: any
  category: string
}
export default function TweetAsRow({
  text,
  username,
  likes,
  replies,
  retweets,
  user,
  notionResults,
  tweet,
  category,
}: TweetProps) {
  const [showToggle, setShowToggle] = useState(false)
  const { castWithTagline } = useAddTaglineToHash(tweet)
  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null
  return (
    <Card className="relative w-full">
      <TweetAsRowHeader author={user} categoryLabel={categoryLabel} />
      <TweetAsRowContent
        user={user}
        categoryLabel={categoryLabel}
        castWithTagline={castWithTagline}
        likes={likes}
        replies={replies}
        retweets={retweets}
        tweet={tweet}
        notionResults={notionResults}
        setShowToggle={() => {}}
        showToggle={false}
      />
      <TweetFooter showToggle={false} setShowToggle={() => {}} />
    </Card>
  )
}
