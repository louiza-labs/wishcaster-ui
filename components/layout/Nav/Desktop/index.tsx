"use client"

import Link from "next/link"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { DynamicConnectButton, useDynamicContext } from "@/lib/dynamic"
import { cn } from "@/lib/utils"
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
import Search from "@/components/search"
import { ThemeToggle } from "@/components/theme-toggle"

interface MainNavProps {
  items?: NavItem[]
}

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

export function DesktopNav({ items }: MainNavProps) {
  const { user, isAuthenticated, handleLogOut } = useDynamicContext()
  const loggedInUserFarcasterHandle = getFarcasterUserName(user)
  const { userProfile: farcasterProfile } = useGetProfile(
    loggedInUserFarcasterHandle
  )

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container hidden h-16 w-full items-center justify-between space-x-4 sm:space-x-0 md:flex">
        <div className=" hidden gap-6 md:flex md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="size-6" />
            <span className="inline-block font-bold">{siteConfig.name}</span>
          </Link>
          {items?.length ? (
            <nav className="flex gap-6">
              {items?.map(
                (item, index) =>
                  item.href && (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "text-muted-foreground flex items-center text-sm font-medium",
                        item.disabled && "cursor-not-allowed opacity-80"
                      )}
                    >
                      {item.title}
                    </Link>
                  )
              )}
            </nav>
          ) : null}
        </div>
        <div className="mx-10 w-full md:block">
          <Search />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
            {!isAuthenticated ? (
              <DynamicConnectButton>
                <Button
                  variant={"secondary"}
                  className="whitespace-nowrap font-semibold"
                >
                  Sign into FC
                </Button>
              </DynamicConnectButton>
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
                    <DropdownMenuItem onClick={() => handleLogOut()}>
                      Sign out
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  )
}
