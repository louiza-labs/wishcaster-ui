"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SaveToLinear from "@/components/cast/Save/Linear/index"
import SaveToNotion from "@/components/cast/Save/Notion/index"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

interface MobileSaveProps {
  cast: any
  notionResults: any
  onClose?: any
}

function MobileSave({ cast, notionResults, onClose }: MobileSaveProps) {
  return (
    <React.Suspense>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Save</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[86vh] rounded-t-xl">
          <Tabs
            defaultValue="notion"
            // onValueChange={handleSelectTab}
            className="mt-2 flex h-fit w-full flex-col items-start justify-start   px-2 "
          >
            <TabsList className="flex w-full flex-row items-start  justify-around gap-y-6    text-lg font-semibold  sm:h-full">
              {/* <TabsTrigger value="count">Count</TabsTrigger> */}
              {/* <TabsTrigger className="  text-left" value="info">
            Info
          </TabsTrigger> */}
              <TabsTrigger
                disabled={false}
                className="flex flex-row items-center gap-x-2 text-left"
                value="linear"
              >
                {/* <Icons.activity className="size-4" /> */}
                Linear
              </TabsTrigger>

              <TabsTrigger
                disabled={false}
                className="flex flex-row items-center gap-x-2 text-left"
                value="notion"
              >
                {/* <Icons.Integrations className="size-4" /> */}
                Notion
              </TabsTrigger>
            </TabsList>

            <TabsContent className=" h-full" value="linear">
              <SaveToLinear cast={cast} />
            </TabsContent>

            <TabsContent className="h-full" value="notion">
              <SaveToNotion cast={cast} notionResults={notionResults} />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </React.Suspense>
  )
}

export default MobileSave
