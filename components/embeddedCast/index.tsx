"use client"

import { useEffect, useState } from "react"
import { Cast as CastType } from "@/types"

import { isImageUrl, loadImageAspectRatio } from "@/lib/helpers"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import AuthorAvatar from "@/components/cast/CastAvatar"
import CastContent from "@/components/cast/CastContent"
import CastFooter from "@/components/cast/CastFooter"

const EmbeddedCast = ({
  timestamp,
  text,
  author,
  parent_url,
  reactions,
  replies,
  category,
  embeds,
  hash,
  handleToggleCategoryClick,
  badgeIsToggled,
}: CastType) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxCharacters = 150 // Maximum characters to display initially
  const [aspectRatio, setAspectRatio] = useState("56.25%") // Default to 16:9

  const hasUrl = embeds.find((embed: any) => embed.url) !== undefined
  const potentialUrl = hasUrl ? embeds[0].url : null
  const isImageUrlToShow = isImageUrl(potentialUrl)

  useEffect(() => {
    if (isImageUrlToShow) {
      loadImageAspectRatio(potentialUrl as string, setAspectRatio)
    }
  }, [potentialUrl, isImageUrlToShow])

  return (
    <Card className="flex flex-col justify-between lg:h-fit">
      <CardHeader>
        <AuthorAvatar
          author={author}
          category={category}
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
          timestamp={timestamp}
        />
      </CardHeader>
      <CardContent>
        <CastContent
          text={text}
          embeds={embeds}
          hash={hash}
          author={author}
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
          maxCharacters={150}
        />
      </CardContent>

      <CardFooter>
        <CastFooter
          timestamp={timestamp}
          reactions={reactions}
          replies={replies}
        />
      </CardFooter>
    </Card>
  )
}

export default EmbeddedCast
