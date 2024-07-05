import { useEffect, useState } from "react"

import { fetchFarcasterProfile } from "@/app/actions"

const useGetProfile = (userName: string) => {
  const [userProfile, setUserProfile] = useState<any>({})
  const [gettingProfile, setGettingProfile] = useState(false)

  const fetchAndSetProfile = async () => {
    if (userName && userName.length) {
      setGettingProfile(true)
      try {
        const userObject = await fetchFarcasterProfile(userName)
        setUserProfile(userObject)
      } catch (error) {
      } finally {
        setGettingProfile(false)
      }
    }
  }

  useEffect(() => {
    fetchAndSetProfile()
  }, [userName])

  return {
    userProfile,
    gettingProfile,
  }
}

export default useGetProfile
