"use client"

import { useFormState, useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions"

const initialState = {
  message: "",
}

export default function AuthLoginForm() {
  const [state, formAction] = useFormState(login, initialState)

  const { pending } = useFormStatus()

  return (
    <>
      <form action={formAction} className="flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        {JSON.stringify(state)}
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="password">Password:</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <DialogFooter className="mt-4 flex flex-col items-center gap-y-10">
          <p aria-live="polite" className="text-red-500" role="status">
            {state?.message}
          </p>
          <Button>Log in</Button>
        </DialogFooter>
      </form>
    </>
  )
}
