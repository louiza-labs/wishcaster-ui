"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface UsersProps {
  usersStats: any[]
}
const Users = ({ usersStats }: UsersProps) => {
  const formattedUserStats = usersStats.map((user) => {
    const isFC = user.user.fid
    return {
      description: isFC ? user.user.profile.bio.text : user.user.description,
      name: isFC ? user.user.display_name : user.user.name,
      handle: isFC ? user.user.username : user.user.username,
      profileImage: isFC ? user.user.pfp_url : user.user.profile_image_url,
      isVerified: isFC ? user.user.power_badge : user.user.verified,
      platform: isFC ? "farcaster" : "twitter",
      stats: {
        likes: {
          count: isFC ? user.likes : user.likes,
          icon: Icons.likes,
          label: "Likes",
        },
        reposts: {
          count: isFC ? user.recasts : user.recasts,
          icon: Icons.recasts,
          label: "Reposts",
        },
        replies: {
          count: isFC ? user.replies : user.replies,
          icon: Icons.replies,
          label: "Replies",
        },
        impressions: {
          count: isFC ? user.impressions : user.impressions,
          icon: Icons.activity,
          label: "Impressions",
        },
        bookmarks: {
          count: isFC ? user.bookmarks : user.bookmarks,
          icon: Icons.bookmark,
          label: "Bookmarks",
        },
      },
      followersCount: isFC
        ? user.user.follower_count
        : user.user.public_metrics.followers_count,
      followingCount: isFC
        ? user.user.following_count
        : user.user.public_metrics.following_count,
    }
  })

  function UserCard({
    userName,
    userImage,
    userHandle,
    userDescription,
    userIsVerified,
    userStats,
    platform,
  }: any) {
    return (
      <Card className="relative w-full max-w-md overflow-hidden rounded-2xl">
        <div className="absolute left-2 top-2 z-50 -mb-4 mt-2 flex flex-col items-center">
          <Avatar className="border-1 flex size-5 flex-col items-center rounded-full border  p-1 shadow">
            {platform === "twitter" ? (
              <AvatarImage
                src={"/social-account-logos/twitter-logo-black.png"}
                alt={"twitter"}
              />
            ) : (
              <AvatarImage
                src={"/social-account-logos/farcaster-purple-white.png"}
                alt={"farcaster"}
                className="rounded-full"
              />
            )}
          </Avatar>
        </div>

        <div className="relative h-20 bg-[#8c7ae6]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <Avatar className="size-16 ring-4 ring-background">
              <AvatarImage src={userImage} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="relative flex h-fit flex-col justify-between px-5 py-10 text-center">
          <div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{userName}</h3>
              <div className="text-sm text-muted-foreground">@{userHandle}</div>
              {userIsVerified && (
                <Badge variant="outline" className="px-2 py-1 text-xs">
                  <BadgeCheckIcon className="mr-1 size-3" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {userDescription}
            </div>
          </div>
          <div className=" mt-4 flex h-fit flex-wrap gap-x-3 gap-y-2 px-3">
            {Object.entries(userStats).map(
              ([key, { icon: Icon, count, label }]: any) => (
                <div
                  key={key}
                  className="flex items-center justify-start gap-2 text-sm"
                >
                  <Icon className="size-4 text-gray-700" />

                  <span>{count}</span>
                  <span className="text-gray-500">{label}</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex w-full flex-col  gap-4">
      {formattedUserStats.slice(0, 5).map((user) => (
        <UserCard
          key={user.handle}
          userName={user.name}
          userImage={user.profileImage}
          userHandle={user.handle}
          userDescription={user.description}
          userIsVerified={user.isVerified}
          userStats={user.stats}
        />
      ))}
    </div>
  )
}

export default Users

function BadgeCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
