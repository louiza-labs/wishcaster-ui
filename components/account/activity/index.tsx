"use client"

// should show a feed of casts you've liked/replied to or posted
//
import { useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { filterReactionsByChannel } from "@/lib/helpers"
import useFetchCastsForUser from "@/hooks/farcaster/casts/useFetchCastsForUser"
import useFetchReactionsForUser from "@/hooks/farcaster/reactions/useFetchReactionsForUser"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Cast from "@/components/cast/variants/SprintItem"

interface ActivityFeedProps {}
const ActivityFeed = ({}: ActivityFeedProps) => {
  const [selectedTab, setSelectedTab] = useState("casts")
  const { user: farcasterProfile, isAuthenticated } = useNeynarContext()
  const {
    casts: fetchedCasts,
    fetchingCasts,
    errorFetchingCasts,
  } = useFetchCastsForUser()
  const { reactions, fetchingReactions, errorFetchingReactions } =
    useFetchReactionsForUser(
      farcasterProfile && farcasterProfile?.fid ? farcasterProfile.fid : 0
    )
  const filteredReactions = filterReactionsByChannel(reactions, "someone-build")
  const filteredPosts = filterReactionsByChannel(fetchedCasts, "someone-build")
  const castsAndReactions = [...filteredReactions, ...filteredPosts]

  const CastActivities = ({ castsToShow }: any) => {
    return (
      <div className="grid w-full  grid-cols-1 gap-2  lg:grid-cols-2">
        {castsToShow && castsToShow.length ? (
          castsToShow.map((reaction: any) => (
            <div key={reaction.hash} className=" col-span-1 w-fit">
              <Cast
                {...reaction}
                key={reaction.hash}
                hideMetrics={false}
                badgeIsToggled={false}
                isReply={true}
                cast={reaction}
                mentionedProfiles={reaction.mentioned_profiles}
              />
            </div>
          ))
        ) : (
          <div className=" flex min-w-full flex-col items-center justify-center">
            <p className="my-4 w-full items-center text-center text-2xl font-semibold ">
              No activity found
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-w-full">
      <Tabs
        onValueChange={(val) => setSelectedTab(val)}
        defaultValue="casts"
        className="flex min-w-full  flex-col items-center justify-start "
      >
        <TabsList className="flex  flex-row items-start gap-y-6 bg-transparent  text-lg font-semibold sm:my-2 sm:h-full">
          {/* <TabsTrigger value="count">Count</TabsTrigger> */}
          <TabsTrigger className="  text-left" value="casts">
            <Button variant={selectedTab === "casts" ? "secondary" : "outline"}>
              Casts
            </Button>
          </TabsTrigger>
          <TabsTrigger
            disabled={!(farcasterProfile && farcasterProfile.fid)}
            className=" bg-transparent text-left shadow-none"
            value="likes"
          >
            <Button variant={selectedTab === "likes" ? "secondary" : "outline"}>
              Likes
            </Button>
          </TabsTrigger>

          <TabsTrigger
            disabled={false}
            className=" bg-transparent text-left"
            value="recasts"
          >
            <Button
              variant={selectedTab === "recasts" ? "secondary" : "outline"}
            >
              Recasts
            </Button>
          </TabsTrigger>
        </TabsList>

        <TabsContent className=" h-fit min-w-full  " value="casts">
          <CastActivities castsToShow={filteredPosts} />
        </TabsContent>
        <TabsContent className=" h-fit min-w-full   " value="likes">
          <CastActivities castsToShow={filteredReactions} />
        </TabsContent>

        <TabsContent className=" h-fit min-w-full" value="recasts">
          <CastActivities castsToShow={filteredReactions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ActivityFeed
