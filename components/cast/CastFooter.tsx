"use client"

import { useParams, useRouter } from "next/navigation"

import { formatDateForCastTimestamp } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface CastFooterProps {
  timestamp: string
  hideMetrics?: boolean
  replies: {
    count: number
  }
  hash: string
  author: any
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
    <div className="mt-2 flex w-full flex-col items-center">
      {!hideMetrics && (
        <div className="flex w-full cursor-read justify-center gap-x-12 px-4 py-2 text-sm rounded-md backdrop-blur-md">
          {/* <!-- Interaction Stats (Likes, Recasts, Replies) --> */}
          {[
            { icon: Icons.likes, count: reactions.likes_count, noun: "like" },
            {
              icon: Icons.recasts,
              count: reactions.recasts_count,
              noun: "recast",
            },
            { icon: Icons.replies, count: replies.count, noun: "reply" },
          ].map(({ icon: Icon, count, noun }) => (
            <div key={noun} className="flex items-center gap-x-2">
              <Icon className="h-4 w-4 text-gray-700" />
              <div className="flex flex-col items-start">
                <p className="font-medium">{count.toLocaleString()}</p>
                <p>{count !== 1 ? `${noun}s` : noun}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex w-full items-center justify-between">
        {/* <!-- Date Section --> */}
        <div className="flex items-center gap-x-2 rounded-full bg-slate-200 px-3 py-1 text-xs font-light dark:bg-slate-800">
          <Icons.Calendar className="h-4 w-4 text-gray-700" />
          <p>Updated {formatDateForCastTimestamp(timestamp)}</p>
        </div>
        {/* <!-- Action Buttons --> */}
        <div className="flex items-center gap-x-2 text-xs sm:text-sm">
          <Button
            className="hidden sm:block"
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
          {!isOnCastPage && (
            <Button onClick={handleRouteToCastPage} variant="default">
              Build
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CastFooter
