import { useEffect, useState } from "react"
import Image from "next/image"

import {
  isImageUrl,
  loadImageAspectRatio,
  renderTextWithLinks,
} from "@/lib/helpers"
import useGetCast from "@/hooks/farcaster/useGetCast"
import EmbeddedCast from "@/components/embeddedCast"
import LinkPreview from "@/components/linkPreview"

interface CastContentProps {
  text: string
  embeds: any
  hash: string
  author: any
  handleToggleCategoryClick: any
  badgeIsToggled: boolean
  maxCharacters?: number
}

const CastContent = ({
  text,
  embeds,
  hash,
  author,
  handleToggleCategoryClick,
  badgeIsToggled,
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

  useEffect(() => {
    if (isImageUrlToShow) {
      loadImageAspectRatio(potentialUrl, setAspectRatio)
    }
    //@ts-ignore
  }, [potentialUrl])

  return (
    <div>
      <a
        href={`https://www.warpcast.com/${author.username}/${hash}`}
        target="_blank"
        rel="noReferrer"
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
      </a>
    </div>
  )
}

export default CastContent
