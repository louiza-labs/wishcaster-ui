"use client"

import { useState } from "react"

import useFetchProfileFromDB from "@/hooks/account/useFetchProfileFromDB"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateAccount } from "@/app/actions"

const AccountInfo = ({ user }) => {
  const [showUpdateState, setShowUpdateState] = useState(false)
  const [updatingAccount, setUpdatingAccount] = useState(false)
  const [errorUpdatingAccount, setErrorUpdatingAccount] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarImg, setAvatarImg] = useState("")

  const { profile: profileFromDB, loading } = useFetchProfileFromDB({ user })

  const handleUpdateProfile = async () => {
    try {
      setUpdatingAccount(true)
      setErrorUpdatingAccount(false)
      const res = await updateAccount(user.id, {
        name,
        email,
        avatar_image: avatarImg,
      })
      setUpdatingAccount(false)
      console.log("the res of updating profile", res)
      setShowUpdateState(false)
    } catch (e) {
      setUpdatingAccount(false)
      setErrorUpdatingAccount(true)
    }
  }

  const handleToggleUpdateState = () => {
    setShowUpdateState(!showUpdateState)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }
  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const InfoField = ({ name, handler, value }) => {
    return (
      <div className="flex w-full flex-row  items-center justify-start gap-x-10">
        {/* <Label>{name}</Label> */}
        {showUpdateState ? (
          <Input
            type="text"
            value={value}
            placeholder={name}
            onChange={handler}
          />
        ) : (
          <p className="">{name}</p>
        )}
      </div>
    )
  }

  const ImageInputField = () => {
    return <div></div>
  }

  return (
    <div className="flex w-full flex-col items-start gap-y-10 px-20">
      <div className="flex w-full justify-between xl:flex-row">
        <p className="text-lg font-semibold">Profile Details</p>
        <Button className="" onClick={handleToggleUpdateState}>
          Update
        </Button>
      </div>
      <div className="flex w-full flex-col gap-y-4">
        <InfoField name={"Name"} value={name} handler={handleNameChange} />
        <InfoField name={"Email"} value={email} handler={handleEmailChange} />
      </div>
      <Button
        variant={
          errorUpdatingAccount
            ? "destructive"
            : updatingAccount
            ? "outline"
            : "secondary"
        }
        className="flex flex-row items-center justify-center"
        disabled={updatingAccount || errorUpdatingAccount}
        onClick={handleUpdateProfile}
      >
        Submit
      </Button>
    </div>
  )
}

export default AccountInfo
