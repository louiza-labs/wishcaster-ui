"use client"

import { useNeynarContext } from "@neynar/react"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccountInfo from "@/components/account/info"

const AccountContainer = ({ user }) => {
  const { user: farcasterProfile, isAuthenticated } = useNeynarContext()

  const UserAvatar = () => {
    return (
      <div className="flex flex-row items-center">
        <Avatar className="relative size-8">
          {farcasterProfile ? (
            <AvatarImage
              src={farcasterProfile.pfp_url}
              alt={farcasterProfile.username}
            />
          ) : null}
        </Avatar>

        <p className="text sm">{user.email}</p>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col p-10">
      <UserAvatar />

      <Tabs
        defaultValue="activity"
        className="mt-4 flex h-fit w-full items-center justify-center gap-y-2 px-4 sm:px-0  md:items-start  lg:gap-x-20 xl:flex-row"
      >
        <TabsList className="flex w-fit flex-col items-start gap-y-6 bg-transparent  text-lg font-semibold sm:my-2 sm:h-full">
          {/* <TabsTrigger value="count">Count</TabsTrigger> */}
          <TabsTrigger className="  text-left" value="info">
            Info
          </TabsTrigger>
          <TabsTrigger disabled={false} className=" text-left" value="activity">
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

        <TabsContent className=" h-fit w-full  " value="info">
          <AccountInfo user={user} />
        </TabsContent>
        <TabsContent
          className=" h-fit  w-full min-w-full"
          value="activity"
        ></TabsContent>

        <TabsContent
          className=" w-full min-w-full"
          value="integrations"
        ></TabsContent>
      </Tabs>
    </div>
  )
}

export default AccountContainer
