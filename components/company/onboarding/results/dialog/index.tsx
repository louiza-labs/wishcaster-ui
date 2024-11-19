"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SignupDialogProps {
  isOpen: boolean
  isSuccess: boolean
}

export default function Component(
  { isOpen, isSuccess }: SignupDialogProps = {
    isOpen: true,
    isSuccess: true,
  }
) {
  const [open, setOpen] = useState(isOpen)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
  }

  const handleMainPageRoute = () => {
    handleClose()

    if (isSuccess) {
      router.push("/")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle2 className="size-6 text-green-500" />
                Successfully created account!
              </>
            ) : (
              <>
                <XCircle className="size-6 text-red-500" />
                Failed to create account
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isSuccess
              ? "Your account has been created successfully. Click below to visit the app."
              : "There were issues creating your account. Please go back and ensure all information is correct"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleMainPageRoute} className="w-full">
            {isSuccess ? "Visit App" : "Try Again"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
