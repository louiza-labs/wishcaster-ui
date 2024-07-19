export const extractUserIdsFromTweets = (tweets) => {
  if (!tweets) return []
  return tweets.map((tweet) => tweet.author_id)
}
