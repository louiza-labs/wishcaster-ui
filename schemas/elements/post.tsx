import { z } from "zod"

export const PostElementSchema = z.object({
  timestamp: z.string(),
  text: z.string(),
  author: z.object({
    id: z.string(),
    username: z.string(),
    display_name: z.string().optional(),
    pfp_url: z.string().optional(),
  }),
  parent_url: z.string().nullable().optional(),
  reactions: z
    .object({
      likes_count: z.number().optional(),
      recasts_count: z.number().optional(),
    })
    .optional(),
  replies: z.object({ count: z.number().optional() }).optional(),
  hideActions: z.boolean().optional(),
  category: z.string().optional(),
  embeds: z.array(z.object({})).optional(),
  hash: z.string().optional(),
  mentionedProfiles: z.array(z.object({})).optional(),
  handleToggleCategoryClick: z.function().optional(),
  badgeIsToggled: z.function().optional(),
  hideMetrics: z.boolean().optional(),
  cast: z.boolean().optional(),
  tagline: z.string().optional(),
  isReply: z.boolean().optional(),
  renderEmbeds: z.function().optional(),
  notionResults: z.array(z.object({})).optional(),
  routeToWarpcast: z.function().optional(),
})

export type PostElementType = z.infer<typeof PostElementSchema>
