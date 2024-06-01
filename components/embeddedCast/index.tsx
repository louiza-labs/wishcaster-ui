"use client"

import { Cast as CastType } from "@/types"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import AuthorAvatar from "@/components/cast/CastAvatar"
import CastContent from "@/components/cast/CastContent"
import CastFooter from "@/components/cast/CastFooter"

interface CastComponentTypes extends CastType {
  hideMetrics?: boolean
  handleToggleCategoryClick?: any
  badgeIsToggled?: any
  category?: any
  mentionedProfiles: any[]
  renderEmbeds?: boolean
}
const EmbeddedCast = ({
  timestamp,
  text,
  author,
  parent_url,
  reactions,
  replies,
  category,
  mentionedProfiles,
  embeds,
  hash,
  handleToggleCategoryClick,
  badgeIsToggled,
  renderEmbeds,
}: CastComponentTypes) => {
  return (
    <Card className="flex flex-col justify-between lg:h-fit">
      <CardHeader>
        <AuthorAvatar
          author={author}
          category={category}
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
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
          maxCharacters={150}
          renderEmbeds={renderEmbeds}
          mentionedProfiles={mentionedProfiles}
        />
      </CardContent>

      <CardFooter>
        <CastFooter
          timestamp={timestamp}
          reactions={reactions}
          replies={replies}
          hash={hash ?? ""}
          author={author}
        />
      </CardFooter>
    </Card>
  )
}

export default EmbeddedCast
