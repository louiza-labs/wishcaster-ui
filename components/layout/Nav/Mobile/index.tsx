"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useBoundStore } from "@/store"
import { useNeynarContext } from "@neynar/react"

import useGetUser from "@/hooks/auth/useGetUser"
import useSubscribeToSessionChanges from "@/hooks/auth/useSubscribeToSessionChanges"
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
import MobileSearch from "@/components/layout/Nav/Mobile/Bottom/Search"
import SignInDrawer from "@/components/layout/Nav/Mobile/SignInDrawer"
import { ThemeToggle } from "@/components/theme-toggle"

interface MobileNavProps {
  notionResults: any
}
export function MobileNav({ notionResults }: MobileNavProps) {
  const { user, isAuthenticated, logoutUser } = useNeynarContext()
  const { userFromAuth } = useGetUser()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const userFilterParam = searchParams.get("connected")
  const addUserFIDToParams = useCallback((fid: Number) => {
    if (fid && userFilterParam && userFilterParam.length) {
      return
    } else if (fid) {
      const params = new URLSearchParams(window.location.search)

      params.set("connected", fid.toString()) // Add connected-account param
      router.push("?" + params.toString()) // Update the URL with new params
    } else {
    }
  }, [])

  const { isConnectedToNotion, isConnectedToLinear, isConnectedToTwitter } =
    useBoundStore((state: any) => state)
  useSubscribeToSessionChanges()
  const handleRouteHome = () => {
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <nav className="container flex h-16 w-full flex-row items-center justify-between pl-3 pr-2 md:hidden">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="-ml-2"
          onClick={handleRouteHome}
        >
          <Icons.logo />
        </Button>

        <div className="flex flex-row items-center gap-x-2">
          <MobileSearch notionResults={notionResults} />
          <ThemeToggle />

          <SignInDrawer />

          {user && user.pfp_url ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="border-none " asChild>
                <Avatar className="size-8">
                  <AvatarImage src={user.pfp_url} alt={user.username} />
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => logoutUser()}>
                    Disconnect accounts
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </nav>
    </header>
  )
}
