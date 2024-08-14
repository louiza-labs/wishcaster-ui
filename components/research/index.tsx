"use client"

import { sortCastsByProperty } from "@/lib/helpers"
import { prepareVisualizationData } from "@/lib/helpers/scoring"
import useValidate from "@/hooks/validate/useValidate"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ValidateAudience from "@/components/research/audience"
import Demand from "@/components/research/demand"
import BenchmarkChart from "@/components/research/demand/benchmarks"
import ProblemsFeed from "@/components/research/problems"
import EngagementStats from "@/components/research/tabs/engagement"
import UsersFeed from "@/components/research/tabs/users"

interface ResearchProps {
  tweetsAndCasts: any
  problems: any
  tweetsAndCastsForSimilarIdeas: any
  currentIdea: string
}

const Research = ({
  tweetsAndCasts,
  problems,
  tweetsAndCastsForSimilarIdeas,
  currentIdea,
}: ResearchProps) => {
  const { rawStatsMetricsForPosts, rawStatsbyUsers } =
    useValidate(tweetsAndCasts)
  const sortedPosts = sortCastsByProperty(tweetsAndCasts, "likes_count")
  const tweetsAndCastsForCurrentIdeaWithIdeaAdded = tweetsAndCasts.map(
    (posts: any) => {
      return {
        ...posts,
        idea: currentIdea,
      }
    }
  )

  // Combine the posts into a single array
  const allPosts = [
    ...tweetsAndCastsForCurrentIdeaWithIdeaAdded,
    ...tweetsAndCastsForSimilarIdeas,
  ]

  // Prepare visualization data using the combined posts
  const { userDemandScore, benchmarkData } = prepareVisualizationData(
    allPosts,
    currentIdea
  )

  return (
    <div className="my-4 grid w-full grid-cols-12  gap-y-10 ">
      <section className="col-span-12 my-2 mb-10 flex w-full flex-row items-center justify-between">
        <div className=" flex w-6/12 flex-col items-start justify-start gap-y-2 md:mt-4 md:flex-col">
          <div className=" flex w-full flex-row gap-x-2 px-6 md:mb-0 md:flex-col md:gap-x-0 md:gap-y-2 md:px-0">
            <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
              {currentIdea}
            </h1>
          </div>
          <p className="text-2xl font-light">
            Some summary about this idea - la dee da
          </p>
        </div>

        <Demand
          tweetsAndCastsForCurrentIdea={tweetsAndCasts}
          tweetsAndCastsForSimilarIdeas={tweetsAndCastsForSimilarIdeas}
          currentIdea={currentIdea}
        />
        <EngagementStats rawStats={rawStatsMetricsForPosts} />
      </section>

      <section className="col-span-12 grid grid-cols-12 gap-x-6 md:flex-1">
        <div className="col-span-8 flex w-full flex-col gap-y-6">
          <ValidateAudience posts={tweetsAndCasts} />
          <div className="rounded-lg border-2 border-blue-300  px-4  shadow-xl sm:p-4 ">
            <p className="text-center text-xl font-bold">
              Where is this coming from?
            </p>

            <Tabs
              defaultValue="posts"
              className="mt-4 flex h-fit items-center justify-start  md:items-start  lg:flex-col lg:gap-x-20"
            >
              <TabsList className="flex w-full flex-row  items-center justify-center  gap-y-6 bg-transparent  text-lg font-semibold  sm:h-full">
                {/* <TabsTrigger value="count">Count</TabsTrigger> */}
                {/* <TabsTrigger className="  text-left" value="info">
            Info
          </TabsTrigger> */}
                <TabsTrigger
                  className="flex flex-row items-center gap-x-2 text-left"
                  value="posts"
                >
                  Top Posts
                </TabsTrigger>

                <TabsTrigger
                  disabled={false}
                  className="flex flex-row items-center gap-x-2 text-left"
                  value="users"
                >
                  Top Users
                </TabsTrigger>
              </TabsList>
              <TabsContent className=" h-fit   " value="posts">
                <UsersFeed usersStats={rawStatsbyUsers} />
              </TabsContent>
              <TabsContent className=" h-fit   " value="users">
                <UsersFeed usersStats={rawStatsbyUsers} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4 rounded-xl border-2 border-blue-200 p-4 shadow-lg">
            <p className="text-xl  font-bold">
              How does this compare to other ideas?
            </p>

            <BenchmarkChart benchmarkData={benchmarkData} />
          </div>

          <ProblemsFeed problemsData={problems} />
        </div>

        {/* <LineComboChart /> */}
      </section>
    </div>
  )
}

export default Research
