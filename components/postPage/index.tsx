/**
 * v0 by Vercel.
 * @see https://v0.dev/t/iv1iyigkYlE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Link from "next/link"

import { renderTextWithLinks } from "@/lib/helpers"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Bounty from "@/components/bounties"
import Build from "@/components/buildComponent"
import Post from "@/components/post"
import RenderContent from "@/components/post/content"
import TopReplies from "@/components/replies/TopReplies"
import SaveCast from "@/components/save"

interface PostPageProps {
  source: string
  post: any
  reactionsObject: any
  notionResults: any
  conversation: any
  generatedSummary: any
}
const PostPage = ({
  source,
  post,
  notionResults,
  reactionsObject,
  generatedSummary,
  conversation,
}: PostPageProps) => {
  const castsWithBountyBotText = conversation.filter((cast: any) =>
    cast.text.includes("@bountybot")
  )
  return (
    <div className="flex min-h-screen w-full flex-col items-center  bg-background">
      <header className="flex w-full max-w-5xl flex-col items-center justify-between px-4 py-0 md:px-6 lg:flex-row lg:py-6">
        <div className="flex items-center gap-2">
          <Avatar className="flex size-6 flex-col items-center rounded-full border shadow-sm  lg:size-8">
            <AvatarImage
              src={
                post.platform === "farcaster"
                  ? "/social-account-logos/farcaster-purple-white.png"
                  : "/social-account-logos/twitter-logo-black.png"
              }
              alt={post.platform}
              className="rounded-full"
            />
          </Avatar>{" "}
          <h1 className="text-lg font-bold lg:text-2xl">
            {source === "farcaster" ? "Cast" : "Tweet"}
          </h1>
        </div>
        <div className="hidden lg:block">
          <SaveCast notionResults={notionResults} cast={post} />
        </div>
      </header>
      <main className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 gap-y-12 px-4 py-8 md:px-6">
        <div className="grid w-full grid-cols-1 gap-6 lg:flex lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-4 lg:w-2/3">
            <RenderContent
              text={post.text}
              tagline={post.tagline}
              embeds={post.embeds}
              media={post.mediaUrls}
              referencedPost={post.referencedPost}
              source={post.platform}
              // hash={post.id}
              author={post.author}
              mentionedProfiles={post.mentionedProfiles}
              renderEmbeds={true}
            />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Avatar className="size-8 border">
                  <AvatarImage
                    src={post.author.profileImageUrl}
                    alt={post.author.username}
                  />{" "}
                  <AvatarFallback>{post.author.username}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href="#" className="font-medium" prefetch={false}>
                    {post.author.displayName}{" "}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    @{post.author.username}
                  </p>
                </div>
              </div>
              <p>
                {renderTextWithLinks(
                  post.text,
                  post.mentionedProfiles,
                  post.embeds,
                  post.platform === "twitter"
                )}
              </p>
            </div>
            <div className="mt-4">
              <TopReplies
                castHash={post.id ?? ""}
                notionResults={notionResults}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:w-1/3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartIcon className="size-4 text-muted-foreground" />
                  <p className="text-xs font-medium">{post.likesCount} likes</p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircleIcon className="size-4 text-muted-foreground" />
                  <p className="text-xs font-medium">
                    {post.commentsCount} comments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Share2Icon className="size-4 text-muted-foreground" />
                  <p className="text-xs font-medium">
                    {post.sharesCount} shares
                  </p>
                </div>
              </div>
            </Card>
            {generatedSummary.summary && generatedSummary.summary.length ? (
              <Card className="p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">
                    AI Summary <span className="ml-1">✨</span>
                  </h3>
                  <p className="text-sm">{generatedSummary.summary}</p>
                </div>
              </Card>
            ) : null}
            <div className=" lg:hidden">
              <SaveCast notionResults={notionResults} cast={post} />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-y-4 lg:flex-row lg:items-start lg:gap-x-10 lg:gap-y-0">
          {source === "farcaster" ? (
            <div className="flex flex-col items-center lg:w-1/2">
              <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
                Find Users
              </h1>
              <Build
                cast={post}
                hash={post ? post.id ?? "" : ""}
                reactions={reactionsObject}
                hideBounties={true}
              />
            </div>
          ) : null}
          <div className="mt-6 flex flex-col items-start space-y-4 lg:mt-0 lg:w-1/2">
            <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
              Post Bounty
            </h1>{" "}
            {!(castsWithBountyBotText && castsWithBountyBotText.length) ? (
              <Bounty hash={post.id} />
            ) : (
              <Tabs
                defaultValue="post-bounty"
                className="mt-4 flex h-fit w-full min-w-full flex-col items-center gap-y-2  px-4 sm:px-0 md:w-fit md:items-start"
              >
                <TabsList className="flex w-full min-w-full flex-row justify-between sm:my-2 sm:h-full sm:flex-wrap lg:flex-row lg:flex-nowrap xl:flex-nowrap">
                  {castsWithBountyBotText && castsWithBountyBotText.length ? (
                    <TabsTrigger
                      disabled={false}
                      className="w-full"
                      value="existing-bounties"
                    >
                      Open bounties
                    </TabsTrigger>
                  ) : null}
                  <TabsTrigger
                    disabled={false}
                    className="w-full"
                    value="post-bounty"
                  >
                    Post a bounty
                  </TabsTrigger>
                </TabsList>
                {castsWithBountyBotText && castsWithBountyBotText.length ? (
                  <TabsContent
                    className=" h-fit  w-full min-w-full"
                    value="existing-bounties"
                  >
                    {castsWithBountyBotText && castsWithBountyBotText.length ? (
                      <div className="grid grid-cols-1 gap-4 overflow-x-hidden">
                        {castsWithBountyBotText.map((postWithBounty: any) => (
                          <Post
                            {...postWithBounty}
                            hideMetrics={false}
                            badgeIsToggled={false}
                            key={postWithBounty.id}
                            post={postWithBounty}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="">No bounties found</p>
                    )}
                  </TabsContent>
                ) : null}
                <TabsContent className=" w-full min-w-full" value="post-bounty">
                  <Bounty hash={post.id} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function EyeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function MessageCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

function Share2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  )
}

function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}

export default PostPage
