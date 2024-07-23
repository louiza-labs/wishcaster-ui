import { z } from "zod"

export const TweetResponseSchema = z.object({
  entities: z.object({}).optional(),
  author_id: z.string(),
  username: z.string(),
  text: z.string(),
  created_at: z.string(),
  id: z.string(),
  public_metrics: z.object({}).optional(),
  edit_history_tweet_ids: z.array(z.string()).optional(),
})

export type TweetResponseType = z.infer<typeof TweetResponseSchema>
