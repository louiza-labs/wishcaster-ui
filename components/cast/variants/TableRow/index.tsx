"use client"

import { Cast as CastType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import useAddTaglineToHash from "@/hooks/farcaster/casts/useAddTaglineToHash"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import CastContent from "@/components/cast/variants/TableRow/CastContent"
import CastFooter from "@/components/cast/variants/TableRow/CastFooter"

interface CastComponentTypes extends CastType {
  hideMetrics?: boolean
  handleToggleCategoryClick?: any
  badgeIsToggled?: any
  renderEmbeds?: boolean
  hideActions?: boolean
  cast?: CastType
  isReply?: boolean
  category?: {
    label: string
    id: string
  }
}

const TableRowCast = ({
  timestamp,
  text,
  author,
  parent_url,
  reactions,
  replies,
  hideActions,
  category,
  embeds,
  hash,
  mentionedProfiles,
  handleToggleCategoryClick,
  badgeIsToggled,
  hideMetrics,
  cast,
  tagline,
  isReply,
  renderEmbeds,
  notionResults,
  routeToWarpcast,
}: CastComponentTypes | any) => {
  const { castWithTagline } = useAddTaglineToHash(cast)

  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null
  return (
    <Card className="relative w-full">
      <Avatar className="absolute left-2 top-2 size-5 rounded-full border p-0.5 shadow-sm">
        <AvatarImage
          src={"/social-account-logos/farcaster-purple-white.png"}
          alt={"faraster"}
        />
      </Avatar>
      <div className="absolute right-0 top-0 flex  flex-col items-start rounded bg-slate-200 px-2 py-1 text-xs font-semibold">
        <div onClick={() => handleToggleCategoryClick(category.id)}>
          {category.label}
        </div>
      </div>

      <CastContent
        text={text}
        embeds={embeds}
        hash={hash ?? ""}
        author={author}
        tagline={castWithTagline.tagline}
        handleToggleCategoryClick={handleToggleCategoryClick}
        badgeIsToggled={badgeIsToggled}
        maxCharacters={150}
        routeToWarpcast={routeToWarpcast}
        renderEmbeds={renderEmbeds}
        mentionedProfiles={mentionedProfiles}
        categoryLabel={categoryLabel}
        notionResults={notionResults}
        replies={replies}
        castWithTagline={castWithTagline}
        cast={castWithTagline}
        reactions={reactions}
      />

      <CastFooter
        timestamp={timestamp}
        reactions={reactions}
        replies={replies}
        hideMetrics={hideMetrics}
        hash={hash}
        author={author}
        cast={cast}
        isReply={isReply}
        hideActions={hideActions}
        notionResults={notionResults}
        showToggle={false}
        renderEmbeds={renderEmbeds}
        aspectRatio=""
        embeds={embeds}
        text={text}
        mentionedProfiles={mentionedProfiles}
        handleToggleCategoryClick={() => {}}
        badgeIsToggled={false}
      />
    </Card>
  )
}

export default TableRowCast
