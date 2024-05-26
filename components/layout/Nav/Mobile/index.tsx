"use client"

import { useRouter } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

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
import SignInDrawer from "@/components/layout/Nav/Mobile/SignInDrawer"

export function MobileNav() {
  const { user, isAuthenticated, logoutUser } = useNeynarContext()
  const router = useRouter()
  const handleRouteHome = () => {
    router.push("/")
  }

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <nav className="container flex h-16 w-full flex-row items-center justify-between md:hidden">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="-ml-2"
          onClick={handleRouteHome}
        >
          <Icons.logo />
        </Button>

        {!isAuthenticated ? (
          <SignInDrawer />
        ) : user && user.pfp_url ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none " asChild>
              <Avatar className="size-8">
                <AvatarImage src={user.pfp_url} alt={user.username} />
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
