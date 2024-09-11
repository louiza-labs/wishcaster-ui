"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CastAndTweetsFeed from "@/components/feed/castsAndTweets"
import UsersFeed from "@/components/research/users"

interface PostAndUsersTabsProps {
  tweetsAndCasts: any
  rawStatsByUsers: any
}
const PostAndUsersTabs = ({
  tweetsAndCasts,
  rawStatsByUsers,
}: PostAndUsersTabsProps) => {
  return (
    <Tabs
      defaultValue="posts"
      className="mt-4 flex h-fit w-full flex-col items-center justify-start  md:items-start  lg:flex-col lg:gap-x-20"
    >
      <TabsList className="flex w-full flex-row  items-center justify-center  gap-y-6 bg-transparent  text-lg font-semibold  sm:h-full">
        {/* <TabsTrigger value="count">Count</TabsTrigger> */}
        {/* <TabsTrigger className="  text-left" value="info">
  Info
</TabsTrigger> */}
        <TabsTrigger
          className="flex flex-row items-center gap-x-2 text-left"
          value="posts"
        >
          Top Posts
        </TabsTrigger>

        <TabsTrigger
          disabled={false}
          className="flex flex-row items-center gap-x-2 text-left"
          value="users"
        >
          Top Users
        </TabsTrigger>
      </TabsList>
      <TabsContent className=" h-fit  w-full " value="posts">
        <CastAndTweetsFeed
          timeFilterParam={"ytd"}
          nextCursor={""}
          notionResults={[]}
          renderCardsAsSingleRow={true}
          columns="grid-cols-1"
          posts={tweetsAndCasts}
        />
      </TabsContent>
      <TabsContent className=" h-fit   " value="users">
        <UsersFeed usersStats={rawStatsByUsers} />
      </TabsContent>
    </Tabs>
  )
}

export default PostAndUsersTabs
