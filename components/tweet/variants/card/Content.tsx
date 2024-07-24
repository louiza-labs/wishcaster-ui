import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { renderTextWithLinks } from "@/lib/helpers"

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
  maxCharacters = 150,
}: any) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")
  const mentionsUserNames = mentions
    ? mentions.map((mention: any) => mention.username)
    : []

  console.log("the mentions", mentions)

  return (
    <div>
      <Link
        href={
          routeToWarpcast
            ? `https://x.com/${author.username}/status/${hash}`
            : `/tweet/${hash}`
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
            <div className="flex w-full flex-wrap gap-2">
              {media.map((mediaItem: any) => (
                <>
                  {mediaItem.type === "photo" && renderEmbeds !== false ? (
                    <div
                      className="relative size-full w-full"
                      style={{ paddingTop: aspectRatio }}
                    >
                      <Image
                        src={mediaItem.url}
                        alt={mediaItem.alt}
                        layout="fill"
                        objectFit="contain"
                        className="object-contain"
                      />
                    </div>
                  ) : mediaItem.type === "video" && renderEmbeds !== false ? (
                    <video controls style={{ width: "100%" }}>
                      <source
                        src={mediaItem.variants[0].url}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  )
}

export default TweetContent
