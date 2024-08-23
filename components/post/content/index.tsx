"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { loadImageAspectRatio } from "@/lib/helpers"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import EmbeddedCast from "@/components/embeddedCast"
import LinkPreview from "@/components/linkPreview"
import TweetCard from "@/components/tweet/variants/card"
import HLSVideoPlayer from "@/components/video/HLSVideo"

interface RenderContentProps {
  text: string
  tagline?: string
  embeds?: any
  media?: any[]
  referencedPost?: any
  source: "farcaster" | "twitter"
  hash: string
  author: any
  maxCharacters?: number
  mentionedProfiles: any[]
  renderEmbeds?: boolean
}

const RenderContent = ({
  text,
  tagline,
  embeds,
  media,
  referencedPost,
  source,
  hash,
  author,
  maxCharacters = 150,
  mentionedProfiles,
  renderEmbeds = true,
}: RenderContentProps) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")
  const hasUrl = embeds && embeds.some((embed: any) => embed.url)
  const hasCast = embeds && embeds.some((embed: any) => embed.cast_id)
  const embeddedCastHash = hasCast
    ? embeds.find((embed: any) => embed.cast_id)?.cast_id.hash
    : undefined
  const potentialUrl = hasUrl
    ? embeds[0].url
    : hasCast
    ? `https://www.warpcast.com/${embeddedCastHash}`
    : null
  const isImageUrlToShow = media && media.some((item) => item.type === "photo")
  const isVideoUrlToShow = media && media.some((item) => item.type === "video")
  const isWarpcastStreamUrl = potentialUrl?.includes("stream.warpcast.com")

  useEffect(() => {
    if (isImageUrlToShow && media) {
      loadImageAspectRatio(media[0].url, setAspectRatio)
    }
  }, [isImageUrlToShow, media])

  return (
    <div className="flex flex-col gap-y-4 break-words [overflow-wrap:anywhere]">
      {media && media.length && renderEmbeds ? (
        <div className="flex w-full flex-row gap-2 overflow-x-auto">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {media.map((mediaItem) => (
                <CarouselItem key={mediaItem.alt}>
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
                      <source
                        src={mediaItem.variants[0].url}
                        type="video/mp4"
                      />
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
      ) : potentialUrl && !embeddedCastHash && renderEmbeds ? (
        <LinkPreview url={potentialUrl} />
      ) : null}
      {referencedPost && source === "twitter" && (
        <div className="my-4">
          <TweetCard
            text={referencedPost.text}
            likes={referencedPost.public_metrics.like_count}
            replies={referencedPost.public_metrics.reply_count}
            retweets={referencedPost.public_metrics.retweet_count}
            username={referencedPost.username}
            user={referencedPost.user}
            category={referencedPost.category}
            tweet={referencedPost}
            notionResults={[]}
            attachments={referencedPost.attachments}
            entities={referencedPost.entities}
            media={referencedPost.media}
          />
        </div>
      )}
      {referencedPost && source === "farcaster" && (
        <EmbeddedCast
          key={referencedPost.hash}
          text={referencedPost.text}
          timestamp={referencedPost.timestamp}
          parent_url={referencedPost.parent_url}
          reactions={referencedPost.reactions}
          replies={referencedPost.replies}
          embeds={referencedPost.embeds}
          author={referencedPost.author}
          hash={referencedPost.hash}
          renderEmbeds={false}
          thread_hash={referencedPost.thread_hash}
          parent_hash={referencedPost.parent_hash}
          parent_author={referencedPost.parent_author}
          mentioned_profiles={referencedPost.mentioned_profiles}
          root_parent_url={referencedPost.root_parent_url}
          category={referencedPost.category}
          handleToggleCategoryClick={() => {}}
          badgeIsToggled={false}
          mentionedProfiles={referencedPost.mentioned_profiles}
        />
      )}
    </div>
  )
}

export default RenderContent
