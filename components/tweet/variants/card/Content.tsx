"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { renderTextWithLinks } from "@/lib/helpers"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import TweetCard from "@/components/tweet/variants/card"

interface TweetContent {
  text: string
  embeds: any
  hash: string
  author: any
  handleToggleCategoryClick: any
  badgeIsToggled: boolean
  maxCharacters?: number
  routeToWarpcast?: boolean
  mentionedProfiles: any[]
  renderEmbeds?: boolean
  tagline?: string
  media: any[]
  mentions: []
  referencedTweet?: any
}

const TweetContent = ({
  text,
  embeds,
  hash,
  author,
  handleToggleCategoryClick,
  badgeIsToggled,
  routeToWarpcast,
  mentionedProfiles,
  renderEmbeds,
  tagline,
  mentions,
  media,
  referencedTweet,
  maxCharacters = 150,
}: any) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")
  const mentionsUserNames = mentions
    ? mentions.map((mention: any) => mention.username)
    : []
  // if (!author) return <div />

  return (
    <div>
      <Link
        href={
          routeToWarpcast && author
            ? `https://x.com/${author.username}/status/${hash}`
            : `/post/${hash}?source=twitter`
        }
        target={routeToWarpcast ? "_blank" : undefined}
        rel={routeToWarpcast ? "noReferrer" : undefined}
      >
        <div className=" flex flex-col gap-y-4  break-words [overflow-wrap:anywhere]">
          {tagline ? <h3 className="text-lg font-bold">{tagline}</h3> : null}

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {renderTextWithLinks(text, mentionsUserNames, embeds, true)}
          </div>
          {media && media.length ? (
            <div className="flex w-full flex-row gap-2  overflow-x-auto">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {media.map((mediaItem: any) => (
                    <CarouselItem key={mediaItem.alt}>
                      {mediaItem.type === "photo" && renderEmbeds !== false ? (
                        <div
                          className="relative size-full w-full"
                          // style={{ paddingTop: aspectRatio }}
                        >
                          <Image
                            src={mediaItem.url}
                            alt={mediaItem.alt}
                            objectFit="contain"
                            height={0}
                            width={0}
                            sizes={"100%"}
                            style={{
                              width: "100%",
                              minHeight: "20rem",
                              // maxHeight: "30rem",
                            }}
                            className=" "
                          />
                        </div>
                      ) : mediaItem.type === "video" &&
                        renderEmbeds !== false ? (
                        <video
                          controls
                          style={{ width: "100%", height: "20rem" }}
                        >
                          <source
                            src={mediaItem.variants[0].url}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          ) : null}

          {referencedTweet && referencedTweet.id ? (
            <div className="my-4">
              <TweetCard
                text={referencedTweet.text}
                likes={referencedTweet.public_metrics.like_count}
                replies={referencedTweet.public_metrics.reply_count}
                retweets={referencedTweet.public_metrics.retweet_count}
                username={referencedTweet.username}
                user={referencedTweet.user}
                category={referencedTweet.category}
                tweet={referencedTweet}
                notionResults={[]}
                attachments={referencedTweet.attachments}
                entities={referencedTweet.entities}
                media={referencedTweet.media}
              />
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  )
}

export default TweetContent
