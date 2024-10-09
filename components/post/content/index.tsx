"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { NormalizedPostType } from "@/types"

import { loadImageAspectRatio } from "@/lib/helpers"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import LinkPreview from "@/components/linkPreview"
import HLSVideoPlayer from "@/components/video/HLSVideo"

interface RenderContentProps {
  text: string
  tagline?: string
  embeds?: {
    url: string
    description?: string
    castId?: string
  }[]
  media?: {
    url: string
    type: "photo" | "video"
    alt?: string
  }[]
  referencedPost?: NormalizedPostType
  source: "farcaster" | "twitter"
  author: any
  maxCharacters?: number
  mentionedProfiles: {
    username: string
    displayName: string
    profileUrl: string
  }[]
  renderEmbeds?: boolean
}

const RenderContent: React.FC<RenderContentProps> = ({
  text,
  tagline,
  embeds = [],
  media = [],
  referencedPost,
  source,
  author,
  maxCharacters = 150,
  mentionedProfiles,
  renderEmbeds = true,
}) => {
  const [aspectRatio, setAspectRatio] = useState<string>("56.25%")

  const hasUrl = embeds.some((embed) => embed.url)
  const hasCast = embeds.some((embed) => embed.castId)
  const embeddedCastId = hasCast
    ? embeds.find((embed) => embed.castId)?.castId
    : undefined

  const potentialUrl = hasUrl
    ? embeds[0].url
    : hasCast
    ? `https://www.warpcast.com/${embeddedCastId}`
    : null

  const isImageUrlToShow = media.some((item) => item.type === "photo")
  const isVideoUrlToShow = media.some((item) => item.type === "video")
  const isWarpcastStreamUrl = potentialUrl?.includes("stream.warpcast.com")

  useEffect(() => {
    if (isImageUrlToShow && media.length > 0) {
      loadImageAspectRatio(media[0].url, setAspectRatio)
    }
  }, [isImageUrlToShow, media])

  return (
    <div className="flex flex-col gap-y-4 break-words [overflow-wrap:anywhere]">
      {media.length > 0 && renderEmbeds && (
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {media.map((mediaItem, index) => (
              <CarouselItem key={index}>
                {mediaItem.type === "photo" ? (
                  <div
                    className="relative w-full"
                    style={{ maxHeight: "256px", height: "auto" }}
                  >
                    <Image
                      src={mediaItem.url}
                      alt={mediaItem.alt || "Media content"}
                      layout="responsive"
                      width={100}
                      height={100}
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>
                ) : mediaItem.type === "video" ? (
                  <div className="w-full" style={{ maxHeight: "256px" }}>
                    <video
                      controls
                      className="size-full max-h-64 rounded-lg object-contain"
                    >
                      <source src={mediaItem.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : null}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {potentialUrl &&
        renderEmbeds &&
        (isWarpcastStreamUrl ? (
          <HLSVideoPlayer src={potentialUrl} />
        ) : !embeddedCastId ? (
          <LinkPreview url={potentialUrl} />
        ) : null)}

      {referencedPost && (
        <div className="my-4">
          {/* Uncomment and implement the Post component when ready */}
          {/* <Post post={referencedPost} renderEmbeds={false} notionResults={[]} /> */}
        </div>
      )}
    </div>
  )
}

export default RenderContent
