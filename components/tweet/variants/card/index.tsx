"use client"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import useAddTaglineToHash from "@/hooks/farcaster/casts/useAddTaglineToHash"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import AuthorAvatar from "@/components/tweet/variants/card/Avatar"
import TweetContent from "@/components/tweet/variants/card/Content"
import TweetFooter from "@/components/tweet/variants/card/Footer"

interface TweetProps {
  text: string
  username: string
  likes: number
  replies: number
  retweets: number
  user: any
  notionResults: any
  tweet: any
  attachments?: any
  entities?: any
  category: any
  media?: any
  referencedTweet?: any
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
  entities,
  media,
  attachments,
  referencedTweet,
}: TweetProps) => {
  const { castWithTagline } = useAddTaglineToHash(tweet)
  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null

  return (
    <Card className="md:border-auto md:shadow-auto relative flex w-full flex-col justify-between   lg:h-fit">
      <div className="-mb-4 mt-2 flex flex-col items-center">
        <Avatar className="border-1 flex size-5 flex-col items-center rounded-full border  p-1 shadow">
          <AvatarImage
            src={"/social-account-logos/twitter-logo-black.png"}
            alt={"twitter"}
          />
        </Avatar>
      </div>
      <CardHeader className=" flex w-full flex-col gap-y-2 px-0">
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
        <TweetContent
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
          mentions={entities ? entities.mentions : []}
          media={media}
          referencedTweet={referencedTweet}
        />
      </CardContent>
      <CardFooter>
        <TweetFooter
          timestamp={tweet.created_at}
          reactions={tweet.public_metrics}
          replies={replies}
          likes={likes}
          retweets={retweets}
          hideMetrics={false}
          hash={tweet.hash}
          impressions={tweet.public_metrics.impression_count}
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
