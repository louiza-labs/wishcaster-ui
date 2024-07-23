export const createTweetsSlice = (set: any) => ({
  tweets: [],
  setTweets: (tweetsRes: any[]) => set(() => ({ tweets: tweetsRes })),
})
