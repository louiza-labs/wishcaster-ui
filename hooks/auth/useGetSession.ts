"use client"

import { useEffect, useState } from "react"

import { getUserSession } from "@/app/actions"

const useGetSession = (user) => {
  const [session, setSession] = useState({})

  const fetchIdentities = async () => {
    const sessionRes = await getUserSession()
    const session = sessionRes?.session
    setSession(session)
  }

  useEffect(() => {
    if (user) {
      fetchIdentities()
    }
  }, [user])

  return {
    session,
  }
}

export default useGetSession
