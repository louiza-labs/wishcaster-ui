"use-client"

import { useState } from "react"
import Image from "next/image"
import { Cast as CastType } from "@/types"

import { isImageUrl } from "@/lib/helpers"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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

  const toggleText = () => {
    setIsExpanded(!isExpanded)
  }

  const hasUrl = embeds.find((embed: any) => embed.url) !== undefined

  const potentialUrl = hasUrl ? embeds[0].url : null
  let isImageUrlToShow

  if (isImageUrl(potentialUrl)) {
    isImageUrlToShow = true
  }
  const renderTextWithLinks = (text: string) => {
    // Regular expression to match URLs
    const urlRegex =
      /(?:https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(com|co|io|org|net|edu|gov|uk|frame|xyz|us|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|es|mil)(\/[\w-]*)*/gi
    // Split the text by URLs
    const parts = text.split(urlRegex)

    // Render each part of the text, making URLs clickable
    return parts.map((part: string, index: number) => {
      if (part.match(urlRegex)) {
        // Render URLs as clickable links
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {part}
          </a>
        )
      } else {
        // Render regular text
        return <span key={index}>{part}</span>
      }
    })
  }

  return (
    <Card className=" flex flex-col justify-between lg:h-fit">
      <CardHeader>
        <div className="flex flex-row justify-between ">
          <a
            href={`https://www.warpcast.com/${author.username}`}
            target={"_blank"}
            rel={"noReferrer"}
          >
            <div className="flex flex-row items-center gap-x-2">
              <Avatar className="size-10 ">
                <AvatarImage src={author.pfp_url} alt={author.username} />
                {/* <AvatarFallback>{author</AvatarFallback> */}
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
          target={"_blank"}
          rel={"noReferrer"}
          className="relative "
        >
          <div className="flex  flex-col gap-y-10">
            {renderTextWithLinks(text)}

            {text.length > maxCharacters && !toggleText ? null : (
              <>
                {hasUrl && isImageUrlToShow && potentialUrl ? (
                  <div className="size-full w-full overflow-y-scroll">
                    <AspectRatio ratio={1 / 1}>
                      <Image src={potentialUrl} alt={text} layout="fill" />
                    </AspectRatio>
                  </div>
                ) : potentialUrl ? (
                  // <a
                  //   href={potentialUrl}
                  //   rel="noReferrer"
                  //   className="break-all text-blue-600"
                  //   target={"_blank"}
                  // >
                  //   {" "}
                  //   {potentialUrl}{" "}
                  // </a>
                  <LinkPreview url={potentialUrl} />
                ) : null}
              </>
            )}
          </div>
        </a>
      </CardContent>
      <CardFooter className="  flex flex-row items-center justify-between gap-x-4">
        {/* <p>Pin</p> */}
        <div className="flex flex-row items-center gap-x-4">
          <div className="flex flex-row items-center gap-x-2">
            <p className="gap-x-2  font-medium">{reactions.likes_count}</p>
            <Icons.likes className="size-4" />
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <p className="gap-x-2 font-medium">{replies.count}</p>
            <Icons.replies className="size-4" />
          </div>
        </div>
        <p className="gap-x-2 font-medium">
          {new Date(timestamp).toLocaleDateString()}{" "}
        </p>
      </CardFooter>
    </Card>
  )
}

export default EmbeddedCast
