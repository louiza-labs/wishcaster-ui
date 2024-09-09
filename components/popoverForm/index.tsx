"use client"

import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import CastItem from "@/components/cast/variants/SprintItem"

interface PopoverFormProps {
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
  onClose: (val: boolean) => void
  defaultOpen?: boolean
  hideButton?: boolean
  buttonImage?: string
  isDisabled?: boolean
  successResult?: any
  SuccessUI: any
  cast: any
  isForCastPage?: boolean
}
export function PopoverForm({
  handleSubmit,
  handleClose,
  inputFields,
  buttonIcon: Icon,
  buttonText,
  formTitle,
  formDescription,
  submittingForm,
  successfullySubmittingForm,
  errorSubmittingForm,
  onClose,
  defaultOpen,
  buttonImage,
  isDisabled,
  hideButton,
  successResult,
  SuccessUI,
  isForCastPage,
  cast,
}: PopoverFormProps) {
  const [currentSuccessTab, setCurrentSuccessTab] = useState("result")
  const handleSuccessTabChange = (val: string) => {
    setCurrentSuccessTab(val)
  }
  return (
    <Sheet onOpenChange={(val) => (!val ? onClose : null)}>
      <SheetTrigger asChild>
        <Button
          variant={isForCastPage ? "outline" : "ghost"}
          disabled={isDisabled}
          className={`flex w-full flex-row justify-start gap-x-4 dark:text-white ${
            isForCastPage ? "text-xs" : ""
          }`}
        >
          {buttonImage ? (
            <Avatar className="relative size-6">
              {buttonImage ? (
                <AvatarImage src={buttonImage} alt={buttonText} />
              ) : null}
              <AvatarFallback className="text-sm font-semibold">
                {buttonText}
              </AvatarFallback>
            </Avatar>
          ) : null}
          {Icon ? <Icon /> : buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="flex min-h-full min-w-[30vw] flex-col gap-x-4 overflow-y-scroll  px-10  "
      >
        <div className="space-y-2">
          {formTitle ? (
            <div className="flex flex-row items-center gap-x-2">
              {buttonImage ? (
                <Avatar className="relative size-10">
                  {buttonImage ? (
                    <AvatarImage src={buttonImage} alt={buttonText} />
                  ) : null}
                  <AvatarFallback className="text-sm font-semibold">
                    {buttonText}
                  </AvatarFallback>
                </Avatar>
              ) : null}
              <h4 className="font-medium leading-none">{formTitle}</h4>
            </div>
          ) : null}
          {formDescription ? (
            <p className="text-sm text-muted-foreground">{formDescription} </p>
          ) : null}
        </div>
        {successfullySubmittingForm ? (
          <Tabs
            defaultValue="result"
            value={currentSuccessTab}
            onValueChange={handleSuccessTabChange}
            className="mt-4 flex flex-col gap-y-4"
          >
            <TabsList className="flex flex-row items-start  justify-around bg-transparent  text-lg font-semibold  sm:h-full">
              {/* <TabsTrigger value="count">Count</TabsTrigger> */}
              {/* <TabsTrigger className="  text-left" value="info">
                Info
              </TabsTrigger> */}
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
          <Tabs defaultValue="form" className="mt-4 flex flex-col gap-y-4">
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
                          className="flex flex-col items-start gap-4"
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
                              required={field.isRequired}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={field.placeholder}>
                                  {field.name}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="w-full">
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
                              className="col-span-2  min-h-[120px]"
                              required={field.isRequired}
                            />
                          ) : field.inputType === "number" ? (
                            <Input
                              id={field.id}
                              value={field.value}
                              placeholder={field.placeholder}
                              onChange={field.handleChange}
                              className="col-span-2 h-8"
                              type="number"
                              required={field.isRequired}
                            />
                          ) : (
                            <Input
                              id={field.id}
                              value={field.value}
                              placeholder={field.placeholder}
                              onChange={field.handleChange}
                              className="col-span-2 h-8"
                              required={field.isRequired}
                            />
                          )}
                        </div>
                      ))
                    : null}
                </div>
                <div className="mt-10 flex w-full  px-4">
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
      </SheetContent>
    </Sheet>
  )
}
