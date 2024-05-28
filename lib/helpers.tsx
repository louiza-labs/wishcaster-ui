import { Fragment } from "react"
import { Cast as CastType, Categories, Category } from "@/types"
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2"
import axios, { AxiosError } from "axios"

import { PRODUCT_CATEGORIES_AS_SETS } from "@/lib/constants"

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
    // toast(message, {
    //   type: "error",
    //   theme: "dark",
    //   autoClose: 3000,
    //   position: "bottom-right",
    //   pauseOnHover: true,
    // })
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
    return []
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
  if (!casts || !Array.isArray(casts)) return []
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
  if (!casts || casts.length === 0 || !Array.isArray(casts)) {
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
      "No soup for you!",
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
      "I'm sorry, Dave. I'm afraid I can't find those casts.",
      "One does not simply walk into Mordor, or find these casts.",
      "No soup for you!",
      "Winter is coming, but these casts are not.",
      "These are not the droids you are looking for.",
      "You're gonna need a bigger boat... to find these casts.",
      "Yer a wizard, Harry! But even you can't find these casts.",
      "What's in the box?! Not the casts, sadly.",
      "I feel the need—the need for... finding those missing casts!",
      "Hold onto your butts, because these casts are missing.",
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

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false
  const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov"]
  const lowerCaseUrl = url.toLowerCase()
  return videoExtensions.some((ext) => lowerCaseUrl.endsWith(ext))
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
// Define interfaces for the profiles and embeds
interface UserProfile {
  username: string
  display_name: string
  profile_url: string // Adjusted to include a profile URL if needed
}

interface Embed {
  url: string
  description?: string
  pfp_url?: string // Profile picture URL or similar
}

interface RenderTextWithLinksProps {
  text: string
  mentionedProfiles: UserProfile[]
  embeds: Embed[]
}

// Function to render text with links, mentions, and embeds
export const renderTextWithLinks = (
  text: string,
  mentionedProfiles: any[],
  embeds: any[]
) => {
  if (!text) return <span>{text}</span>

  // Maps for quick access
  const profileMap = new Map<string, UserProfile>()
  mentionedProfiles.forEach((profile) => {
    profileMap.set(`@${profile.username}`, profile)
  })

  const embedMap = new Map<string, Embed>()
  embeds.forEach((embed) => {
    embedMap.set(embed.url, embed)
  })

  // URL and user mention patterns
  const urlRegex = /https?:\/\/[^\s]+/g
  const atMentionRegex = /@\w+/g

  // Splitting the text to handle different parts
  const parts = text.split(/(https?:\/\/[^\s]+|@\w+)/g)

  return (
    <span>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          if (embedMap.has(part)) {
            const embed = embedMap.get(part)
            // Special rendering for embeds
            return (
              <div key={index} className="">
                <a
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-500"
                >
                  {part}
                </a>
              </div>
            )
          }
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-500"
            >
              {part}
            </a>
          )
        } else if (atMentionRegex.test(part)) {
          if (profileMap.has(part)) {
            const profile = profileMap.get(part)
            if (!profile) return
            return (
              <a
                key={index}
                href={profile.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600"
              >
                @{profile.username}
              </a>
            )
          }
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </span>
  )
}
export const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timer)
    //@ts-ignore
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}

function tokenize(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/\W+/))
}

function categorizeText(text: string, categories: Categories): string | null {
  if (!text) {
    return null
  }

  // Normalize text and prepare for keyword matching
  const normalizedText = text.toLowerCase().trim()

  // Initialize a dictionary to keep count of keyword matches for each category
  const keywordCounts: { [category: string]: number } = {}

  // Iterate through each category and its keywords
  for (const [category, keywords] of Object.entries(categories)) {
    // Initialize count for the category
    keywordCounts[category] = 0

    // Check for the presence of each keyword in the text using regex
    for (const keyword of keywords) {
      // Use word boundary and global search for accurate counting
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const matches = normalizedText.match(regex)
      if (matches) {
        keywordCounts[category] += matches.length
      }
    }
  }

  // Find the category with the highest count of matching keywords
  let bestCategory: string | null = null
  let maxCount = 0
  for (const [category, count] of Object.entries(keywordCounts)) {
    if (count > maxCount) {
      bestCategory = category
      maxCount = count
    }
  }

  // If no matches were found, return null
  if (maxCount === 0) {
    return null
  }

  return bestCategory
}

export function categorizeArrayOfCasts(casts: CastType[]) {
  if (!casts || !Array.isArray(casts)) return []
  return casts.map((cast: CastType) => {
    const castText = cast.text
    const category = categorizeText(castText, PRODUCT_CATEGORIES_AS_SETS)
    return {
      request: castText,
      category,
    }
  })
}

export function sortCastsByProperty(
  casts: CastType[],
  sortField: "recent" | "replies" | string
): CastType[] {
  // Create a shallow copy of the array to sort, to avoid modifying the original array
  const sortedCasts = [...casts]

  // Sort the copied array
  sortedCasts.sort((a, b) => {
    let valueA: number | string
    let valueB: number | string

    switch (sortField) {
      case "recent":
        // Sort by timestamp in descending order
        valueA = a.timestamp
        valueB = b.timestamp
        break
      case "replies":
        // Sort by replies count
        valueA = a.replies.count
        valueB = b.replies.count
        break
      default:
        let reactionsA: any = a.reactions
        let reactionsB: any = b.reactions
        // Sort by specified reaction type, ensure it exists or default to zero
        valueA = reactionsA[sortField] ?? 0
        valueB = reactionsB[sortField] ?? 0
    }

    // Return negative, zero, or positive based on the comparison for descending order
    return Number(valueB) - Number(valueA)
  })

  return sortedCasts
}

export const calculateStartDate = (
  range: "24-hours" | "7-days" | "30-days" | "ytd"
): Date => {
  const now = new Date()
  switch (range) {
    case "24-hours":
      now.setDate(now.getDate() - 1)
      break
    case "7-days":
      now.setDate(now.getDate() - 7)
      break
    case "30-days":
      now.setDate(now.getDate() - 30)
      break
    case "ytd":
      now.setMonth(0, 1) // Start from January 1st of the current year
      break
  }
  return now
}

export const formatDateForCastTimestamp = (timestamp: string) => {
  const now = new Date()
  const postDate = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInMonths / 12)

  const formatTime = (value: number, unit: string) => {
    return `${value} ${unit}${value !== 1 ? "s" : ""} ago`
  }

  if (diffInYears > 0) return formatTime(diffInYears, "year")
  if (diffInMonths > 0) return formatTime(diffInMonths, "month")
  if (diffInWeeks > 0) return formatTime(diffInWeeks, "week")
  if (diffInDays > 0) return formatTime(diffInDays, "day")
  if (diffInHours > 0) return formatTime(diffInHours, "hour")
  if (diffInMinutes > 0) return formatTime(diffInMinutes, "minute")
  return "Just now"
}

export const generateStatsFromProfiles = (
  profiles: any[],
  cast: CastType,
  stat: string
) => {
  if (!profiles || !Array.isArray(profiles) || !cast) return { value: 0 }
  const profilesAsObject = profiles.reduce((profileObj, profile) => {
    const { fid, power_badge, active_status } = profile
    profileObj[fid] = { power_badge, active_status }
    return profileObj
  }, {})

  if (stat === "priority_likes") {
    const priorityLikes = profiles.reduce((count, profile) => {
      let isAPriorityLike = profile.power_badge
      if (isAPriorityLike) {
        count++
      }
      return count
    }, 0)
    return { value: priorityLikes }
  }
  return { value: 0 }
}

export const generateStatsObjectForCast = (
  cast: any,
  priorityLikes: number,
  channelRank: number,
  categoryRank: number
) => {
  if (!cast) return {}
  const statsObject = {
    channelRanking: { label: "Channel Rank", value: channelRank },
    categoryRanking: { label: "Topic Rank", value: categoryRank },
    likes: {
      label: "Likes",
      value: cast.reactions.likes_count,
    },
    priorityLikes: { label: "Power Badge Likes", value: priorityLikes },

    replies: { label: "Replies", value: cast.replies.count },
    recasts: { label: "Recasts", value: cast.reactions.recasts_count },
  }
  return statsObject
}

export function getRanking(
  target: CastType,
  items: CastType[],
  metric: "likes" | "recasts" | "replies",
  filterField?: keyof CastType
): number | null {
  // Apply filtering only if filterField is provided and the target has this property defined
  const filteredItems =
    filterField && target[filterField] !== undefined
      ? items.filter((item) => item[filterField] === target[filterField])
      : items

  const getValueByMetric = (objectToGetValueFrom: any) => {
    if (metric === "likes") {
      return objectToGetValueFrom.reactions.likes_count
    }
    if (metric === "recasts") {
      return objectToGetValueFrom.reactions.recasts_count
    }
    if (metric === "replies") {
      return objectToGetValueFrom.replies
    }
    return 0
  }

  // Sort the filtered items by value in descending order
  filteredItems.sort((a, b) => getValueByMetric(b) - getValueByMetric(a))

  // Find the rank of the target item by comparing values
  for (let rank = 0; rank < filteredItems.length; rank++) {
    if (getValueByMetric(filteredItems[rank]) === getValueByMetric(target)) {
      return rank + 1 // Return rank starting from 1 (more human-readable)
    }
  }

  // If no matching value is found, return null
  return null
}
