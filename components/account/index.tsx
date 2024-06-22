"use client"

import { useNeynarContext } from "@neynar/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivityFeed from "@/components/account/activity"
import AccountInfo from "@/components/account/info"
import Integrations from "@/components/account/integrations"

const AccountContainer = ({ user }: any) => {
  const { user: farcasterProfile, isAuthenticated } = useNeynarContext()

  const UserAvatar = () => {
    return (
      <div className="flex flex-row items-center gap-x-4">
        <Avatar className="relative size-14">
          {farcasterProfile ? (
            <AvatarImage
              src={farcasterProfile.pfp_url}
              alt={farcasterProfile.username}
            />
          ) : null}
          <AvatarFallback className="text-sm font-semibold">
            {user.email.split("@")[0]}
          </AvatarFallback>
        </Avatar>

        <p className="text sm">{user.email}</p>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col items-start justify-start">
      <UserAvatar />

      <Tabs
        defaultValue="activity"
        className="mt-4 flex h-fit items-center justify-start gap-y-2 px-4 sm:px-0  md:items-start  lg:flex-row lg:gap-x-20"
      >
        <TabsList className="flex  flex-col items-start gap-y-6 bg-transparent  text-lg font-semibold sm:my-2 sm:h-full">
          {/* <TabsTrigger value="count">Count</TabsTrigger> */}
          <TabsTrigger className="  text-left" value="info">
            Info
          </TabsTrigger>
          <TabsTrigger
            disabled={!(farcasterProfile && farcasterProfile.fid)}
            className=" text-left"
            value="activity"
          >
            Activity
          </TabsTrigger>

          <TabsTrigger
            disabled={false}
            className=" text-left"
            value="integrations"
          >
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent className=" h-fit   " value="info">
          <AccountInfo user={user} />
        </TabsContent>
        <TabsContent className=" h-fit   " value="activity">
          <ActivityFeed />
        </TabsContent>

        <TabsContent className="h-fit" value="integrations">
          <Integrations />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AccountContainer
