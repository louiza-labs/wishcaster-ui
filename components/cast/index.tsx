"use client"

import { Cast as CastType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import AuthorAvatar from "@/components/cast/CastAvatar"
import CastContent from "@/components/cast/CastContent"
import CastFooter from "@/components/cast/CastFooter"

interface CastComponentTypes extends CastType {
  hideMetrics?: boolean
  handleToggleCategoryClick?: any
  badgeIsToggled?: any
  renderEmbeds?: boolean
  cast: CastType
  category?: {
    label: string
    id: string
  }
}

const Cast = ({
  timestamp,
  text,
  author,
  parent_url,
  reactions,
  replies,
  category,
  embeds,
  hash,
  tagline,
  mentionedProfiles,
  handleToggleCategoryClick,
  badgeIsToggled,
  hideMetrics,
  renderEmbeds,
  routeToWarpcast,
  cast,
}: CastComponentTypes | any) => {
  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null
  return (
    <Card className="md:border-auto md:shadow-auto flex w-full flex-col justify-between border-none  lg:h-fit">
      <CardHeader>
        <AuthorAvatar
          author={author}
          category={categoryLabel}
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
        />
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
        />
      </CardFooter>
    </Card>
  )
}

export default Cast
