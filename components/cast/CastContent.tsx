import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  isImageUrl,
  isVideoUrl,
  loadImageAspectRatio,
  renderTextWithLinks,
} from "@/lib/helpers"
import useGetCast from "@/hooks/farcaster/useGetCast"
import EmbeddedCast from "@/components/embeddedCast"
import LinkPreview from "@/components/linkPreview"
import HLSVideoPlayer from "@/components/video/HLSVideo"

interface CastContentProps {
  text: string
  embeds: any
  hash: string
  author: any
  handleToggleCategoryClick: any
  badgeIsToggled: boolean
  maxCharacters?: number
  routeToWarpcast?: boolean
}

const CastContent = ({
  text,
  embeds,
  hash,
  author,
  handleToggleCategoryClick,
  badgeIsToggled,
  routeToWarpcast,
  maxCharacters = 150,
}: CastContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [aspectRatio, setAspectRatio] = useState("56.25%")

  const hasUrl = embeds.find((embed: any) => embed.url) !== undefined
  const hasCast = embeds.find((embed: any) => embed.cast_id) !== undefined
  const embeddedCastHash = hasCast
    ? embeds.find((embed: any) => embed.cast_id).cast_id.hash
    : undefined
  const { fetchedCast: embeddedCast } = useGetCast(embeddedCastHash)

  const potentialUrl = hasUrl
    ? embeds[0].url
    : hasCast
    ? `https://www.warpcast.com/${embeddedCastHash}`
    : null
  const isImageUrlToShow = isImageUrl(potentialUrl)
  const isVideoUrlToShow = isVideoUrl(potentialUrl)
  const isWarpcastStreamUrl = potentialUrl
    ? potentialUrl.includes("stream.warpcast.com")
    : null

  useEffect(() => {
    if (isImageUrlToShow) {
      loadImageAspectRatio(potentialUrl, setAspectRatio)
    }
    //@ts-ignore
  }, [potentialUrl])

  return (
    <div>
      <Link
        href={
          routeToWarpcast ? `https://www.warpcast.com/${hash}` : `/cast/${hash}`
        }
        target={routeToWarpcast ? "_blank" : undefined}
        rel={routeToWarpcast ? "noReferrer" : undefined}
      >
        <div className="9 flex flex-col gap-y-4">
          {renderTextWithLinks(text)}

          <>
            {hasUrl && isImageUrlToShow && potentialUrl ? (
              <div
                className="relative size-full w-full"
                style={{ paddingTop: aspectRatio }}
              >
                <Image
                  src={potentialUrl}
                  alt={text}
                  layout="fill"
                  objectFit="contain"
                  className="object-contain"
                />
              </div>
            ) : isVideoUrlToShow && potentialUrl ? (
              <video controls style={{ width: "100%" }}>
                <source src={potentialUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : potentialUrl && isWarpcastStreamUrl ? (
              <HLSVideoPlayer src={potentialUrl} />
            ) : potentialUrl && !embeddedCastHash ? (
              <LinkPreview url={potentialUrl} />
            ) : embeddedCastHash && embeddedCast && embeddedCast.hash ? (
              <EmbeddedCast
                key={embeddedCast.hash}
                text={embeddedCast.text}
                timestamp={embeddedCast.timestamp}
                parent_url={embeddedCast.parent_url}
                reactions={embeddedCast.reactions}
                replies={embeddedCast.replies}
                embeds={embeddedCast.embeds}
                author={embeddedCast.author}
                hash={embeddedCast.hash}
                thread_hash={embeddedCast.thread_hash}
                parent_hash={embeddedCast.parent_hash}
                parent_author={embeddedCast.parent_author}
                mentioned_profiles={embeddedCast.mentioned_profiles}
                root_parent_url={embeddedCast.root_parent_url}
                category={embeddedCast.category}
                handleToggleCategoryClick={handleToggleCategoryClick}
                badgeIsToggled={badgeIsToggled}
              />
            ) : null}
          </>
        </div>
      </Link>
    </div>
  )
}

export default CastContent
