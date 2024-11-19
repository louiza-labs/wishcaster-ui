"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card"

interface SignupDialogProps {
  isOpen: boolean
  isSuccess: boolean
}

export default function Component({ isOpen, isSuccess }: SignupDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) setOpen(true)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
  }

  const handleLoginRoute = () => {
    router.push("/login")
  }

  return (
    <motion.div
      className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-lg bg-white p-6 pb-10 "
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <CardHeader className="flex flex-col items-center justify-center">
        <motion.div
          className="flex items-center justify-center gap-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="size-10 animate-bounce text-green-500" />
              <h1 className="text-2xl font-bold text-green-600">Success!</h1>
            </>
          ) : (
            <>
              <XCircle className="size-10 text-red-500" />
              <h1 className="text-2xl font-bold text-red-600">Oops...</h1>
            </>
          )}
        </motion.div>
        <CardDescription className="mt-4 text-center text-base">
          {isSuccess ? (
            <div className="flex flex-col gap-y-4">
              <p className="text-center">Get started seeing results!</p>
            </div>
          ) : (
            "We encountered an issue. Please double-check your details and try again."
          )}
        </CardDescription>
      </CardHeader>

      {isSuccess && (
        <motion.div
          className="confetti-container"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div className="text-center text-4xl text-yellow-500">
            🎉
          </motion.div>
        </motion.div>
      )}

      <CardContent className=" flex flex-col items-center justify-center lg:mt-4 lg:flex-row lg:gap-x-4">
        {isSuccess ? (
          <>
            <Button
              onClick={() => window.open("https://mail.google.com", "_blank")}
              className="mt-4 rounded-lg bg-blue-500 px-6 py-3 text-white lg:mt-0"
            >
              Check Your Email
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleClose}
              className="mt-4 rounded-lg bg-red-500 px-6 py-3 text-white"
            >
              Retry Signup
            </Button>
            <a href="/help" className="mt-2 text-sm text-blue-600 underline">
              Need help?
            </a>
          </>
        )}
      </CardContent>
    </motion.div>
  )
}
