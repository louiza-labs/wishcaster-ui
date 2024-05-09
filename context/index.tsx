"use client"

import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useSearchParams } from "next/navigation"
import { UserInfo } from "@/types"
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

import { verifyUser } from "@/lib/helpers"
import useLocalStorage from "@/hooks/localStorage"
import { fetchFarcasterUser } from "@/app/actions"

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export enum ScreenState {
  Signin = "signin",
  Home = "home",
}

interface Props {
  children: ReactNode
}

interface AppContextInterface {
  screen: ScreenState
  setScreen: SetState<ScreenState>
  displayName: string | null
  setDisplayName: SetState<string | null>
  pfp: string | null
  setPfp: SetState<string | null>
  signerUuid: string | null
  setSignerUuid: SetState<string | null>
  fid: string | null
  setFid: SetState<string | null>
  followersCount: number | null
  followingCount: number | null
}

const AppContext = createContext<AppContextInterface | null>(null)

export const AppProvider: FC<Props> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Signin)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [pfp, setPfp] = useState<string | null>(null)
  const [signerUuid, setSignerUuid] = useState<string | null>(null)
  const [fid, setFid] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const [user, setUser, removeUser] = useLocalStorage<UserInfo | null>(
    "user",
    null
  )
  const [followerCount, setFollowerCount] = useState<number | null>(null)
  const [followingCount, setFollowingCount] = useState<number | null>(null)

  const lookupUser = useCallback(async () => {
    if (user && user.fid) {
      try {
        const userRes = await fetchFarcasterUser(Number(user.fid))
        setDisplayName(userRes.displayName)
        setPfp(userRes.pfp.url)
        setFollowerCount(userRes?.followerCount)
        setFollowingCount(userRes?.followingCount)
      } catch (err) {
        const axiosError = err as AxiosError<ErrorRes>
        toast(axiosError.response?.data.message || "An error occurred", {
          type: "error",
          theme: "dark",
          autoClose: 3000,
          position: "bottom-right",
          pauseOnHover: true,
        })
      }
    }
  }, [user])

  useEffect(() => {
    // Read from URL query params if we need to support old flow
    // if (searchParams.get("signer_uuid") && searchParams.get("fid")) {
    //     setSignerUuid(searchParams.get("signer_uuid"));
    //     setFid(searchParams.get("fid"));
    // }

    lookupUser()
  }, [lookupUser])

  const isUserLoggedIn = useCallback(async () => {
    if (user) {
      setScreen(ScreenState.Home)
    } else {
      if (signerUuid && fid) {
        const verifiedUser = await verifyUser(signerUuid, fid)
        if (verifiedUser) {
          setUser({ signerUuid, fid })
          setScreen(ScreenState.Home)
        } else {
          removeUser()
          setScreen(ScreenState.Signin)
        }
      } else {
        setScreen(ScreenState.Signin)
      }
    }
  }, [user, signerUuid, fid, setUser, removeUser])

  useEffect(() => {
    isUserLoggedIn()
  }, [isUserLoggedIn])

  const value: AppContextInterface | null = useMemo(
    () => ({
      screen,
      setScreen,
      displayName,
      setDisplayName,
      pfp,
      setPfp,
      signerUuid,
      followerCount,
      followingCount,
      setSignerUuid,
      fid,
      setFid,
    }),
    [screen, displayName, pfp, signerUuid, fid]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = (): AppContextInterface => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("AppContext must be used within AppProvider")
  }
  return context
}
