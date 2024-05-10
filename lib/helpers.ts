import { Cast as CastType, Category } from "@/types"
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

export const welcomeMessages = [
  "Wowow Farcaster",
  // "Join the conversation. Sign in to share your story on Warpcast.",
  // "Ready to make your mark? Sign in to start casting on Warpcast.",
  // "Sign in to cast your thoughts and connect with the Warpcast community.",
  // "Be part of the decentralized dialogue. Sign in to cast your first post now.",
  // "Let's get your ideas out there. Sign in to start casting your unique perspective.",
  // "Elevate your voice. Sign in and amplify your message.",
  // "Connect, engage, and influence. Sign in to begin your Warpcast journey.",
  // "Make waves with your words. Sign in and cast away!",
  // "Sign in and join a new era of social networking.",
]

export const getMessage = (messagesList: string[]) => {
  return messagesList[Math.floor(Math.random() * messagesList.length)]
}

export const verifyUser = async (signerUuid: string, fid: string) => {
  let _isVerifiedUser = false
  try {
    const {
      data: { isVerifiedUser },
    } = await axios.post("/api/verify-user", { signerUuid, fid })
    _isVerifiedUser = isVerifiedUser
  } catch (err) {
    const { message } = (err as AxiosError).response?.data as ErrorRes
    toast(message, {
      type: "error",
      theme: "dark",
      autoClose: 3000,
      position: "bottom-right",
      pauseOnHover: true,
    })
  }
  return _isVerifiedUser
}

export const removeSearchParams = () => {
  window.history.replaceState({}, document.title, window.location.pathname)
}

export const makeEmail = (to: string, subject: string, message: string) => {
  const emailLines = []
  emailLines.push(`To: ${to}`)
  emailLines.push("Content-type: text/html;charset=iso-8859-1")
  emailLines.push("MIME-Version: 1.0")
  emailLines.push(`Subject: ${subject}`)
  emailLines.push("")
  emailLines.push(message)

  const email = emailLines.join("\r\n").trim()

  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export const addCategoryFieldsToCasts = (
  casts: CastType[],
  categories: Category[]
) => {
  return casts.map((cast) => {
    const categoryMatch = categories.find(
      (category) => category.request === cast.text
    )
    return { ...cast, category: categoryMatch ? categoryMatch.category : null }
  })
}
export const filterDuplicateCategories = (categories: Category[]) => {
  const uniqueCategories = categories.filter(
    (category, index, self) =>
      index === self.findIndex((c) => c.category === category.category)
  )
  return uniqueCategories
}
export const searchCastsForTerm = (
  casts: CastType[],
  searchTerm: string
): CastType[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim()
  return casts.filter((cast) =>
    cast.text.toLowerCase().includes(lowerCaseSearchTerm)
  )
}

export const searchCastsForCategories = (
  casts: CastType[],
  searchTerm: string
): CastType[] => {
  const searchTerms = searchTerm
    .toLowerCase()
    .split(",")
    .map((term) => term.trim())
  return casts.filter(
    (cast) =>
      cast.category &&
      searchTerms.some(
        (term) => cast.category && cast.category.toLowerCase() === term
      )
  )
}
