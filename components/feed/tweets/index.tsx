import Tweet from "@/components/tweet/variants/row"

const TweetsFeed = ({ tweets, notionResults }: any) => {
  return (
    <div className="flex flex-col gap-y-2">
      {tweets.map((tweet: any) => (
        <Tweet
          text={tweet.text}
          likes={tweet.public_metrics.like_count}
          replies={tweet.public_metrics.reply_count}
          retweets={tweet.public_metrics.retweet_count}
          username={tweet.username}
          user={tweet.user}
          category={tweet.category}
          tweet={tweet}
          notionResults={notionResults}
        />
      ))}
    </div>
  )
}

export default TweetsFeed
