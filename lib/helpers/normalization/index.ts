import { NormalizedPostType } from "@/types"

function normalizeFarcasterPost(farcasterPost: any): NormalizedPostType {
  return {
    id: farcasterPost.hash,
    author: {
      id: farcasterPost.author.fid,
      username: farcasterPost.author.username,
      displayName: farcasterPost.author.display_name,
      profileImageUrl: farcasterPost.author.pfp_url,
      bio: farcasterPost.author.profile?.bio?.text || null,
      verified: farcasterPost.author.power_badge || false,
      followerCount: farcasterPost.author.follower_count,
      followingCount: farcasterPost.author.following_count,
    },
    text: farcasterPost.text,
    createdAt: farcasterPost.timestamp,
    likesCount: farcasterPost.reactions.likes_count,
    commentsCount: farcasterPost.replies.count,
    sharesCount: farcasterPost.reactions.recasts_count,
    mediaUrls: farcasterPost.embed
      ? farcasterPost.embeds?.map((embed: any) => ({
          url: `https://warpcast.com/c/${embed.cast_id.hash}`,
          type: "photo",
        }))
      : [] || [],
    category: {
      label: farcasterPost.category.label,
      id: farcasterPost.category.id,
    },
    platform: "farcaster",
    threadInfo: {
      parentPostId: farcasterPost.parent_hash,
      rootPostId: farcasterPost.thread_hash,
    },
    mentionedProfiles: farcasterPost.mentioned_profiles
      ? farcasterPost.mentioned_profiles.map((profile: any) => ({
          username: profile.username,
          displayName: profile.display_name,
          profileUrl: `https://warpcast.com/${profile.username}`,
        }))
      : [],
  }
}

export function normalizeTwitterPost(twitterPost: any): NormalizedPostType {
  return {
    id: twitterPost.id,
    author: {
      id: twitterPost.user.id,
      username: twitterPost.user.username,
      displayName: twitterPost.user.name,
      profileImageUrl: twitterPost.user.profileImageUrl,
      verified: twitterPost.user.verified,
      followerCount: twitterPost.user.followerCount,
      followingCount: twitterPost.user.followingCount,
    },
    text: twitterPost.text,
    createdAt: twitterPost.created_at,
    likesCount: twitterPost.public_metrics.like_count,
    commentsCount: twitterPost.public_metrics.reply_count,
    sharesCount: twitterPost.public_metrics.retweet_count,
    mediaUrls: twitterPost.media
      ? twitterPost.media.map((media: any) => ({
          url: media.url,
          type: media.type as "photo" | "video",
        }))
      : [],

    category: {
      label: twitterPost.category?.label || null,
      id: twitterPost.category?.id || null,
    },
    platform: "twitter",
    threadInfo: {
      parentPostId: twitterPost.referenced_tweets?.[0]?.id || null,
      rootPostId: twitterPost.edit_history_tweet_ids?.[0] || null,
    },
    mentionedProfiles:
      twitterPost.entities?.mentions?.map((mention: any) => ({
        username: mention.username,
        displayName: mention.name || mention.username,
        profileUrl: `https://twitter.com/${mention.username}`,
      })) || [],
    additionalMetrics: {
      retweetCount: twitterPost.public_metrics.retweet_count,
      quoteCount: twitterPost.public_metrics.quote_count,
      bookmarkCount: twitterPost.public_metrics.bookmark_count,
      impressionCount: twitterPost.public_metrics.impression_count,
    },
  }
}
function determinePlatform(post: NormalizedPostType): "farcaster" | "twitter" {
  if ("object" in post && post.object === "cast") {
    return "farcaster"
  }
  return "twitter"
}

export function normalizePost(
  post: any,
  platform: "farcaster" | "twitter"
): NormalizedPostType {
  switch (platform) {
    case "farcaster":
      return normalizeFarcasterPost(post)
    case "twitter":
      return normalizeTwitterPost(post)
    default:
      throw new Error("Unsupported platform")
  }
}

export function normalizePosts(posts: any[]): NormalizedPostType[] {
  if (!(posts && Array.isArray(posts))) return []
  return posts.map((post) => {
    const platform = determinePlatform(post)
    return normalizePost(post, platform)
  })
}
