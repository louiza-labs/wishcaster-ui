"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Bounty from "@/components/bounties"
import Team from "@/components/team"

interface BuildProps {
  hash: string
  cast: any
  reactions: any
}
const BuildComponent = ({ hash, cast, reactions }: BuildProps) => {
  return (
    <Suspense fallback={<Skeleton className="size-full" />}>
      <Tabs
        defaultValue="find-team"
        className="mt-4 flex h-fit w-full min-w-full flex-col items-center gap-y-2  px-4 sm:px-0 md:w-fit md:items-start"
      >
        <TabsList className="flex w-full min-w-full flex-row justify-between">
          {/* <TabsTrigger value="count">Count</TabsTrigger> */}
          <TabsTrigger className=" w-full" value="find-team">
            Find a Team
          </TabsTrigger>
          <TabsTrigger disabled={false} className="w-full" value="post-bounty">
            Post a bounty
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent value="count">
              <RankedValues values={rankedTopicsByCount} />
            </TabsContent> */}
        <TabsContent className=" h-fit  w-full min-w-full" value="find-team">
          <Suspense fallback={<Skeleton className="size-full" />}>
            <Team cast={cast} reactions={reactions} />
          </Suspense>
        </TabsContent>
        <TabsContent className=" w-full min-w-full" value="post-bounty">
          <Bounty hash={hash} />
        </TabsContent>
      </Tabs>
    </Suspense>
  )
}

export default BuildComponent
