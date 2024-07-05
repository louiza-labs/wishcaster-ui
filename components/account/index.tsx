"use client"

import { useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivityFeed from "@/components/account/activity"
import AccountInfo from "@/components/account/info"
import Integrations from "@/components/account/integrations"
import { Icons } from "@/components/icons"

const AccountContainer = ({ user }: any) => {
  const [selectedTab, setSelectedTab] = useState("activity")
  const { user: farcasterProfile, isAuthenticated } = useNeynarContext()
  const handleSelectTab = (val: string) => setSelectedTab(val)
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
    <div className="flex size-full flex-col  justify-start">
      <UserAvatar />
      <div className="flex flex-col items-center justify-start">
        {/* <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
          {capitalizeFirstLetter(selectedTab)}
        </h1> */}
      </div>

      <Tabs
        defaultValue="activity"
        onValueChange={handleSelectTab}
        className="mt-4 flex h-fit items-start justify-start   px-4 sm:px-0  md:items-start  lg:flex-row lg:gap-x-20"
      >
        <TabsList className="flex flex-col  items-start gap-y-6  bg-transparent  text-lg font-semibold  sm:h-full">
          {/* <TabsTrigger value="count">Count</TabsTrigger> */}
          {/* <TabsTrigger className="  text-left" value="info">
            Info
          </TabsTrigger> */}
          <TabsTrigger
            disabled={!(farcasterProfile && farcasterProfile.fid)}
            className="flex flex-row items-center gap-x-2 text-left"
            value="activity"
          >
            <Icons.activity className="size-4" />
            Activity
          </TabsTrigger>

          <TabsTrigger
            disabled={false}
            className="flex flex-row items-center gap-x-2 text-left"
            value="integrations"
          >
            <Icons.Integrations className="size-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent className=" h-fit   " value="info">
          <AccountInfo user={user} />
        </TabsContent>
        <TabsContent className=" h-full" value="activity">
          <ActivityFeed />
        </TabsContent>

        <TabsContent className="h-full" value="integrations">
          <Integrations />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AccountContainer
