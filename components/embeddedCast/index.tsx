"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Cast as CastType } from "@/types"

import {
  isImageUrl,
  loadImageAspectRatio,
  renderTextWithLinks,
} from "@/lib/helpers"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import LinkPreview from "@/components/linkPreview"

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
        <div className="flex flex-row justify-between">
          <a
            href={`https://www.warpcast.com/${author.username}`}
            target="_blank"
            rel="noReferrer"
          >
            <div className="flex flex-row items-center gap-x-2">
              <Avatar className="size-10">
                <AvatarImage src={author.pfp_url} alt={author.username} />
              </Avatar>
              <div className="flex flex-col items-start gap-x-4">
                <CardTitle className="text-sm">{author.display_name}</CardTitle>
                <CardDescription className="whitespace-nowrap text-xs">
                  {author.username}
                </CardDescription>
              </div>
            </div>
          </a>
          {category && category.length ? (
            <Badge
              onClick={() => handleToggleCategoryClick(category)}
              variant={badgeIsToggled ? "default" : "outline"}
              className="w-30 h-10 cursor-pointer whitespace-nowrap"
            >
              {category}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <a
          href={`https://www.warpcast.com/${author.username}/${hash}`}
          target="_blank"
          rel="noReferrer"
          className="relative"
        >
          <div className="flex flex-col gap-y-10">
            {renderTextWithLinks(text)}

            {text.length > maxCharacters && !isExpanded ? null : (
              <>
                {hasUrl && isImageUrlToShow && potentialUrl ? (
                  <div
                    className="relative size-full w-full"
                    style={{ paddingTop: aspectRatio }}
                  >
                    <Image
                      src={potentialUrl as string}
                      alt={text}
                      layout="fill"
                      objectFit="contain"
                      className="object-contain"
                    />
                  </div>
                ) : potentialUrl ? (
                  <LinkPreview url={potentialUrl} />
                ) : null}
              </>
            )}
          </div>
        </a>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between gap-x-4">
        <div className="flex flex-row items-center gap-x-4">
          <div className="flex flex-row items-center gap-x-2">
            <p className="gap-x-2 font-medium">{reactions.likes_count}</p>
            <Icons.likes className="size-4" />
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <p className="gap-x-2 font-medium">{replies.count}</p>
            <Icons.replies className="size-4" />
          </div>
        </div>
        <p className="gap-x-2 font-medium">
          {new Date(timestamp).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  )
}

export default EmbeddedCast
