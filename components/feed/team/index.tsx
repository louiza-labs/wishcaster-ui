"use client"

// Adjust the path as needed
import { useEffect, useState } from "react"
import { FixedSizeList as List } from "react-window"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
// Adjust the path as needed
import CastAvatar from "@/components/cast/CastAvatar"

const handleVisitProfile = (username: string) => {
  if (typeof window !== "undefined") {
    window.open(`https://www.warpcast.com/${username}`, "_blank")
  }
}

const UserFeed = ({ likeOrRecastedUsers, loadingUsers }: any) => {
  const [listHeight, setListHeight] = useState(window.innerHeight)
  const [visibleStartIndex, setVisibleStartIndex] = useState(0)

  const gutter = 10

  useEffect(() => {
    const updateSize = () => {
      setListHeight(window.innerHeight)
    }
    window.addEventListener("resize", updateSize)

    // Cleanup listener when component unmounts
    return () => window.removeEventListener("resize", updateSize)
  }, [listHeight])

  if (!likeOrRecastedUsers || likeOrRecastedUsers.length === 0) {
    return <div>No users to display.</div>
  }
  interface RowProps {
    data: any
    style: any
    index: number
  }
  const Row = ({ index, style, data }: RowProps) => {
    const adjustedStyle = {
      ...style,
      top: style.top + (index - visibleStartIndex) * gutter,
    }
    return (
      <div
        style={adjustedStyle}
        className=" flex w-full flex-row items-center justify-between rounded border p-2"
      >
        <CastAvatar author={data[index]} key={data[index].fid} />
        <Button
          onClick={() => handleVisitProfile(data[index]?.username)}
          variant="ghost"
        >
          Visit
        </Button>
      </div>
    )
  }
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
      {likeOrRecastedUsers && likeOrRecastedUsers.length && !loadingUsers ? (
        <List
          height={listHeight} // Adjust based on the viewport or container size
          width={"100%"} // Use 100% if it should fill the container
          itemSize={60} // Adjust based on the height of a single row
          itemCount={likeOrRecastedUsers.length}
          itemData={likeOrRecastedUsers}
          useIsScrolling
          onItemsRendered={({ visibleStartIndex }: any) =>
            setVisibleStartIndex(visibleStartIndex)
          }
          className=" gap-y-2" // Optional for additional styling
        >
          {Row}
        </List>
      ) : loadingUsers ? (
        <div className="flex flex-col gap-y-2">
          <LoadingItem />
          <LoadingItem />
          <LoadingItem />
        </div>
      ) : null}
    </>
  )
}

export default UserFeed
