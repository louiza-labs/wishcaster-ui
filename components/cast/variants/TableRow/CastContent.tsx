import { useEffect, useState } from "react"
import Image from "next/image"

import { isImageUrl, isVideoUrl, loadImageAspectRatio } from "@/lib/helpers"
import useGetCast from "@/hooks/farcaster/casts/useGetCast"
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
  mentionedProfiles: any[]
  renderEmbeds?: boolean
  tagline?: string
}

const CastContent = ({
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
  maxCharacters = 150,
}: CastContentProps) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")
  const [toggleContent, setToggleContent] = useState(false)
  const hasUrl = embeds.find((embed: any) => embed.url) !== undefined
  const hasCast = embeds.find((embed: any) => embed.cast_id) !== undefined
  const embeddedCastHash = hasCast
    ? embeds.find((embed: any) => embed.cast_id).cast_id.hash
    : undefined
  const { fetchedCast: embeddedCast } = useGetCast(embeddedCastHash)
  const handleToggleContent = () => {
    setToggleContent(!toggleContent)
  }

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
      {/* <Link
        href={
          routeToWarpcast
            ? `https://www.warpcast.com/${author.username}/${hash}`
            : `/cast/${hash}`
        }
        target={routeToWarpcast ? "_blank" : undefined}
        rel={routeToWarpcast ? "noReferrer" : undefined}
      > */}
      <div className=" flex flex-col gap-y-4 break-words p-2 [overflow-wrap:anywhere]">
        {tagline ? (
          <h3 className="w-full text-lg font-bold">{tagline}</h3>
        ) : null}
        <div className="flex flex-col gap-y-2">
          {/* <p className="" onClick={handleToggleContent}>
            {toggleContent ? "hide" : "show"}
          </p>
          {toggleContent ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {renderTextWithLinks(text, mentionedProfiles, embeds)}
            </div>
          ) : null} */}
        </div>

        <>
          {hasUrl &&
          false &&
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
          ) : false &&
            isVideoUrlToShow &&
            potentialUrl &&
            renderEmbeds !== false ? (
            <video controls style={{ width: "100%" }}>
              <source src={potentialUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : false &&
            potentialUrl &&
            isWarpcastStreamUrl &&
            renderEmbeds !== false ? (
            <HLSVideoPlayer src={potentialUrl} />
          ) : false &&
            potentialUrl &&
            !embeddedCastHash &&
            renderEmbeds !== false ? (
            <LinkPreview url={potentialUrl} />
          ) : embeddedCastHash && embeddedCast && embeddedCast.hash && false ? (
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
              hideMetrics={true}
              mentionedProfiles={embeddedCast.mentioned_profiles}
            />
          ) : null}
        </>
      </div>
      {/* </Link> */}
    </div>
  )
}

export default CastContent
