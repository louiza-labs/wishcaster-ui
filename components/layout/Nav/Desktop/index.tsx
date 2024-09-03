"use client"

import { useCallback, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
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
import IntegrationsDropdown from "@/components/integrations/IntegrationsDropdown"
import Search from "@/components/search"
import { ThemeToggle } from "@/components/theme-toggle"

interface MainNavProps {
  items?: NavItem[]
  notionResults: any
}

export function DesktopNav({ items, notionResults }: MainNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const userFilterParam = searchParams.get("connected")
  const addUserFIDToParams = useCallback((fid: Number) => {
    if (fid && userFilterParam && userFilterParam.length) {
      return
    } else if (fid) {
      const params = new URLSearchParams(window.location.search)
      console.log("the params", params)

      params.set("connected", fid.toString()) // Add connected-account param
      router.push("?" + params.toString()) // Update the URL with new params
    } else {
      console.log(userFilterParam)
    }
  }, [])
  const { user, isAuthenticated, logoutUser } = useNeynarContext()
  useEffect(() => {
    if (user && user.fid) {
      const userFID = user.fid
      addUserFIDToParams(userFID)
    }
  }, [user])
  useSubscribeToSessionChanges()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container hidden h-16 w-full items-center justify-between space-x-4 sm:space-x-0 md:flex">
        <div className=" hidden gap-6 md:flex md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="size-6" />
            <span className="inline-block font-bold">{siteConfig.name}</span>
          </Link>
          <Link href="/" className="flex items-center space-x-2">
            <span
              className={`${
                pathname === "/" ? "font-semibold" : ""
              } inline-block`}
            >
              Discover
            </span>
          </Link>
          <Link href="/topics" className="flex items-center space-x-2">
            <span
              className={`${
                pathname.includes("topic") ? "font-semibold" : ""
              } inline-block`}
            >
              Topics
            </span>
          </Link>
          <Link href="/research" className="flex items-center space-x-2">
            <span
              className={`${
                pathname === "/research" || pathname.includes("resarch")
                  ? "font-semibold"
                  : ""
              } keep-all inline-block whitespace-nowrap font-normal`}
            >
              Research Idea
            </span>
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
        {pathname.includes("/research") ? null : (
          <div className="mx-10 hidden w-full lg:block">
            <Search notionResults={notionResults} />
          </div>
        )}
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
