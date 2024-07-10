"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import CastItem from "@/components/cast/SprintItem"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

interface MobileSaveProps {
  handleSubmit: () => void
  handleClose: () => void
  inputFields: any[]
  buttonIcon?: any
  buttonText?: string
  formTitle?: string
  formDescription?: string
  submittingForm: boolean
  successfullySubmittingForm: boolean
  errorSubmittingForm: boolean
  successResult?: any
  onClose: (val: boolean) => void
  SuccessUI: any
  cast: any
  successMessage: string
}

function MobileSheetElements({
  handleSubmit,
  handleClose,
  inputFields,
  buttonIcon: Icon,
  buttonText,
  formTitle,
  successResult,
  formDescription,
  SuccessUI,
  submittingForm,
  successfullySubmittingForm,
  errorSubmittingForm,
  successMessage,
  cast,
  onClose,
}: MobileSaveProps) {
  const [currentSuccessTab, setCurrentSuccessTab] = useState("result")
  const handleSuccessTabChange = (val: string) => {
    setCurrentSuccessTab(val)
  }
  return (
    <>
      {successfullySubmittingForm && successMessage ? (
        <p className="ml-2 mt-2 text-center text-sm text-muted-foreground">
          {successMessage}{" "}
        </p>
      ) : formDescription ? (
        <p className="ml-2 mt-2 text-center text-sm text-muted-foreground">
          {formDescription}{" "}
        </p>
      ) : null}
      <ScrollArea className="mt-6 flex h-[calc(100vh-8rem)] flex-col items-center justify-center overflow-y-auto pb-2">
        {" "}
        <div className="grid h-full gap-10">
          {successfullySubmittingForm ? (
            <Tabs
              defaultValue="result"
              value={currentSuccessTab}
              onValueChange={handleSuccessTabChange}
              className="mt-4 flex flex-col gap-y-4"
            >
              <TabsList className="flex flex-row items-start  justify-around bg-transparent  text-lg font-semibold  sm:h-full">
                <TabsTrigger
                  className="flex flex-row items-center gap-x-2 text-left shadow-none"
                  value="result"
                >
                  Result
                </TabsTrigger>

                <TabsTrigger
                  className="flex flex-row items-center gap-x-2 text-left"
                  value="cast"
                >
                  Cast
                </TabsTrigger>
              </TabsList>

              <TabsContent className="h-fit" value="result">
                <SuccessUI fields={inputFields} result={successResult} />
              </TabsContent>
              <TabsContent className=" h-full" value="cast">
                {cast ? (
                  <div className="size-full p-4">
                    <CastItem
                      {...cast}
                      hideMetrics={false}
                      badgeIsToggled={false}
                      cast={cast}
                      hideActions={true}
                      routeToWarpcast={true}
                      mentionedProfiles={cast.mentioned_profiles}
                    />
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="form" className=" flex flex-col gap-y-4">
              <TabsList className="flex flex-row items-start  justify-around gap-x-10 bg-transparent  text-lg font-semibold  sm:h-full">
                {/* <TabsTrigger value="count">Count</TabsTrigger> */}
                {/* <TabsTrigger className="  text-left" value="info">
              Info
            </TabsTrigger> */}
                <TabsTrigger
                  className="flex flex-row items-center gap-x-2  text-left"
                  value="form"
                >
                  Form
                </TabsTrigger>

                <TabsTrigger
                  className="flex flex-row items-center gap-x-2 text-left"
                  value="cast"
                >
                  Cast
                </TabsTrigger>
              </TabsList>

              <TabsContent className=" h-fit " value="form">
                <>
                  <div className="flex h-full flex-col justify-between gap-4 ">
                    {inputFields
                      ? inputFields.map((field: any) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-1 items-center gap-4"
                          >
                            <Label htmlFor="width">{field.label}</Label>

                            {field.inputType === "boolean" ? (
                              <div className="flex flex-row items-center gap-x-4">
                                <Switch
                                  onCheckedChange={field.handleChange}
                                  checked={field.value}
                                  required={field.isRequired}
                                />
                                <span className="text-sm font-semibold">
                                  {field.value ? "Private" : "Public"}
                                </span>
                              </div>
                            ) : field.inputType === "select" ? (
                              <Select
                                onValueChange={field.handleChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={field.placeholder}>
                                    {field.name}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>{field.label}</SelectLabel>
                                    {field.options.map((option: any) => (
                                      <SelectItem value={option.value}>
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            ) : field.inputType === "textarea" ? (
                              <Textarea
                                id={field.id}
                                value={field.value}
                                placeholder={field.placeholder}
                                onChange={field.handleChange}
                                className="h-30 col-span-2 overflow-y-scroll"
                              />
                            ) : field.inputType === "number" ? (
                              <Input
                                id={field.id}
                                value={field.value}
                                placeholder={field.placeholder}
                                onChange={field.handleChange}
                                className="col-span-2 h-8"
                                type="number"
                              />
                            ) : (
                              <Input
                                id={field.id}
                                value={field.value}
                                placeholder={field.placeholder}
                                onChange={field.handleChange}
                                className="col-span-2 h-8"
                              />
                            )}
                          </div>
                        ))
                      : null}
                  </div>
                  <div className="mt-4 flex w-full  px-4">
                    {/* <Button onClick={handleClose} variant="destructive">
              Cancel
            </Button> */}

                    <Button
                      className="w-full"
                      onClick={handleSubmit}
                      variant={
                        submittingForm
                          ? "outline"
                          : errorSubmittingForm
                          ? "destructive"
                          : successfullySubmittingForm
                          ? "secondary"
                          : "default"
                      }
                    >
                      {submittingForm
                        ? "Submitting"
                        : successfullySubmittingForm
                        ? "Submitted"
                        : errorSubmittingForm
                        ? "Error"
                        : "Submit"}
                      {submittingForm ? (
                        <div className="ml-2 flex items-center">
                          <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        </div>
                      ) : null}
                    </Button>
                  </div>
                </>
              </TabsContent>
              <TabsContent className=" h-full" value="cast">
                {cast ? (
                  <div className="size-full p-4">
                    <CastItem
                      {...cast}
                      hideMetrics={false}
                      badgeIsToggled={false}
                      cast={cast}
                      hideActions={true}
                      routeToWarpcast={true}
                      mentionedProfiles={cast.mentioned_profiles}
                    />
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </ScrollArea>
    </>
  )
}

export default MobileSheetElements
