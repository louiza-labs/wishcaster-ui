"use client"

import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import SaveCast from "@/components/cast/Save/"

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
  hideActions?: boolean
  notionResults?: any
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
  hideActions,
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
          <div className="flex flex-row justify-between gap-y-2">
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
              {hideActions || isEmbedded || isReply ? null : (
                <SaveCast cast={cast} notionResults={notionResults} />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 flex w-full items-center justify-between">
        {/* <!-- Date Section --> */}

        {/* <!-- Action Buttons --> */}
        {/* <Button
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
        </Button> */}
      </div>
    </div>
  )
}

export default CastFooter
