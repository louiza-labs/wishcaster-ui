export const extractUserIdsFromTweets = (tweets) => {
  if (!tweets) return []
  return tweets.map((tweet) => tweet.author_id)
}

export function normalizeTweetText(text: string): string {
  // Remove leading/trailing whitespace
  text = text.trim()

  // Replace newline characters with spaces
  text = text.replace(/\n/g, " ")

  // Convert all text to lowercase
  text = text.toLowerCase()

  // Remove or replace special characters (keep only alphanumeric and some punctuations)
  text = text.replace(/[^a-zA-Z0-9.,?!'\s]/g, "")

  // Replace multiple spaces with a single space
  text = text.replace(/\s+/g, " ")

  return text
}
