"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart2, ChevronDown, ChevronUp, HeartIcon } from "lucide-react"

import { renderTextWithLinks } from "@/lib/helpers"
import { capitalizeFirstLetter, formatDateForCastTimestamp } from "@/lib/utils"
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
import SavePostForCard from "@/components/cast/Save/Card"
import RenderContent from "@/components/post/content"
import PostMetrics from "@/components/post/metrics"

interface PostProps {
  post: any
  renderEmbeds: boolean
  notionResults?: any
  asSingleRow?: boolean
}
interface NormalizedUser {
  profileImage: string
  displayName: string
  username: string
  verified: boolean
  powerBadge?: boolean
}

export default function Component({
  post,
  notionResults,
  renderEmbeds,
  asSingleRow,
}: PostProps) {
  console.log("the post", post)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const router = useRouter()
  // const { castWithTagline: postWithTagline } = useAddTaglineToHash(post)
  let postWithTagline = post
  const fullText = post.text
  const needsShortening =
    post.text.length >= (asSingleRow ? 500 : 100) ||
    post.mediaUrls.length ||
    post.embeds
  const abridgedText =
    post.text.slice(0, asSingleRow ? 500 : 100) +
    (post.text.length > (asSingleRow ? 500 : 100) ? "..." : "")

  const handleVisitPage = (e: React.SyntheticEvent) => {
    e.stopPropagation() // Prevent routing when clicking the title
    router.push(`/post/${post.id}?source=${post.platform}`)
  }
  return (
    <Card
      className={`relative flex h-auto w-full ${
        asSingleRow ? "" : "max-w-md"
      } flex-col justify-between border border-gray-200 shadow-sm`}
    >
      <CardContent
        onClick={handleVisitPage} // Added click handler here
        className="flex h-full cursor-pointer flex-col justify-between border p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="size-8 border border-gray-200">
              <AvatarImage
                src={post.author.profileImageUrl}
                alt={post.author.username}
              />
              <AvatarFallback>{post.author.username}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {post.author.displayName}{" "}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-100">
                {formatDateForCastTimestamp(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-2">
            {post.category.label ? (
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-xs text-indigo-800"
              >
                {post.category.label}
              </Badge>
            ) : null}
            <Badge
              variant="outline"
              className="border-yellow-200 bg-yellow-50 text-yellow-700"
            >
              <Avatar className="flex size-4 flex-col items-center rounded-full border  shadow-sm">
                <AvatarImage
                  src={
                    post.platform === "farcaster"
                      ? "/social-account-logos/farcaster-purple-white.png"
                      : "/social-account-logos/twitter-logo-black.png"
                  }
                  alt={post.platform}
                  className="rounded-full"
                />
              </Avatar>
              <span className="ml-2">
                {capitalizeFirstLetter(post.platform)}
              </span>
            </Badge>
          </div>
        </div>

        <h3 className="mb-2 text-base font-extrabold text-gray-800 dark:text-gray-200">
          {post.tagline && post.tagline.length
            ? post.tagline
            : postWithTagline.tagline}
        </h3>
        {needsShortening ? (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-200">
              {isExpanded
                ? renderTextWithLinks(
                    post.text,
                    post.mentionedProfiles,
                    post.embeds,
                    post.platform === "twitter"
                  )
                : renderTextWithLinks(
                    abridgedText,
                    post.mentionedProfiles,
                    post.embeds,
                    post.platform === "twitter"
                  )}
            </p>
            <CollapsibleContent className="mb-2 text-sm text-gray-600 dark:text-gray-200">
              <RenderContent
                text={post.text}
                tagline={postWithTagline.tagline}
                embeds={post.embeds}
                media={post.mediaUrls}
                referencedPost={post.referencedPost}
                source={post.platform}
                // hash={post.id}
                author={post.author}
                mentionedProfiles={post.mentionedProfiles}
                renderEmbeds={renderEmbeds}
              />
            </CollapsibleContent>
            <div className="mt-2 flex flex-col items-center">
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
            </div>
          </Collapsible>
        ) : (
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-200">
            {renderTextWithLinks(
              fullText,
              post.mentionedProfiles,
              post.embeds,
              post.platform === "twitter"
            )}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between space-x-2 text-sm">
          <div className="flex items-center space-x-4">
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
          <div className="hidden lg:block">
            {asSingleRow ? null : (
              <SavePost
                cast={post}
                notionResults={notionResults}
                isOnTweetsPage={post.platform === "twitter"}
              />
            )}
          </div>
          <div className="block lg:hidden">
            <SavePost
              cast={post}
              notionResults={notionResults}
              isOnTweetsPage={post.platform === "twitter"}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex w-full flex-col items-center  justify-between bg-gray-50 p-0 dark:bg-transparent ">
        <div className="flex w-full flex-row justify-between px-6 py-3">
          <div
            className={
              asSingleRow
                ? "flex flex-row items-center space-x-2 text-sm text-gray-600 dark:text-gray-200 lg:hidden "
                : "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-200"
            }
          >
            <HeartIcon className="size-4" />
            <span>{post.likesCount ? post.likesCount : "0"}</span>
          </div>
          <div
            className={`${
              asSingleRow
                ? " hidden w-full lg:flex lg:flex-row lg:justify-between "
                : "hidden "
            }`}
          >
            <PostMetrics
              likes={post.likesCount}
              showImpressions={post.platform === "twitter"}
              retweets={post.sharesCount}
              replies={post.commentsCount}
              renderOnCard={asSingleRow}
              impressions={
                post.additionalMetrics
                  ? post.additionalMetrics.impressionCount
                  : 0
              }
            />
            <div className="hidden lg:block">
              <SavePostForCard
                cast={post}
                notionResults={notionResults}
                isOnTweetsPage={post.platform === "twitter"}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMetrics(!showMetrics)}
            className={`${
              asSingleRow ? "lg:hidden" : ""
            } text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-200`}
          >
            <BarChart2 className="mr-1 size-4 dark:hover:text-indigo-200" />
            {showMetrics ? "Hide Metrics" : "Show Metrics"}
          </Button>
        </div>
        <Collapsible
          className={`w-full ${asSingleRow ? "lg:hidden" : ""}`}
          open={showMetrics}
        >
          <CollapsibleContent className="w-full bg-gray-100 py-2 text-sm dark:bg-indigo-100 dark:backdrop-blur-xl">
            {/* <PostMetrics
              likes={post.likesCount}
              showImpressions={post.platform === "twitter"}
              retweets={post.sharesCount}
              replies={post.commentsCount}
              renderOnCard={asSingleRow}
              impressions={
                post.additionalMetrics
                  ? post.additionalMetrics.impressionCount
                  : 0
              }
            /> */}
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  )
}
