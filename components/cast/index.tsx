import Image from "next/image"
import { Cast as CastType } from "@/types"
import axios from "axios"

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

function isImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".webp",
  ]
  const lowerCaseUrl = url.toLowerCase()
  if (lowerCaseUrl.includes("imagedelivery")) return true
  return imageExtensions.some((ext) => lowerCaseUrl.endsWith(ext))
}

async function isWebpageUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url)
    return response.status >= 200 && response.status < 300
  } catch (error) {
    return false // Failed to fetch URL or other network error
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
  handleToggleCategoryClick,
  badgeIsToggled,
}: CastType) => {
  const hasUrl = embeds.find((embed) => embed.url) !== undefined
  const potentialUrl = hasUrl ? embeds[0].url : null
  let isImageUrlToShow

  if (isImageUrl(potentialUrl)) {
    isImageUrlToShow = true
  }

  return (
    <Card className=" flex flex-col justify-between">
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
          <div className="flex flex-col gap-y-10">
            <p>{text} </p>
            {hasUrl && isImageUrlToShow ? (
              <Image src={potentialUrl} alt={text} width={400} height={400} />
            ) : (
              <a
                href={potentialUrl}
                rel="noReferrer"
                className="break-all text-blue-600"
                target={"_blank"}
              >
                {" "}
                {potentialUrl}{" "}
              </a>
            )}
          </div>
        </a>
      </CardContent>
      <CardFooter className=" flex flex-row items-center gap-x-4">
        {/* <p>Pin</p> */}

        <p className="gap-x-2 font-bold">
          {reactions.likes_count}{" "}
          <span className="text-muted-foreground text-sm font-semibold">
            Likes
          </span>
        </p>
        <p className="gap-x-2 font-bold">
          {replies.count}{" "}
          <span className="text-muted-foreground text-sm font-semibold">
            Replies
          </span>
        </p>
        {/* <p className="gap-x-2 font-thin">
          {new Date(timestamp).toLocaleDateString()}{" "}
        </p> */}
      </CardFooter>
    </Card>
  )
}

export default Cast
