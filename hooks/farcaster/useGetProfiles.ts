import { useEffect, useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { fetchFarcasterUsers } from "@/app/actions"

const getFarcasterFID = (user: any) => {
  if (
    user &&
    user.sessionId &&
    user.verifiedCredentials &&
    user.verifiedCredentials.length
  ) {
    const farcasterObj = user.verifiedCredentials.find(
      (credential: any) => credential.oauthProvider === "farcaster"
    )
    return farcasterObj?.oauthAccountId || ""
  }
  return ""
}

const useGetProfiles = (stringOfFIDs: string) => {
  const [profiles, setProfiles] = useState<any>([])
  const [gettingProfiles, setGettingProfiles] = useState(false)
  const { user } = useNeynarContext()
  const loggedInUsersFID = user?.fid ?? 0
  const fetchAndSetProfiles = async () => {
    if (stringOfFIDs && stringOfFIDs.length) {
      setGettingProfiles(true)
      try {
        const profilesRes = await fetchFarcasterUsers(
          stringOfFIDs,
          loggedInUsersFID
        )
        const profilesArray = profilesRes.users ?? []
        setProfiles(profilesArray)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setGettingProfiles(false)
      }
    }
  }

  useEffect(() => {
    fetchAndSetProfiles()
  }, [stringOfFIDs, loggedInUsersFID])

  return {
    profiles,
    gettingProfiles,
  }
}

export default useGetProfiles
