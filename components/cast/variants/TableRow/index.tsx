"use client"

import { Cast as CastType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import useAddTaglineToHash from "@/hooks/farcaster/casts/useAddTaglineToHash"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import CastContent from "@/components/cast/variants/TableRow/CastContent"
import CastFooter from "@/components/cast/variants/TableRow/CastFooter"

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
  const { castWithTagline } = useAddTaglineToHash(cast)

  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null
  return (
    <Card className="md:border-auto md:shadow-auto flex w-full flex-row justify-between   lg:h-fit">
      <div className="flex w-full flex-col gap-y-2">
        <CardHeader className="flex w-full flex-row items-center justify-between  px-0">
          {/* <AuthorAvatar
            author={author}
            category={categoryLabel}
            handleToggleCategoryClick={handleToggleCategoryClick}
            badgeIsToggled={badgeIsToggled}
          /> */}
          {/* <div className="flex size-full items-center justify-center">
          <div className=" flex w-fit items-center justify-center gap-x-2 rounded-full    text-xs font-light">
            <Icons.Calendar className="size-4 text-gray-700" />
            <p>Updated {formatDateForCastTimestamp(timestamp)}</p>
          </div>
        </div> */}
        </CardHeader>

        <CardContent>
          <CastContent
            text={text}
            embeds={embeds}
            hash={hash ?? ""}
            author={author}
            tagline={castWithTagline.tagline}
            handleToggleCategoryClick={handleToggleCategoryClick}
            badgeIsToggled={badgeIsToggled}
            maxCharacters={150}
            routeToWarpcast={routeToWarpcast}
            renderEmbeds={renderEmbeds}
            mentionedProfiles={mentionedProfiles}
          />
        </CardContent>
      </div>
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
