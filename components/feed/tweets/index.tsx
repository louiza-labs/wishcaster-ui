import Tweet from "@/components/tweet"

const TweetsFeed = ({ tweets }) => {
  return (
    <div className="flex flex-col gap-y-2">
      {tweets.map((tweet) => (
        <Tweet
          text={tweet.text}
          likes={tweet.public_metrics.like_count}
          replies={tweet.public_metrics.reply_count}
          retweets={tweet.public_metrics.retweets}
          username={tweet.username}
          user={tweet.user}
          category={tweet.category}
        />
      ))}
    </div>
  )
}

export default TweetsFeed
