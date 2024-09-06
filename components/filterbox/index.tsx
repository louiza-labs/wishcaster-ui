"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import DateFilters from "@/components/filters/Date/new"
import UserFilters from "@/components/filters/User/new"

interface FilterboxProps {
  categories: any[]
}
export default function Component({ categories }: FilterboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSort, setSelectedSort] = useState("")
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [isOpen])

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="transition-all duration-300 ease-in-out"
      >
        <div className="rounded-md border bg-background shadow-sm">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center">
                <Filter className="size-4" />
                <span className="ml-2">Filter</span>
              </div>
              {isOpen ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent
          className="absolute inset-x-0 z-10 w-fit rounded-b-md border-x border-b bg-background shadow-lg lg:min-w-[300px]"
          style={{
            top: "100%",
            maxHeight: isOpen ? contentHeight : 0,
            overflow: "hidden",
            minWidth: "500px",
          }}
        >
          <div
            ref={contentRef}
            className="flex w-full flex-row items-start justify-between   p-4"
          >
            <DateFilters />
            <UserFilters />
            {/* <CategoriesFeed categories={categories} /> */}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
