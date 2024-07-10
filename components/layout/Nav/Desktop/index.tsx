"use client"

import { useBoundStore } from "@/store"
import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react"
import Link from "next/link"

import IntegrationsDropdown from "@/components/account/integrations/IntegrationsDropdown"
import { Icons } from "@/components/icons"
import Search from "@/components/search"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { siteConfig } from "@/config/site"
import useGetUser from "@/hooks/auth/useGetUser"
import { cn } from "@/lib/utils"
import { NavItem } from "@/types/nav"

interface MainNavProps {
  items?: NavItem[]
}

export function DesktopNav({ items }: MainNavProps) {
  const { user, isAuthenticated, logoutUser } = useNeynarContext()
  const { userFromAuth } = useGetUser()
  const { isConnectedToNotion, isConnectedToLinear, isConnectedToTwitter } =
    useBoundStore((state: any) => state)
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container hidden h-16 w-full items-center justify-between space-x-4 sm:space-x-0 md:flex">
        <div className=" hidden gap-6 md:flex md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="size-6" />
            <span className="inline-block font-bold">{siteConfig.name}</span>
          </Link>
          <Link href="/topics" className="flex items-center space-x-2">
            <span className="inline-block font-normal">Topics</span>
          </Link>
          <div></div>

          {items?.length ? (
            <nav className="flex gap-6">
              {items?.map(
                (item, index) =>
                  item.href && (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center text-sm font-medium text-muted-foreground",
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
        <div className="mx-10 hidden w-full lg:block">
          <Search />
        </div>
        <div className="flex w-full flex-1 items-center justify-end space-x-4">
          <nav className="xl:min-w-200 flex w-fit items-center space-x-4 ">
            <ThemeToggle />
            {user && user.pfp_url ? <IntegrationsDropdown /> : null}
            {!user ? (
              <div className="z-10 w-fit lg:flex">
                <Button variant={"outline"}>
                  <NeynarAuthButton
                    variant={SIWN_variant.FARCASTER}
                    label="Connect Farcaster"
                    className="text-inter whitespace-nowrap rounded-sm border border-slate-200 bg-transparent shadow-none dark:text-white"
                  />
                </Button>
              </div>
            ) : user && user.pfp_url ? (
              <DropdownMenu>
                <DropdownMenuTrigger className=" w-fit border-none " asChild>
                  <Button variant={"ghost"}>
                    <Avatar className="size-8">
                      <AvatarImage src={user.pfp_url} alt={user.username} />
                    </Avatar>
                  </Button>
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
            ) : null}{" "}
          </nav>
        </div>
      </div>
    </header>
  )
}
