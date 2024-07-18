"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Cast as CastType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { isImageUrl, isVideoUrl, renderTextWithLinks } from "@/lib/helpers"
import useAddTaglineToHash from "@/hooks/farcaster/casts/useAddTaglineToHash"
import useGetCast from "@/hooks/farcaster/casts/useGetCast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SaveCast from "@/components/cast/Save/"
import AuthorAvatar from "@/components/cast/variants/TableRow/CastAvatar"
import EmbeddedCast from "@/components/embeddedCast"
import { Icons } from "@/components/icons"
import LinkPreview from "@/components/linkPreview"
import HLSVideoPlayer from "@/components/video/HLSVideo"

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

export default function CastAsRow({
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
}: CastComponentTypes | any) {
  const [showToggle, setShowToggle] = useState(false)
  const [aspectRatio, setAspectRatio] = useState("56.25%")
  const router = useRouter()
  const { castWithTagline } = useAddTaglineToHash(cast)

  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null

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
      router.push(`/cast/${hash}`)
    }
  }
  return (
    <Card className="relative w-full">
      <div className="absolute right-0 top-0 flex  flex-col items-start rounded bg-slate-200 px-2 py-1 text-xs font-semibold">
        <div onClick={() => handleToggleCategoryClick(category.id)}>
          {category.label}
        </div>
      </div>
      <CardContent className="flex flex-row flex-wrap items-center justify-between gap-4 p-4 md:p-6">
        <div className="flex flex-row items-end gap-x-4">
          <AuthorAvatar
            author={author}
            category={categoryLabel}
            tagline={castWithTagline.tagline}
            handleToggleCategoryClick={handleToggleCategoryClick}
            badgeIsToggled={badgeIsToggled}
          />
          <div className="flex flex-col items-start gap-y-2">
            <p className="whitespace-nowrap text-sm font-medium ">
              {castWithTagline.tagline}
            </p>

            <div className=" flex flex-row items-center gap-x-6  ">
              {[
                {
                  icon: Icons.likes,
                  count: reactions.likes_count,
                  noun: "Like",
                },
                {
                  icon: Icons.recasts,
                  count: reactions.recasts_count,
                  noun: "Recast",
                },
                {
                  icon: Icons.replies,
                  count: replies.count,
                  noun:
                    replies.count > 1 || replies.count === 0
                      ? "Replie"
                      : "Reply",
                },
              ].map(({ icon: Icon, count, noun }) => (
                <div
                  key={noun}
                  className="row flex items-center justify-start gap-x-2"
                >
                  <div className="flex flex-row gap-x-2">
                    <Icon
                      style={{ width: "18px", height: "18px" }}
                      className="size-1 text-muted-foreground"
                    />
                    {/* <p className="whitespace-nowrap ">
                    {count !== 1 ? `${noun}s` : noun}
                  </p> */}
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                      {count.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
              >
                <MoveHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Icons.Integrations className="mr-2 size-4" />
                <SaveCast cast={cast} notionResults={notionResults} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRouteToCastPage}>
                <Icons.Search className="mr-2 size-4" />
                Explore
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRouteToWC}>
                <Icons.Rocket className="mr-2 size-4" />
                Visit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full"
            onClick={() => setShowToggle(!showToggle)}
          >
            <ChevronsUpDownIcon className="size-4" />
          </Button>
        </div>
      </CardContent>
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
    </Card>
  )
}

function BookmarkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ChevronsUpDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  )
}

function FileWarningIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
