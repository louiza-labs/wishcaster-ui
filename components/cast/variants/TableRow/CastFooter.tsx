"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { isImageUrl, isVideoUrl, renderTextWithLinks } from "@/lib/helpers"
import useGetCast from "@/hooks/farcaster/casts/useGetCast"
import EmbeddedCast from "@/components/embeddedCast"
import LinkPreview from "@/components/linkPreview"
import HLSVideoPlayer from "@/components/video/HLSVideo"

interface CastFooterProps {
  timestamp: string
  cast?: any
  hideMetrics?: boolean
  isEmbedded?: boolean
  replies: {
    count: number
  }
  hash: string
  author: any
  isReply?: boolean
  hideActions?: boolean
  notionResults?: any
  reactions: {
    likes_count: number
    recasts_count: number
  }
  renderEmbeds: boolean
  showToggle: boolean
  aspectRatio: string
  handleToggleCategoryClick: any
  badgeIsToggled: boolean
  text: string
  embeds: any
  mentionedProfiles: any
}

const CastFooter = ({
  timestamp,
  reactions,
  replies,
  hideMetrics,
  hash,
  author,
  isReply,
  isEmbedded,
  hideActions,
  cast,
  notionResults,
  showToggle,
  renderEmbeds,
  aspectRatio,
  embeds,
  text,
  mentionedProfiles,
  handleToggleCategoryClick,
  badgeIsToggled,
}: CastFooterProps) => {
  const router = useRouter()
  const params = useParams()

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
  const isOnCastPage = params && params.hash ? params.hash === hash : false
  const handleRouteToWC = () => {
    if (typeof window !== "undefined") {
      window.open(
        `https://www.warpcast.com/${author.username}/${hash}`,
        "_blank"
      )
    }
  }

  const handleRouteToCastPage = () => {
    if (hash) {
      router.push(`/post/${hash}?source=farcaster`)
    }
  }

  return (
    <>
      {showToggle && (
        <div className="border-t p-4 md:p-6">
          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-medium">Full Post</h4>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {renderTextWithLinks(text, mentionedProfiles, embeds)}
              </div>
            </div>
            <>
              {hasUrl &&
              isImageUrlToShow &&
              potentialUrl &&
              renderEmbeds !== false ? (
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
              ) : isVideoUrlToShow && potentialUrl && renderEmbeds !== false ? (
                <video controls style={{ width: "100%" }}>
                  <source src={potentialUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : potentialUrl &&
                isWarpcastStreamUrl &&
                renderEmbeds !== false ? (
                <HLSVideoPlayer src={potentialUrl} />
              ) : potentialUrl &&
                !embeddedCastHash &&
                renderEmbeds !== false ? (
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
                  renderEmbeds={false}
                  thread_hash={embeddedCast.thread_hash}
                  parent_hash={embeddedCast.parent_hash}
                  parent_author={embeddedCast.parent_author}
                  mentioned_profiles={embeddedCast.mentioned_profiles}
                  root_parent_url={embeddedCast.root_parent_url}
                  category={embeddedCast.category}
                  handleToggleCategoryClick={handleToggleCategoryClick}
                  badgeIsToggled={badgeIsToggled}
                  mentionedProfiles={embeddedCast.mentioned_profiles}
                />
              ) : null}
            </>
          </div>
        </div>
      )}
    </>
  )
}

export default CastFooter
