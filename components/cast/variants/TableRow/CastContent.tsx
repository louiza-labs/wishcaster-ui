"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { isImageUrl, isVideoUrl, loadImageAspectRatio } from "@/lib/helpers"
import useGetCast from "@/hooks/farcaster/casts/useGetCast"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SaveCast from "@/components/cast/Save/"
import AuthorAvatar from "@/components/cast/variants/TableRow/CastAvatar"
import { Icons } from "@/components/icons"

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
  categoryLabel: string
  notionResults: any
  replies: any
  castWithTagline: any
  cast: any
  reactions: any
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
  categoryLabel,
  notionResults,
  replies,
  castWithTagline,
  cast,
  reactions,

  maxCharacters = 150,
}: CastContentProps) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")
  const [toggleContent, setToggleContent] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const router = useRouter()
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
      router.push(`/post/${hash}?source='farcaster'`)
    }
  }

  return (
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
                  replies.count > 1 || replies.count === 0 ? "Replie" : "Reply",
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
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
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
  )
}

export default CastContent

function ChevronsUpDownIcon(props: any) {
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

function MoveHorizontalIcon(props: any) {
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
