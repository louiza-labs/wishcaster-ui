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
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return {}
  }
  return casts.map((cast) => {
    const categoryMatch = categories.find(
      (category) => category.request === cast.text
    )
    return { ...cast, category: categoryMatch ? categoryMatch.category : null }
  })
}
export const filterDuplicateCategories = (categories: Category[]) => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
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

export const buildRankings = (
  casts: CastType[],
  focus: keyof CastType,
  metric: "likes_count" | "replies_count" | "recasts_count" | "count",
  limit: number
): { name: string; value: number }[] => {
  if (!casts || casts.length === 0) {
    return []
  }

  // Create an object to accumulate metrics
  const metricsMap = new Map<string, number>()

  casts.forEach((cast) => {
    const focusValue = cast[focus] as string // Ensuring the value is treated as a string
    if (metric === "count") {
      // Count occurrences of each focus value
      metricsMap.set(focusValue, (metricsMap.get(focusValue) || 0) + 1)
    } else if (metric === "replies_count") {
      metricsMap.set(
        focusValue,
        (metricsMap.get(focusValue) || 0) + (cast["replies"]["count"] || 0)
      )
    } else {
      metricsMap.set(
        focusValue,
        (metricsMap.get(focusValue) || 0) + (cast["reactions"][metric] || 0)
      )

      // Sum the metric values for each focus value
    }
  })

  // Convert the map into an array, sort it, and slice it to the limit
  const sorted = Array.from(metricsMap)
    .map(([name, value]) => ({ name, value }))
    .filter((metric) => metric.name && metric.name.length > 0)
    .sort((a, b) => b.value - a.value) // Sort in descending order by value
    .slice(0, limit)

  return sorted
}

export function generateWhimsicalErrorMessages(is404 = false) {
  let messages
  if (is404) {
    messages = [
      "These aren't the droids you're looking for. 🌌",
      "Houston, we have a problem... this page doesn't exist!",
      "I'm sorry, Dave. I'm afraid I can't find that page.",
      "One does not simply walk into a non-existent page.",
      "No page for you!",
      "Winter is coming, but this page is not.",
      "I've got a bad feeling about this... No page detected!",
      "May the Force be with you, because this page is not.",
      "In the vast galaxy of the Internet, this is not the page you are looking for.",
      "You're gonna need a bigger boat... to find this missing page.",
      "I am Groot... which means I can't find your page.",
      "Yer a wizard, Harry! But even magic can't conjure this page.",
      "What's in the box?! Definitely not this page, sadly.",
      "Life finds a way, but we couldn't find this page.",
      "I feel the need—the need for... the correct URL!",
      "They may take our lives, but they’ll never take... this missing page!",
      "We're not in Kansas anymore. We are, however, missing this page.",
      "The truth is out there... but this page certainly is not.",
      "Hold onto your butts, because this page is missing.",
      "There's no place like home... and apparently no place like this page either.",
    ]
  } else {
    messages = [
      "These aren't the casts you're looking for. 🌌",
      "Houston, we have a problem... with finding casts!",
      "I'm sorry, Dave. I'm afraid I can't find those casts.",
      "One does not simply walk into Mordor, or find these casts.",
      "No casts for you!",
      "Winter is coming, but these casts are not.",
      "I've got a bad feeling about this... No casts detected!",
      "May the Force be with you, because the casts are not.",
      "In the galaxy of casts, this is not the droid you are looking for.",
      "You're gonna need a bigger boat... to find these casts.",
      "I'm Groot... which means I can't find your casts.",
      "Yer a wizard, Harry! But even magic can't find these casts.",
      "What's in the box?! Not the casts, sadly.",
      "Life finds a way, but we couldn't find the casts.",
      "I feel the need—the need for... finding those missing casts!",
      "They may take our lives, but they’ll never take... our casts!",
      "We're not in Kansas anymore. We are, however, missing casts.",
      "The truth is out there... but these casts certainly are not.",
      "Hold onto your butts, because these casts are missing.",
      "There's no place like home... to search for more casts.",
    ]
  }
  return messages[Math.floor(Math.random() * messages.length)]
}

// Check if a URL is an image URL
export function isImageUrl(url: string | null | undefined) {
  if (!url || typeof url !== "string") return false
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".webp",
  ]
  const lowerCaseUrl = url.toLowerCase()
  if (lowerCaseUrl.includes("imagedelivery")) return true
  return imageExtensions.some((ext) => lowerCaseUrl.endsWith(ext))
}

// Load image and calculate aspect ratio
export function loadImageAspectRatio(url: string, setAspectRatio: any) {
  if (typeof window === "undefined") return // Ensure it's executed on the client side
  const img = new window.Image()
  img.src = url
  img.onload = () => {
    const ratio = (img.height / img.width) * 100
    setAspectRatio(`${ratio}%`)
  }
}

// Render text with clickable links
export function renderTextWithLinks(text: string) {
  const urlRegex =
    /(?:https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(com|co|io|org|net|edu|gov|uk|frame|xyz|us|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|es|mil)(\/[\w-]*)*/gi
  const parts = text.split(urlRegex)

  return parts.map((part: string, index: number) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {part}
        </a>
      )
    } else {
      return <span key={index}>{part}</span>
    }
  })
}

export const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timer)
    //@ts-ignore
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}
