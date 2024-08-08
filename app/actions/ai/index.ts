"use server"

import { Cast } from "@/types"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// import { google } from "googleapis"
import { PRODUCT_CATEGORIES } from "@/lib/constants"

export const categorizeCastsAsRequests = async (casts: Cast[]) => {
  try {
    const prompt = `Based on the following product categories: ${PRODUCT_CATEGORIES}, categorize each product request into the category that fits it best. Ensure that each request is categorized and done so effectively. Please include in the response for each categorization both the Product Request and categorization. For each product request, you are to only provide a single category, that is the one of the best fit. The product requests to categorize for are as follows: ${casts
      .map((message: any, i: number) => `Request ${i + 1}:\n${message.text}`)
      .join("\n\n")}
      
      Here are some examples to follow:
       1. if a request is about 'AMA Frames', it should be categorized under the 'Frames' category. 
       2. if a request is about 'browser extensions', it should be categorized under the 'Extensions' category.
       3. if a request is about 'grant programs', it should be categorized under the 'Grants' category
       4. if a request is about 'Swaps', it should be categorized under the 'DeFi' category
       5. if a request is about 'Staking or Lending', it should be categorized under the 'DeFi' category
       6. if a request is about 'Clients', it should be categorized under the clients category
       
      
       Please follow similar guidelines for all requests.
      `
    const result = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      maxRetries: 4,
      // maxTokens: 600,
      schema: z.object({
        categorizedRequests: z.array(
          z.object({
            request: z.string(),
            category: z.string(),
          })
        ),
      }),
    })
    return result.object.categorizedRequests
  } catch (error) {
    return casts
  }
}

export const generateTaglinesForCasts = async (
  casts: Cast[],
  batchSize = 10,
  delay = 1000,
  concurrencyLimit = 3
) => {
  const batchedResults = []
  const batches: any = []

  // Split casts into smaller batches
  for (let i = 0; i < casts.length; i += batchSize) {
    const batch = casts.slice(i, i + batchSize)
    const prompt = `Summarize each product request into a concise 4-word tagline. These taglines are meant to clearly and briefly describe what product or feature someone wants. Please return back the generated tagline and corresponding hash. There may be links or backslashed text (ex: /someone-build) or mentions (@joe), please ignore that and focus solely on the product being requested. The product requests are as follows:\n\n${batch
      .map(
        ({ text, hash }: { text: string; hash?: string }, index: number) =>
          `Request ${index + i}:\n${text}\nHash: ${hash}`
      )
      .join("\n\n")}`

    batches.push({ prompt, startIndex: i })
  }

  const delayExecution = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const processBatch = async (batch: any) => {
    const { prompt, startIndex } = batch
    let retries = 3
    let currentDelay = delay

    while (retries > 0) {
      try {
        const result = await generateObject({
          model: openai("gpt-4o"),
          prompt,
          maxRetries: 3,
          maxTokens: 1200,
          schema: z.object({
            taglines: z.array(
              z.object({
                hash: z.string(),
                tagline: z.string(),
              })
            ),
          }),
        })
        return result.object.taglines
      } catch (error) {
        // console.log(
        //   `Error in generating taglines for batch starting at ${startIndex}:`,
        //   error
        // )
        if (retries === 1) throw error
        await delayExecution(currentDelay)
        currentDelay *= 2 // Exponential backoff
        retries--
      }
    }
  }

  const processBatchesWithConcurrency = async () => {
    const results = []
    for (let i = 0; i < batches.length; i += concurrencyLimit) {
      const batchSlice = batches.slice(i, i + concurrencyLimit)
      const promises = batchSlice.map((batch: any) => processBatch(batch))

      const settledResults = await Promise.allSettled(promises)
      for (const settled of settledResults) {
        if (settled.status === "fulfilled") {
          results.push(...settled.value)
        } else {
          // console.log("Failed batch processing:", settled.reason)
        }
      }

      if (i + concurrencyLimit < batches.length) {
        await delayExecution(delay)
      }
    }
    return results
  }

  return await processBatchesWithConcurrency()
}

export const generateProblemsAndSentimentScores = async (
  startupIdea: string,
  industryDescription: string,
  posts: { text: string; hash: string }[],
  batchSize = 10,
  delay = 1000,
  concurrencyLimit = 3
) => {
  const batchedResults = []
  const batches: any = []

  // Split posts into smaller batches
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize)
    const prompt = `Based on the startup idea and industry description, identify the top 5 most relevant related problems along with a 1 sentence description of them. For each post, list the problems that could be addressed by the startup idea and give a sentiment score (positive, neutral, or negative). Also, return the respective relevant hashes for the corresponding posts that share this problem for reference. The startup idea and industry description are:\n\nStartup Idea: ${startupIdea}\nIndustry Description: ${industryDescription}\n\nThe user feedback is as follows:\n\n${batch
      .map(
        ({ text, hash }: { text: string; hash?: string }, index: number) =>
          `Feedback ${index + i}:\n${text}\nHash: ${hash}`
      )
      .join("\n\n")}`

    batches.push({ prompt, startIndex: i })
  }

  const delayExecution = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const processBatch = async (batch: any) => {
    const { prompt, startIndex } = batch
    let retries = 3
    let currentDelay = delay

    while (retries > 0) {
      try {
        const result = await generateObject({
          model: openai("gpt-4o"),
          prompt,
          maxRetries: 3,
          maxTokens: 1200,
          schema: z.object({
            problems: z.array(
              z.object({
                hashes: z.array(z.string()),
                problem: z.string(),
                description: z.string(),
                sentiment: z.enum(["positive", "neutral", "negative"]),
              })
            ),
          }),
        })
        return result.object.problems
      } catch (error) {
        console.log(
          `Error in generating problems for batch starting at ${startIndex}:`,
          error
        )
        if (retries === 1) throw error
        await delayExecution(currentDelay)
        currentDelay *= 2 // Exponential backoff
        retries--
      }
    }
  }
  const processBatchesWithConcurrency = async () => {
    const results = []
    for (let i = 0; i < batches.length; i += concurrencyLimit) {
      const batchSlice = batches.slice(i, i + concurrencyLimit)
      const promises = batchSlice.map((batch: any) => processBatch(batch))

      const settledResults = await Promise.allSettled(promises)
      for (const settled of settledResults) {
        if (settled.status === "fulfilled") {
          results.push(...settled.value)
        } else {
          // console.log("Failed batch processing:", settled.reason)
        }
      }

      if (i + concurrencyLimit < batches.length) {
        await delayExecution(delay)
      }
    }
    return results
  }

  return await processBatchesWithConcurrency()
}

export async function generateSimilarIdeas(
  startupIdea: string,
  industryDescription: string
) {
  const prompt = `Generate a list of 5 startup ideas or product features that are as related as possible to the following startup idea and industry description. Please ensure that each idea is specific and limited to at most one sentence. These will be used in order to compare the provided idea against similar other ideas.\n\nStartup Idea: ${startupIdea}\nIndustry Description: ${industryDescription}`

  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt,
    maxRetries: 3,
    maxTokens: 1000,
    schema: z.object({
      ideas: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
        })
      ),
    }),
  })

  return result.object.ideas
}
