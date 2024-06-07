"use client"

import { useRouter } from "next/navigation"
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs"
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
import MobileSearch from "@/components/layout/Nav/Mobile/Bottom/Search"
import SignInDrawer from "@/components/layout/Nav/Mobile/SignInDrawer"
import { ThemeToggle } from "@/components/theme-toggle"

export function MobileNav() {
  const { user, isAuthenticated, logoutUser } = useNeynarContext()
  const router = useRouter()
  const handleRouteHome = () => {
    router.push("/")
  }

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
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
          <MobileSearch />
          <ThemeToggle />
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger className="relative border-none " asChild>
                <Avatar className="relative size-6">
                  <AvatarImage
                    src={"/linear-company-icon.svg"}
                    alt={"linear"}
                  />
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="px-4">
                    <SignOutButton>Sign out of Linear</SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <SignedOut>
            <DropdownMenu>
              <DropdownMenuTrigger className="relative border-none " asChild>
                <Avatar className="relative size-6 opacity-20">
                  <AvatarImage
                    src={"/linear-company-icon.svg"}
                    alt={"linear"}
                  />
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="px-4 font-semibold">
                    <SignInButton>Connect Linear Account</SignInButton>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedOut>
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
        </div>
      </nav>
    </header>
  )
}
