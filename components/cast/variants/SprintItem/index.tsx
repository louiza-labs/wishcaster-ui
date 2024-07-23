"use client"

import { Cast as CastType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import AuthorAvatar from "@/components/cast/variants/SprintItem/CastAvatar"
import CastContent from "@/components/cast/variants/SprintItem/CastContent"
import CastFooter from "@/components/cast/variants/SprintItem/CastFooter"

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

const SprintItemCast = ({
  timestamp,
  text,
  author,
  parent_url,
  reactions,
  replies,
  hideActions,
  category,
  embeds,
  hash,
  mentionedProfiles,
  handleToggleCategoryClick,
  badgeIsToggled,
  hideMetrics,
  cast,
  tagline,
  isReply,
  renderEmbeds,
  notionResults,
  routeToWarpcast,
}: CastComponentTypes | any) => {
  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null
  return (
    <Card className="md:border-auto md:shadow-auto relative flex w-full flex-col justify-between   lg:h-fit">
      <div className="-mb-4 mt-2 flex flex-col items-center">
        <Avatar className="flex size-5 flex-col items-center rounded-full border  shadow-sm">
          <AvatarImage
            src={"/social-account-logos/farcaster-purple-white.png"}
            alt={"farcaster"}
            className="rounded-full"
          />
        </Avatar>
      </div>
      <CardHeader className="flex w-full flex-col gap-y-2 px-0">
        <AuthorAvatar
          author={author}
          category={categoryLabel}
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
        />
        <Separator className=" mt-4 w-full" />
      </CardHeader>

      <CardContent>
        <CastContent
          text={text}
          embeds={embeds}
          hash={hash ?? ""}
          author={author}
          tagline={tagline}
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
          maxCharacters={150}
          routeToWarpcast={routeToWarpcast}
          renderEmbeds={renderEmbeds}
          mentionedProfiles={mentionedProfiles}
        />
      </CardContent>
      <CardFooter>
        <CastFooter
          timestamp={timestamp}
          reactions={reactions}
          replies={replies}
          hideMetrics={hideMetrics}
          hash={hash}
          author={author}
          cast={cast}
          isReply={isReply}
          hideActions={hideActions}
          notionResults={notionResults}
        />
      </CardFooter>
    </Card>
  )
}

export default SprintItemCast
