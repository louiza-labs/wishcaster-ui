export type KeywordTrend = "up" | "down" | "neutral"

export interface Keyword {
  keyword: string
  count: number
  trend: KeywordTrend
}

export const topKeywords: Keyword[] = [
  { keyword: "vegan", count: 500, trend: "up" },
  { keyword: "eco-friendly", count: 450, trend: "up" },
  { keyword: "colors", count: 400, trend: "neutral" },
  { keyword: "packaging", count: 350, trend: "up" },
  { keyword: "price", count: 300, trend: "down" },
]

export interface EngagementData {
  name: string
  mentions: number
  likes: number
  followers: number
}

export const engagementData: EngagementData[] = [
  { name: "Mon", mentions: 1000, likes: 3000, followers: 800 },
  { name: "Tue", mentions: 1200, likes: 3500, followers: 900 },
  { name: "Wed", mentions: 1100, likes: 3200, followers: 850 },
  { name: "Thu", mentions: 1300, likes: 3800, followers: 950 },
  { name: "Fri", mentions: 1500, likes: 4000, followers: 1000 },
  { name: "Sat", mentions: 1400, likes: 3700, followers: 980 },
  { name: "Sun", mentions: 1200, likes: 3500, followers: 920 },
]

export type Sentiment = "positive" | "neutral" | "negative" | "mixed"

export interface TopPost {
  id: number
  content: string
  engagement: number
  sentiment: Sentiment
}

export const topPosts: TopPost[] = [
  {
    id: 1,
    content: "I wish there was a vegan option for this product!",
    engagement: 1500,
    sentiment: "neutral",
  },
  {
    id: 2,
    content: "Can we get this in different colors?",
    engagement: 1200,
    sentiment: "positive",
  },
  {
    id: 3,
    content: "Love the product, but the packaging could be more eco-friendly.",
    engagement: 1000,
    sentiment: "mixed",
  },
]

export interface RelevantUser {
  id: number
  name: string
  handle: string
  followers: number
  bio: string
  sentiment: Sentiment
}

export const relevantUsers: RelevantUser[] = [
  {
    id: 1,
    name: "EcoWarrior",
    handle: "@eco_warrior",
    followers: 10500,
    bio: "Fighting for a greener planet, one product at a time.",
    sentiment: "positive",
  },
  {
    id: 2,
    name: "ColorLover",
    handle: "@color_enthusiast",
    followers: 8900,
    bio: "Life is too short for boring colors!",
    sentiment: "neutral",
  },
  {
    id: 3,
    name: "GreenPackaging",
    handle: "@sustainable_pack",
    followers: 15200,
    bio: "Advocating for eco-friendly packaging solutions.",
    sentiment: "positive",
  },
]
