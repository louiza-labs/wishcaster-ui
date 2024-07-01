"use client"

import { useEffect, useState } from "react"

import { getUserSocialIdentities } from "@/app/actions"

const useGetSocialIdentities = (user: any) => {
  const [socialIdentities, setSocialIdentities] = useState([])

  const fetchIdentities = async () => {
    const socialIdsRes = await getUserSocialIdentities()
    const socialIds = socialIdsRes?.identities
    setSocialIdentities(socialIdentities)
  }

  useEffect(() => {
    if (user && socialIdentities.length === 0) {
      fetchIdentities()
    }
  }, [user])

  return {
    socialIdentities,
  }
}

export default useGetSocialIdentities
