import { useEffect, useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { fetchFarcasterUsers } from "@/app/actions"

const useGetProfiles = (stringOfFIDs: string) => {
  const [profiles, setProfiles] = useState<any>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const { user } = useNeynarContext()
  const loggedInUsersFID = user?.fid ?? 0
  const fetchAndSetProfiles = async () => {
    if (stringOfFIDs && stringOfFIDs.length) {
      setLoadingProfiles(true)
      try {
        const profilesRes = await fetchFarcasterUsers(
          stringOfFIDs,
          loggedInUsersFID
        )
        const profilesArray = profilesRes.users ?? []
        setProfiles(profilesArray)
      } catch (error) {
        // console.error("Error fetching profile:", error)
      } finally {
        setLoadingProfiles(false)
      }
    }
  }

  useEffect(() => {
    fetchAndSetProfiles()
  }, [stringOfFIDs, loggedInUsersFID])

  return {
    profiles,
    loadingProfiles,
  }
}

export default useGetProfiles
