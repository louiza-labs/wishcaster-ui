"use client"

import Link from "next/link"
import { useBoundStore } from "@/store"
import { NeynarAuthButton, useNeynarContext } from "@neynar/react"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useGetSession from "@/hooks/auth/useGetSession"
import useGetUser from "@/hooks/auth/useGetUser"
import IntegrationsDropdown from "@/components/account/integrations/IntegrationsDropdown"
import { Icons } from "@/components/icons"
import Search from "@/components/search"
import { ThemeToggle } from "@/components/theme-toggle"

interface MainNavProps {
  items?: NavItem[]
}

export function DesktopNav({ items }: MainNavProps) {
  const { user, isAuthenticated, logoutUser } = useNeynarContext()
  const { userFromAuth } = useGetUser()
  const { session } = useGetSession(userFromAuth)
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
          <nav className="xl:min-w-200 flex w-fit items-center space-x-1 ">
            <IntegrationsDropdown />
            <NeynarAuthButton />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
