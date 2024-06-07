"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

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
}: PopoverFormProps) {
  return (
    <Popover onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <Button variant="outline">{Icon ? <Icon /> : buttonText}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full ">
        <div className="grid gap-4">
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
              <div className="space-y-2">
                {formTitle ? (
                  <h4 className="font-medium leading-none">{formTitle}</h4>
                ) : null}
                {formDescription ? (
                  <p className="text-muted-foreground text-sm">
                    {formDescription}{" "}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                {inputFields
                  ? inputFields.map((field: any) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-3 items-center gap-4"
                      >
                        <Label htmlFor="width">{field.label}</Label>

                        {field.inputType === "textarea" ? (
                          <Textarea
                            id={field.id}
                            value={field.value}
                            placeholder={field.placeholder}
                            onChange={field.handleChange}
                            className="col-span-2 h-8"
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
      </PopoverContent>
    </Popover>
  )
}
