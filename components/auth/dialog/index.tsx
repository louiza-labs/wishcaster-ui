"use client"

import { useState } from "react"

import useGetUser from "@/hooks/auth/useGetUser"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/auth/forms/login"
import SignupForm from "@/components/auth/forms/signup"
import { Icons } from "@/components/icons"

export default function AuthForms() {
  const { userFromAuth } = useGetUser()
  const [selectedTab, setSelectedTab] = useState("login")

  const Header = () => {
    if (selectedTab === "login") {
      return (
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>Sign in</DialogDescription>
        </DialogHeader>
      )
    } else {
      return (
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>
            Signup to get access to new features!
          </DialogDescription>
        </DialogHeader>
      )
    }
  }

  return (
    <Dialog open={!(userFromAuth && Object.keys(userFromAuth).length)}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Icons.Power />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Header />
        <Tabs
          defaultValue="login"
          onValueChange={(val) => setSelectedTab(val)}
          className="mt-4 flex h-fit w-full min-w-full flex-col items-center gap-y-2  px-4 sm:px-0 md:w-fit md:items-start"
        >
          <TabsList className="flex w-fit  flex-row justify-between sm:my-2 sm:h-full ">
            {/* <TabsTrigger value="count">Count</TabsTrigger> */}
            <TabsTrigger className=" w-full" value="login">
              Login
            </TabsTrigger>

            <TabsTrigger disabled={false} className="w-full" value="signup">
              Signup
            </TabsTrigger>
          </TabsList>
          {/* <TabsContent value="count">
              <RankedValues values={rankedTopicsByCount} />
            </TabsContent> */}
          <TabsContent className=" h-fit  w-full min-w-full" value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent className=" h-fit  w-full min-w-full" value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
