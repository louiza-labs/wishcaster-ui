import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/app/actions"

const AuthSignUpForm = () => {
  return (
    <>
      <form className="flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="name">Name:</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="password">Password:</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <DialogFooter className="mt-4">
          <Button formAction={signup}>Sign up</Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default AuthSignUpForm
