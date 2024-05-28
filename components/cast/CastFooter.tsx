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
  console.log("the params", params)
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
      {!hideMetrics ? (
        <div className="flex w-full flex-row items-center justify-around gap-x-4 rounded-md  p-2 text-sm  backdrop-blur-md ">
          {/* <!-- Likes Section --> */}
          <div className="flex flex-row items-center gap-x-2">
            <Icons.likes className="size-4 text-gray-700" />
            <div className="flex flex-col items-start">
              <p className="font-medium">
                {reactions.likes_count.toLocaleString()}
              </p>
              <p>like{reactions.likes_count !== 1 ? "s" : ""}</p>
            </div>
          </div>
          {/* <!-- Recasts Section --> */}
          <div className="flex flex-row items-center gap-x-2">
            <Icons.recasts className="size-4 text-gray-700" />
            <div className="flex flex-col items-start">
              <p className="font-medium">
                {reactions.recasts_count.toLocaleString()}
              </p>
              <p>recast{reactions.recasts_count !== 1 ? "s" : ""}</p>
            </div>
          </div>
          {/* <!-- Replies Section --> */}
          <div className="flex flex-row items-center gap-x-2">
            <Icons.replies className="size-4 text-gray-700" />
            <div className="flex flex-col items-start">
              <p className="font-medium">{replies.count.toLocaleString()}</p>
              <p>{replies.count !== 1 ? "replies" : "reply"}</p>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mt-2 flex w-full flex-row items-center justify-between">
        <div className=" flex w-fit flex-row items-start justify-start gap-x-2 rounded-full bg-slate-200 px-3 py-1 text-xs font-light dark:bg-slate-800">
          <Icons.Calendar className="size-4 text-gray-700" />
          <p className="font-light">
            Updated {formatDateForCastTimestamp(timestamp)}
          </p>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <Button onClick={handleRouteToWC} variant={"link"}>
            View on WC
          </Button>
          {isOnCastPage ? null : (
            <Button onClick={handleRouteToCastPage} variant={"default"}>
              Build
            </Button>
          )}
        </div>
      </div>

      {/* <!-- Timestamp Section --> */}
    </div>
  )
}

export default CastFooter
