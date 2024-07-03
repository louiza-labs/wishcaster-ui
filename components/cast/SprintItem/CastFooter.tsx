"use client"

import { useParams, useRouter } from "next/navigation"

import { formatDateForCastTimestamp } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SaveCast from "@/components/cast/Save/"
import { Icons } from "@/components/icons"

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
  reactions: {
    likes_count: number
    recasts_count: number
  }
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
  cast,
  notionResults,
}: CastFooterProps) => {
  const router = useRouter()
  const params = useParams()
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
      router.push(`/cast/${hash}`)
    }
  }

  return (
    <div className="flex w-full flex-col">
      {!hideMetrics && (
        <div className="cursor-read flex w-full flex-col gap-y-2  rounded-md   py-2 text-sm backdrop-blur-md lg:flex-wrap xl:flex-nowrap">
          {/* <!-- Interaction Stats (Likes, Recasts, Replies) --> */}
          <div className="flex flex-col gap-y-2">
            {[
              { icon: Icons.likes, count: reactions.likes_count, noun: "Like" },
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
                className="row flex items-center justify-between gap-x-2"
              >
                <div className="flex flex-row gap-x-2">
                  <Icon className="size-4 text-gray-700" />
                  <p className="whitespace-nowrap ">
                    {count !== 1 ? `${noun}s` : noun}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <p className="whitespace-nowrap font-semibold">
                    {count.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-2 flex w-full items-center justify-between">
        {/* <!-- Date Section --> */}

        {/* <!-- Action Buttons --> */}
        <Button
          className="hidden whitespace-nowrap sm:block"
          onClick={handleRouteToWC}
          variant="link"
        >
          View on WC
        </Button>
        <Button
          className="block sm:hidden"
          onClick={handleRouteToWC}
          variant="link"
        >
          Visit
        </Button>
        <div className="flex flex-row gap-x-2">
          {!isOnCastPage && (
            <Button
              className="whitespace-nowrap"
              onClick={handleRouteToCastPage}
              variant="default"
            >
              Build
            </Button>
          )}
          {isEmbedded || isReply ? null : (
            <SaveCast cast={cast} notionResults={notionResults} />
          )}
        </div>
      </div>
      <div className="flex size-full items-center justify-center">
        <div className="mt-4 flex w-fit items-center justify-center gap-x-2 rounded-full bg-slate-200 px-3 py-1 text-xs font-light dark:bg-slate-800">
          <Icons.Calendar className="size-4 text-gray-700" />
          <p>Updated {formatDateForCastTimestamp(timestamp)}</p>
        </div>
      </div>
    </div>
  )
}

export default CastFooter
