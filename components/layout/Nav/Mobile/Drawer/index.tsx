"use client"

import * as React from "react"
import { useCallback, useMemo } from "react"
import Link, { LinkProps } from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const searchParams = useSearchParams()
  const categoriesFromParams = useMemo(
    () => searchParams.getAll("categories"),
    [searchParams]
  )
  const router = useRouter()

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existingCategories = params.getAll(name)

      if (addValue) {
        if (!existingCategories.includes(value)) {
          params.append(name, value)
        }
      } else {
        const updatedCategories = existingCategories.filter(
          (category) => category !== value
        )
        params.delete(name)
        updatedCategories.forEach((category) => {
          params.append(name, category)
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  const badgeIsToggled = useCallback(
    (categoryName: string) => {
      return categoriesFromParams.includes(categoryName)
    },
    [categoriesFromParams]
  )

  const handleToggleCategoryClick = useCallback(
    (categoryName: string) => {
      const isToggled = categoriesFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "categories",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
    },
    [categoriesFromParams, createQueryString, router]
  )

  return (
    <div className="flex   md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Icons.hamburger />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <Icons.logo className="mr-2 size-4" />
            <span className="ml-2 font-bold">{siteConfig.name}</span>
          </MobileLink>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              <h4 className="font-medium">Selected topics</h4>
              <div className="sticky flex h-fit flex-wrap gap-2 lg:col-span-3">
                {categoriesFromParams && categoriesFromParams.length > 0
                  ? categoriesFromParams.map((category) => (
                      <div className="cols-span-3" key={category}>
                        <Badge
                          onClick={() =>
                            handleToggleCategoryClick(category.category)
                          }
                          variant={
                            badgeIsToggled(category) ? "default" : "outline"
                          }
                          className="h-10 w-fit cursor-pointer whitespace-nowrap"
                        >
                          {category}
                        </Badge>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export default MobileNav
