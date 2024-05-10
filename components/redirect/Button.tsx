"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface RedirectButtonProps {
  path: string
  buttonText: string
}
const RedirectButton = ({ path, buttonText }: RedirectButtonProps) => {
  const router = useRouter()

  const handleRouteToPath = () => {
    router.push(path)
  }

  return <Button onClick={handleRouteToPath}>{buttonText}</Button>
}

export default RedirectButton
