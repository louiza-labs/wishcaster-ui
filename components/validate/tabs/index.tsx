"use client"

import { sortCastsByProperty } from "@/lib/helpers"
import useValidate from "@/hooks/validate/useValidate"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CastsAndTweetsFeed from "@/components/feed/castsAndTweets"
import Engagement from "@/components/validate/tabs/engagement"
import Users from "@/components/validate/tabs/users"

interface ValidateTabsProps {
  tweetsAndCasts: any
}
const ValidateTabs = ({ tweetsAndCasts }: ValidateTabsProps) => {
  const { rawStatsMetricsForPosts, rawStatsbyUsers } =
    useValidate(tweetsAndCasts)

  const sortedPosts = sortCastsByProperty(tweetsAndCasts, "likes_count")
  return (
    <div>
      <Tabs defaultValue="engagement" className="  w-full">
        <TabsList className="flex w-full flex-row bg-transparent ">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>

          <TabsTrigger value="users">Who&apos;s asking? </TabsTrigger>
          <TabsTrigger value="posts">Top Posts</TabsTrigger>
          {/* <TabsTrigger value="demographics">Demographics</TabsTrigger> */}
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="engagement">
          <Engagement rawStats={rawStatsMetricsForPosts} />
        </TabsContent>

        <TabsContent value="users" className="w-full px-20">
          <Users usersStats={rawStatsbyUsers} />
        </TabsContent>
        <TabsContent value="posts">
          <CastsAndTweetsFeed
            timeFilterParam={""}
            nextCursor={""}
            columns={3}
            topic={""}
            casts={[]}
            tweets={sortedPosts.slice(0, 10)}
          />
        </TabsContent>
        {/* <TabsContent value="demographics"></TabsContent> */}
        <TabsContent value="comparison"></TabsContent>
      </Tabs>
    </div>
  )
}

export default ValidateTabs
