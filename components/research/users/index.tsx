"use client"

import React, { useMemo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"

// Define types properly
interface User {
  bio: string
  displayName: string
  username: string
  profileImageUrl: string
  verified: boolean
  followerCount: number
  followingCount: number
}

interface Stats {
  likes: number
  recasts: number
  replies: number
}

interface UsersStats {
  user: User
  likes: number
  recasts: number
  replies: number
}

interface UsersProps {
  usersStats: UsersStats[]
}

const Users = ({ usersStats }: UsersProps) => {
  // Memoize the formattedUserStats without slicing in memoization
  const formattedUserStats = useMemo(() => {
    return usersStats.map((user) => {
      const {
        bio,
        displayName,
        username,
        profileImageUrl,
        verified,
        followerCount,
        followingCount,
      } = user.user
      return {
        description: bio,
        name: displayName,
        handle: username,
        profileImage: profileImageUrl,
        isVerified: verified,
        followersCount: followerCount,
        followingCount: followingCount,
        stats: {
          likes: { count: user.likes, icon: Icons.likes, label: "Likes" },
          reposts: {
            count: user.recasts,
            icon: Icons.recasts,
            label: "Reposts",
          },
          replies: {
            count: user.replies,
            icon: Icons.replies,
            label: "Replies",
          },
        },
      }
    })
  }, [usersStats])

  const UserCard = React.memo(
    ({
      userName,
      userImage,
      userHandle,
      userDescription,
      userIsVerified,
      userStats,
    }: any) => (
      <Card className="relative w-full max-w-md overflow-hidden rounded-2xl">
        <div className="relative h-20 bg-[#8c7ae6]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <Avatar className="size-16 ring-4 ring-background">
              <AvatarImage src={userImage} alt={userName} loading="lazy" />
              <AvatarFallback>{userName[0]}</AvatarFallback>
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
                </Badge>
              )}
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {userDescription}
            </div>
          </div>
          <div className="mt-4 flex h-fit flex-wrap gap-x-3 gap-y-2 px-3">
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
  )

  // Add displayName to the memoized component for clarity and ESLint compliance
  UserCard.displayName = "UserCard"

  return (
    <div className="grid w-full grid-cols-2 gap-4">
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
