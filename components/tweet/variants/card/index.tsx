"use client"

import { Cast as CastType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import useAddTaglineToHash from "@/hooks/farcaster/casts/useAddTaglineToHash"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import AuthorAvatar from "@/components/tweet/variants/card/Avatar"
import CastContent from "@/components/tweet/variants/card/Content"
import CastFooter from "@/components/tweet/variants/card/Footer"

interface CastComponentTypes extends CastType {
  hideMetrics?: boolean
  handleToggleCategoryClick?: any
  badgeIsToggled?: any
  renderEmbeds?: boolean
  hideActions?: boolean
  cast?: CastType
  isReply?: boolean
  category?: {
    label: string
    id: string
  }
}

interface TweetProps {
  text: string
  username: string
  likes: number
  replies: number
  retweets: number
  user: any
  notionResults: any
  tweet: any
  category: any
}

const SprintItemCast = ({
  text,
  username,
  likes,
  replies,
  retweets,
  user,
  notionResults,
  tweet,
  category,
}: TweetProps) => {
  const { castWithTagline } = useAddTaglineToHash(tweet)
  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null
  return (
    <Card className="md:border-auto md:shadow-auto relative flex w-full flex-col justify-between   lg:h-fit">
      <Avatar className="absolute right-2 top-2 size-5 rounded-full border p-0.5 shadow-sm">
        <AvatarImage
          src={"/social-account-logos/twitter-logo-black.png"}
          alt={"twitter"}
        />
      </Avatar>
      <CardHeader className="mt-2 flex w-full flex-col gap-y-2 px-0">
        <AuthorAvatar
          author={user}
          isTweet={true}
          category={categoryLabel}
          tagline={castWithTagline.tagline}
          handleToggleCategoryClick={() => {}}
          badgeIsToggled={false}
        />
        <Separator className=" mt-4 w-full" />
      </CardHeader>

      <CardContent>
        <CastContent
          text={text}
          embeds={[]}
          hash={tweet.hash}
          author={user}
          tagline={castWithTagline.tagline}
          handleToggleCategoryClick={() => {}}
          badgeIsToggled={false}
          maxCharacters={150}
          routeToWarpcast={() => {}}
          renderEmbeds={true}
          mentionedProfiles={[]}
        />
      </CardContent>
      <CardFooter>
        <CastFooter
          timestamp={tweet.created_at}
          reactions={tweet.public_metrics}
          replies={replies}
          likes={likes}
          replies={replies}
          retweets={retweets}
          hideMetrics={false}
          hash={tweet.hash}
          author={user}
          cast={tweet}
          isReply={false}
          hideActions={false}
          notionResults={notionResults}
        />
      </CardFooter>
    </Card>
  )
}

export default SprintItemCast
