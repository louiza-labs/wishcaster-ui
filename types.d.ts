export interface UserInfo {
  signerUuid: string
  fid: string
}

export interface User {
  object: string
  fid: number
  custody_address: string
  username: string
  display_name: string
  pfp_url: string
  profile: {
    bio: {
      text: string
      mentioned_profiles: any[] // You can define a type for mentioned profiles if needed
    }
  }
  follower_count: number
  following_count: number
  verifications: string[]
  verified_addresses: {
    eth_addresses: string[]
    sol_addresses: string[]
  }
  active_status: string
  power_badge: boolean
}

export interface Embed {
  cast_id?: {
    fid: number
    hash: string
  }
  url?: string
}

export interface Reaction {
  fid: number
  fname: string
}

export interface Cast {
  // object: string
  hash: string
  thread_hash: string
  parent_hash: string | null
  parent_url: string
  root_parent_url: string
  category?: string | null
  parent_author: {
    fid: any // Assuming this can be null or a number
  }
  author: User
  text: string
  timestamp: string
  embeds: Embed[]
  reactions: {
    likes_count: number
    recasts_count: number
    likes: Reaction[]
    recasts: any[] // Assuming recasts can be empty or an array of objects
  }
  replies: {
    count: number
  }
  mentioned_profiles: any[] // You can define a type for mentioned profiles if needed
  handleToggleCategoryClick: (categoryName: string) => void
  badgeIsToggled: boolean
}

export interface Category {
  request: string
  category: string
}
