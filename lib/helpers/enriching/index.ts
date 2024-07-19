export const addUserInfoToTweets = (tweets, users) => {
  console.log("the tweets in adduser info", tweets)
  console.log("the users in adduser info", users)

  if (!(tweets && tweets.length && users && users.length)) return tweets

  const usersObj = users.reduce((userObject, currentUser) => {
    const user_id = currentUser.id
    userObject[user_id] = currentUser
    return userObject
  }, {})

  return tweets.map((tweet) => {
    return {
      ...tweet,
      type: "tweet",
      hash: tweet.id,
      user: usersObj[tweet.author_id] ?? {},
    }
  })
}
