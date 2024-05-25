"use client"

import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react"

import useGetProfile from "@/hooks/farcaster/useGetProfile"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

const getFarcasterUserName = (user: any) => {
  if (
    user &&
    user.sessionId &&
    user.verifiedCredentials &&
    user.verifiedCredentials.length
  ) {
    const farcasterObj = user.verifiedCredentials.find(
      (credential: any) => credential.oauthProvider === "farcaster"
    )
    return farcasterObj.publicIdentifier.slice(1)
  }
}

export function MobileNav() {
  const { user, isAuthenticated, logoutUser } = useNeynarContext()
  const loggedInUserFarcasterHandle = getFarcasterUserName(user)
  const { userProfile: farcasterProfile } = useGetProfile(
    loggedInUserFarcasterHandle
  )

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <nav className="container flex h-16 w-full flex-row items-center justify-between md:hidden">
        <Icons.logo />
        {!isAuthenticated ? (
          <Button
            variant={"secondary"}
            className="whitespace-nowrap font-semibold"
          >
            <NeynarAuthButton
              variant={SIWN_variant.FARCASTER}
              label="Connect Farcaster"
              className="text-inter bg-transparent shadow-none"
            />{" "}
          </Button>
        ) : farcasterProfile && farcasterProfile.pfp ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none " asChild>
              <Avatar className="size-8">
                <AvatarImage
                  src={farcasterProfile.pfp.url}
                  alt={farcasterProfile.username}
                />
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => logoutUser()}>
                  Sign out
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </nav>
    </header>
  )
}
