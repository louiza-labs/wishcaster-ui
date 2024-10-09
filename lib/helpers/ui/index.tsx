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

export const renderTextWithLinks = (
  text: string,
  mentionedProfiles: UserProfile[],
  embeds: Embed[],
  isTwitter = false
) => {
  if (!text) return <span>{text}</span>

  const profileMap = new Map<string, UserProfile>()
  mentionedProfiles.forEach((profile) => {
    profileMap.set(`@${profile.username.toLowerCase()}`, profile)
  })
  if (!Array.isArray(embeds)) {
    console.log("embeds", embeds)
  }
  let normalizedEmbeds = embeds && Array.isArray(embeds) ? embeds : []

  const embedMap = new Map<string, Embed>()
  normalizedEmbeds.forEach((embed) => {
    embedMap.set(embed.url, embed)
  })

  // Updated regex to match URLs and @mentions more accurately
  const regex = /(https?:\/\/\S+)|(@\w+)/gi

  const parts = text.split(regex)

  return (
    <span className="flex-wrap break-all">
      {parts.map((part, index) => {
        if (part?.startsWith("http")) {
          // Handle URLs
          const embed = embedMap.get(part)
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold ${
                embed ? "text-slate-500" : "text-blue-500"
              }`}
            >
              {part}
            </a>
          )
        } else if (part?.startsWith("@")) {
          // Handle @mentions
          const profile = profileMap.get(part.toLowerCase())
          if (profile) {
            const profileUrl = isTwitter
              ? `https://x.com/${profile.username}`
              : profile.profile_url
            return (
              <a
                key={index}
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600"
              >
                {part}
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
