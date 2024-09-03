"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Bounty from "@/components/bounties"
import Cast from "@/components/cast/variants/Classic"

interface BuildProps {
  topic: string
  casts: any
  cursor: string
}
const BuildComponent = ({ topic, casts, cursor }: BuildProps) => {
  // const { conversations } = useFetchCastConversations(arrayOfCastHashes)
  const castsWithBountyBotText = casts.filter((cast: any) => {
    return cast.mentioned_profiles.find(
      (profile: any) => profile.username === "bountybot"
    )
  })

  return (
    <Suspense fallback={<Skeleton className="size-full" />}>
      <Tabs
        defaultValue="find-team"
        className="mt-4 flex h-fit w-full min-w-full flex-col items-center gap-y-2  px-4 sm:px-0 md:w-fit md:items-start"
      >
        <TabsList className="flex w-full min-w-full flex-row justify-between sm:my-2 sm:h-full sm:flex-wrap xl:flex-nowrap">
          {/* <TabsTrigger value="count">Count</TabsTrigger> */}
          <TabsTrigger className=" w-full" value="find-team">
            Find a Team
          </TabsTrigger>
          {castsWithBountyBotText && castsWithBountyBotText.length ? (
            <TabsTrigger
              disabled={false}
              className="w-full"
              value="existing-bounties"
            >
              Open bounties
            </TabsTrigger>
          ) : null}
          <TabsTrigger disabled={false} className="w-full" value="post-bounty">
            Post a bounty
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent value="count">
              <RankedValues values={rankedTopicsByCount} />
            </TabsContent> */}
        <TabsContent className=" h-fit  w-full min-w-full" value="find-team">
          <Suspense fallback={<Skeleton className="size-full" />}>
            {/* <TeamForTopics casts={casts} cursor={cursor} topic={topic} /> */}
          </Suspense>
        </TabsContent>
        {castsWithBountyBotText && castsWithBountyBotText.length ? (
          <TabsContent
            className=" h-fit  w-full min-w-full"
            value="existing-bounties"
          >
            <Suspense fallback={<Skeleton className="size-full" />}>
              {castsWithBountyBotText && castsWithBountyBotText.length ? (
                <div className="grid grid-cols-1 gap-4 overflow-x-hidden">
                  {castsWithBountyBotText.map((castWithBounty: any) => (
                    <Cast
                      {...castWithBounty}
                      hideMetrics={false}
                      badgeIsToggled={false}
                      key={castWithBounty.hash}
                      routeToWarpcast={true}
                      mentionedProfiles={castWithBounty.mentioned_profiles}
                    />
                  ))}
                </div>
              ) : (
                <p className="">No bounties found</p>
              )}
            </Suspense>
          </TabsContent>
        ) : null}
        <TabsContent className=" w-full min-w-full" value="post-bounty">
          <Bounty />
        </TabsContent>
      </Tabs>
    </Suspense>
  )
}

export default BuildComponent
