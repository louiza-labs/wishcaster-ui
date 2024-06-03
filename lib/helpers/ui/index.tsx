import { Fragment } from "react"

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
  const atMentionRegex = /@\w+|\(@\w+\)/g

  // Splitting the text to handle different parts
  const parts = text.split(/(https?:\/\/[^\s]+|@\w+|\(@\w+\))/g)

  return (
    <span className="flex-wrap break-all">
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
