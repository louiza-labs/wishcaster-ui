import BenchmarkChart from "@/components/validate/demand/benchmarks"
import DemandGauge from "@/components/validate/demand/gauge"

import { prepareVisualizationData } from "../../../lib/helpers/scoring"

interface DemandProps {
  tweetsAndCastsForSimilarIdeas: any
  tweetsAndCastsForCurrentIdea: any
  currentIdea: string
}

const Demand = ({
  tweetsAndCastsForCurrentIdea,
  tweetsAndCastsForSimilarIdeas,
  currentIdea,
}: DemandProps) => {
  const tweetsAndCastsForCurrentIdeaWithIdeaAdded =
    tweetsAndCastsForCurrentIdea.map((posts: any) => {
      return {
        ...posts,
        idea: currentIdea,
      }
    })

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
    <div className="flex flex-col gap-y-4">
      <DemandGauge score={userDemandScore} />
      <BenchmarkChart benchmarkData={benchmarkData} />
    </div>
  )
}

export default Demand
