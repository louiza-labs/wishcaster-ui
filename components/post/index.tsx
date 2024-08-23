"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart2, ChevronDown, ChevronUp, HeartIcon } from "lucide-react"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { renderTextWithLinks } from "@/lib/helpers"
import { capitalizeFirstLetter, formatDateForCastTimestamp } from "@/lib/utils"
import useAddTaglineToHash from "@/hooks/farcaster/casts/useAddTaglineToHash"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import SavePost from "@/components/cast/Save"
import RenderContent from "@/components/post/content"
import PostMetrics from "@/components/post/metrics"

interface PostProps {
  user: any
  text: string
  post: any
  category: any
  source: "farcaster" | "twitter"
  embeds: any[]
  media: any
  postId: string
  referencedPost: any
  mentionedProfiles: any
  renderEmbeds: boolean
  tagline: string
  likes?: number
  retweets?: number
  replies?: number
  impressions?: number
  timestamp: string
  notionResults?: any
  reactions?: {
    likes_count: number
    recasts_count: number
    bookmark_count?: number
  }
}
interface NormalizedUser {
  profileImage: string
  displayName: string
  username: string
  verified: boolean
  powerBadge?: boolean
}

function normalizeUserData(
  author: any,
  source: "farcaster" | "twitter"
): NormalizedUser {
  if (source === "twitter") {
    return {
      profileImage: author.profile_image_url,
      displayName: author.name,
      username: author.username,
      verified: author.verified,
    }
  } else if (source === "farcaster") {
    return {
      profileImage: author.pfp_url,
      displayName: author.display_name,
      username: author.username,
      verified: author.power_badge ? true : false,
      powerBadge: author.power_badge,
    }
  } else {
    throw new Error("Unsupported source type")
  }
}
export default function Component({
  post,
  user,
  text,
  source,
  category,
  embeds,
  tagline,
  media,
  postId,
  likes,
  retweets,
  replies,
  impressions,
  reactions,
  referencedPost,
  mentionedProfiles,
  notionResults,
  timestamp,
  renderEmbeds,
}: PostProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const router = useRouter()
  const { castWithTagline: postWithTagline } = useAddTaglineToHash(post)
  const categoryLabel =
    category && category.id
      ? PRODUCT_CATEGORIES_AS_MAP[category.id].label
      : null

  const likesCount =
    likes && source === "twitter" ? likes : reactions?.likes_count

  const normalizedUser = normalizeUserData(user, source)

  const fullText = text
  const needsShortening = text.length >= 100 || media.length || embeds.length
  const abridgedText = text.slice(0, 100) + (text.length > 100 ? "..." : "")

  const handleVisitPage = (e: React.SyntheticEvent) => {
    e.preventDefault()
    router.push(`/post/${postId}?source=${source}`)
  }

  return (
    <Card className="w-full relative flex flex-col justify-between max-w-md border border-gray-200 h-full shadow-sm">
      <CardContent className="p-4 flex flex-col border justify-between h-full">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="size-8 border border-gray-200">
              <AvatarImage
                src={normalizedUser.profileImage}
                alt={normalizedUser.username}
              />
              <AvatarFallback>{normalizedUser.username}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                {normalizedUser.displayName}{" "}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDateForCastTimestamp(timestamp)}
              </p>
            </div>
          </div>
          {categoryLabel ? (
            <Badge
              variant="secondary"
              className="bg-indigo-100 text-xs text-indigo-800"
            >
              {categoryLabel}
            </Badge>
          ) : null}
        </div>

        <h3
          onClick={handleVisitPage}
          className="mb-2 text-base font-bold text-gray-800"
        >
          {tagline ?? postWithTagline.tagline}
        </h3>
        {needsShortening ? (
          <Collapsible
            open={isExpanded}
            onClick={handleVisitPage}
            onOpenChange={setIsExpanded}
          >
            <p className="mb-1 text-sm text-gray-600">
              {isExpanded
                ? renderTextWithLinks(
                    text,
                    mentionedProfiles,
                    embeds,
                    source === "twitter"
                  )
                : renderTextWithLinks(
                    abridgedText,
                    mentionedProfiles,
                    embeds,
                    source === "twitter"
                  )}
            </p>
            <CollapsibleContent className="mb-2 text-sm text-gray-600">
              <RenderContent
                text={text}
                tagline={postWithTagline.tagline}
                embeds={embeds}
                media={media}
                referencedPost={referencedPost}
                source={source}
                hash={postId}
                author={user}
                mentionedProfiles={mentionedProfiles}
                renderEmbeds={renderEmbeds}
              />
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-normal text-indigo-600 hover:text-indigo-800"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="mr-1 size-4" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 size-4" /> Read more
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        ) : (
          <p onClick={handleVisitPage} className="mb-1 text-sm text-gray-600">
            {renderTextWithLinks(
              fullText,
              mentionedProfiles,
              embeds,
              source === "twitter"
            )}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between space-x-2 text-sm">
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className="border-yellow-200 bg-yellow-50 text-yellow-700"
            >
              <Avatar className="flex size-4 flex-col items-center rounded-full border  shadow-sm">
                <AvatarImage
                  src={
                    source === "farcaster"
                      ? "/social-account-logos/farcaster-purple-white.png"
                      : "/social-account-logos/twitter-logo-black.png"
                  }
                  alt={source}
                  className="rounded-full"
                />
              </Avatar>
              <span className="ml-2">{capitalizeFirstLetter(source)}</span>
            </Badge>
            {/* <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700"
            >
              <ArrowUpCircle className="mr-1 size-3" />
              To Do
            </Badge> */}
            {/* <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              {categoryLabel}
            </Badge> */}
          </div>
          {/* <Button
            variant="outline"
            size="sm"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            <PlayCircle className="mr-1 size-3" />
            Start Task
          </Button> */}
          <SavePost
            cast={post}
            notionResults={notionResults}
            isOnTweetsPage={source === "twitter"}
          />
        </div>
      </CardContent>

      <CardFooter className="flex w-full flex-col p-0  items-center justify-between bg-gray-50 ">
        <div className="flex flex-row w-full justify-between px-6 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HeartIcon className="size-4" />
            <span>{likesCount ? likesCount : "0"}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMetrics(!showMetrics)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            <BarChart2 className="mr-1 size-4" />
            {showMetrics ? "Hide Metrics" : "Show Metrics"}
          </Button>
        </div>
        <Collapsible className="w-full" open={showMetrics}>
          <CollapsibleContent className="bg-gray-100 w-full py-2 text-sm">
            <PostMetrics
              likes={likes}
              retweets={retweets}
              replies={replies}
              impressions={impressions}
              reactions={reactions}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  )
}
