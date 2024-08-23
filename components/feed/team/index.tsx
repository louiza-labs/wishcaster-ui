"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { FixedSizeList as List } from "react-window"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import CastAvatar from "@/components/cast/variants/Classic/CastAvatar"

const handleVisitProfile = (username: string) => {
  if (typeof window !== "undefined") {
    window.open(`https://www.warpcast.com/${username}`, "_blank")
  }
}

interface UserFeedProps {
  relevantUsers: any[]
  loadingUsers: boolean
  showMetrics?: boolean
}

const UserFeed = ({
  relevantUsers,
  loadingUsers,
  showMetrics,
}: UserFeedProps) => {
  const [listHeight, setListHeight] = useState(window.innerHeight)
  const [visibleStartIndex, setVisibleStartIndex] = useState(0)

  const gutter = 10

  const filteredUsers = useMemo(() => {
    return relevantUsers
      ? relevantUsers.reduce((users, currentUser) => {
          if (
            !users.find((user: any) => user.username === currentUser.username)
          ) {
            users.push(currentUser)
          }
          return users
        }, [])
      : []
  }, [relevantUsers])

  useEffect(() => {
    const updateSize = () => {
      setListHeight(window.innerHeight)
    }
    window.addEventListener("resize", updateSize)

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const Row = useCallback(
    ({ index, style, data }: { index: number; style: any; data: any }) => {
      const adjustedStyle = {
        ...style,
        top: style.top + (index - visibleStartIndex) * gutter,
      }
      return (
        <div
          style={adjustedStyle}
          className="flex w-full flex-row items-center justify-between rounded border p-2"
        >
          <CastAvatar author={data[index]} key={data[index].fid} />
          <div className="flex flex-row gap-x-2">
            {showMetrics && data[index].reactions ? (
              <div className="flex flex-row justify-start gap-x-2">
                <div className="flex flex-col items-center gap-y-1">
                  <p className="text-xs font-light">Likes</p>
                  <p className="text-xs font-medium">
                    {data[index].reactions.likes_count}
                  </p>
                </div>
                <div className="hidden flex-col items-center gap-y-1 xl:flex">
                  <p className="text-xs font-light">Replies</p>
                  <p className="text-xs font-medium">
                    {data[index].reactions.replies_count}
                  </p>
                </div>
                <div className="hidden flex-col items-center gap-y-1 xl:flex">
                  <p className="text-xs font-light">Recasts</p>
                  <p className="text-xs font-medium">
                    {data[index].reactions.recasts_count}
                  </p>
                </div>
              </div>
            ) : null}
            <Button
              onClick={() => handleVisitProfile(data[index]?.username)}
              variant="ghost"
            >
              Visit
            </Button>
          </div>
        </div>
      )
    },
    [visibleStartIndex, showMetrics]
  )

  const LoadingItem = () => {
    return (
      <div className="flex w-full flex-row items-start justify-between gap-x-2">
        <div className="flex flex-row gap-x-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-4 w-24 rounded-sm " />
          </div>
        </div>
        <Skeleton className="size-6 h-10 w-28 rounded-xl " />
      </div>
    )
  }

  return (
    <>
      {filteredUsers && filteredUsers.length && !loadingUsers ? (
        <List
          height={listHeight}
          width={"99.9%"}
          itemSize={70}
          itemCount={filteredUsers.length}
          itemData={filteredUsers}
          useIsScrolling
          onItemsRendered={({ visibleStartIndex }: any) =>
            setVisibleStartIndex(visibleStartIndex)
          }
          className="gap-y-2"
        >
          {Row}
        </List>
      ) : loadingUsers ? (
        <div className="flex flex-col gap-y-2">
          <LoadingItem />
          <LoadingItem />
          <LoadingItem />
        </div>
      ) : (
        <div>No users to display.</div>
      )}
    </>
  )
}

export default UserFeed
