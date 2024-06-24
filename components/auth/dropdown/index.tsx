"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { logoutUser } from "@/app/actions"

const AuthDropdown = ({}) => {
  const router = useRouter()
  const handleRouteToAccount = () => {
    router.push("/account")
  }

  const handleSignout = async () => {
    const signoutRes = await logoutUser()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative mr-4 border-none " asChild>
        <Button variant={"ghost"} className="relative">
          <Icons.circledUser />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleRouteToAccount}
            className="flex cursor-pointer flex-row justify-between"
          >
            Manage Account
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignout}
            className="flex cursor-pointer flex-row justify-between"
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AuthDropdown
