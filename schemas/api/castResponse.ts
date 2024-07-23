import { z } from "zod"

export const CastResponseSchema = z.object({
  object: z.literal("cast"),
  hash: z.string(),
  thread_hash: z.string(),
  parent_hash: z.string().nullable(),
  parent_url: z.string().nullable(),
  root_parent_url: z.string(),
  parent_author: z.object({ fid: z.number().nullable() }),
  author: z.object({
    object: z.literal("user"),
    fid: z.number(),
    custody_address: z.string(),
    username: z.string(),
    display_name: z.string(),
    pfp_url: z.string(),
    follower_count: z.number(),
    following_count: z.number(),
    active_status: z.string(),
    power_badge: z.boolean(),
  }),
  text: z.string(),
  timestamp: z.string(),
  embeds: z.array(z.object({})).optional(),
  frames: z.array(z.object({})).optional(),
  reactions: z.object({
    likes_count: z.number(),
    recasts_count: z.number(),
    likes: z.array(z.any()).optional(),
    recasts: z.array(z.any()).optional(),
  }),
  replies: z.object({ count: z.number() }),
  channel: z.object({
    object: z.literal("channel_dehydrated"),
    id: z.string(),
    name: z.string(),
    image_url: z.string(),
  }),
  mentioned_profiles: z.array(z.any()).optional(),
})

export type CastResponseType = z.infer<typeof CastResponseSchema>
