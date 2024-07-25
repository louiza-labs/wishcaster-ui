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

export const addMediaToTweets = (tweets: any, includesObject: any) => {
  if (!includesObject || !(includesObject && includesObject.media)) {
    return tweets.map((tweet: any) => {
      return {
        ...tweet,
        media: [],
      }
    })
  } else {
    let mediaArray = includesObject.media
    const mediaAsObject = mediaArray.reduce(
      (mediaObject: any, currMedia: any) => {
        const mediaKey = currMedia.media_key
        if (!mediaObject[mediaKey]) {
          mediaObject[mediaKey] = currMedia
        }
        return mediaObject
      },
      {}
    )

    const tweetsWithMediaAdded = tweets.map((tweet: any) => {
      let mediaForTweet: any[] = []
      let tweetHasVideos = false
      const attachmentsForTweet = tweet.attachments
      if (attachmentsForTweet) {
        const mediaKeysForTweet = attachmentsForTweet.media_keys
        if (mediaKeysForTweet && mediaKeysForTweet.length) {
          mediaKeysForTweet.forEach((mediaKey: string) => {
            const mediaFromObject = mediaAsObject[mediaKey]

            if (mediaFromObject) {
              if (mediaFromObject.type && mediaFromObject.type === "video") {
                tweetHasVideos = true
              }
              mediaForTweet.push(mediaFromObject)
            }
          })
        }
      }
      return {
        ...tweet,
        media: mediaForTweet,
        hasVideo: tweetHasVideos,
      }
    })
    return tweetsWithMediaAdded
  }
}
