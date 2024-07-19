import Tweet from "@/components/tweet/variants/row"

const TweetsFeed = ({ tweets }) => {
  return (
    <div className="flex flex-col gap-y-2">
      {tweets.map((tweet) => (
        <Tweet
          text={tweet.text}
          likes={tweet.public_metrics.like_count}
          replies={tweet.public_metrics.reply_count}
          retweets={tweet.public_metrics.retweet_count}
          username={tweet.username}
          user={tweet.user}
          category={tweet.category}
          tweet={tweet}
        />
      ))}
    </div>
  )
}

export default TweetsFeed
