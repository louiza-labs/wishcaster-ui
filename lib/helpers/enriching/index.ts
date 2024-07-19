export const addUserInfoToTweets = (tweets, users) => {
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
      user: usersObj[tweet.author_id] ?? {},
    }
  })
}
