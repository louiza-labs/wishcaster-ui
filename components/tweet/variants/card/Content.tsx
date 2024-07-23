import { useState } from "react"
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
  maxCharacters = 150,
}: any) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")

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
            {renderTextWithLinks(text, mentionedProfiles, embeds)}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default TweetContent
