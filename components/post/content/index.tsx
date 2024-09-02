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

const RenderContent = ({
  text,
  tagline,
  embeds = [],
  media = [],
  referencedPost,
  source,
  // postId,
  author,
  maxCharacters = 150,
  mentionedProfiles,
  renderEmbeds = true,
}: RenderContentProps) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")

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
      {media.length && renderEmbeds ? (
        <div className="flex w-full flex-row gap-2 overflow-x-auto">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {media.map((mediaItem, index) => (
                <CarouselItem key={index}>
                  {mediaItem.type === "photo" && (
                    <div
                      className="relative size-full w-full"
                      style={{ paddingTop: aspectRatio }}
                    >
                      <Image
                        src={mediaItem.url}
                        alt={mediaItem.alt || text}
                        objectFit="contain"
                        height={0}
                        width={0}
                        sizes="100%"
                        style={{ width: "100%", minHeight: "20rem" }}
                        className="object-contain"
                      />
                    </div>
                  )}
                  {mediaItem.type === "video" && (
                    <video controls style={{ width: "100%", height: "20rem" }}>
                      <source src={mediaItem.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ) : null}

      {potentialUrl && isWarpcastStreamUrl && renderEmbeds ? (
        <HLSVideoPlayer src={potentialUrl} />
      ) : potentialUrl && !embeddedCastId && renderEmbeds ? (
        <LinkPreview url={potentialUrl} />
      ) : null}

      {referencedPost ? (
        <div className="my-4">
          {"test"}
          {/* <Post post={referencedPost} renderEmbeds={false} notionResults={[]} /> */}
        </div>
      ) : null}
    </div>
  )
}

export default RenderContent
