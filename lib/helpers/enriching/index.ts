export const addUserInfoToTweets = (tweets: any, users: any) => {
  if (!(tweets && tweets.length && users && users.length)) return tweets

  const usersObj = users.reduce((userObject: any, currentUser: any) => {
    const user_id = currentUser.id
    userObject[user_id] = currentUser
    return userObject
  }, {})

  return tweets.map((tweet: any) => {
    return {
      ...tweet,
      type: "tweet",
      hash: tweet.id,
      user: usersObj[tweet.author_id] ?? {},
    }
  })
}
