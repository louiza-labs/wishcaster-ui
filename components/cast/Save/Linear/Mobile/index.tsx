"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

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
  onClose: (val: boolean) => void
}

function MobileSaveToLinear({
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
}: MobileSaveProps) {
  return (
    <>
      {formDescription ? (
        <p className="ml-2 mt-2 text-center text-sm text-muted-foreground">
          {formDescription}{" "}
        </p>
      ) : null}
      <ScrollArea className="mt-6 flex h-[calc(100vh-8rem)] flex-col items-center justify-center overflow-y-auto pb-2">
        {" "}
        <div className="grid h-full gap-10">
          {successfullySubmittingForm ? (
            <div className="flex flex-col items-center justify-center gap-y-2">
              <p className="text-lg font-bold">Success! 🥳</p>
              {/* <p className="text-base font-light">Details:</p>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-semibold">Title</p>
                </div>
              </div> */}
            </div>
          ) : (
            <>
              <div className="grid h-full gap-8">
                {inputFields
                  ? inputFields.map((field: any) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 items-center gap-4"
                      >
                        <Label htmlFor="width">{field.label}</Label>

                        {field.inputType === "textarea" ? (
                          <Textarea
                            id={field.id}
                            value={field.value}
                            placeholder={field.placeholder}
                            onChange={field.handleChange}
                            className="col-span-2 h-8 overflow-y-scroll"
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
          )}
        </div>
      </ScrollArea>
    </>
  )
}

export default MobileSaveToLinear
