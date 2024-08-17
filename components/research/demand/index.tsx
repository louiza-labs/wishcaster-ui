import DemandGauge from "@/components/research/demand/gauge"

import { prepareVisualizationData } from "../../../lib/helpers/scoring"

interface DemandProps {
  tweetsAndCastsForSimilarIdeas: any
  tweetsAndCastsForCurrentIdea: any
  currentIdea: string
  showOnlyGauge?: boolean
  showOnlyRadial?: boolean
}

const Demand = ({
  tweetsAndCastsForCurrentIdea,
  tweetsAndCastsForSimilarIdeas,
  currentIdea,
  showOnlyGauge,
  showOnlyRadial,
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
    <div className="flex  flex-col items-center gap-y-2">
      <p className="text-xl  font-bold">What is the demand?</p>
      <DemandGauge score={userDemandScore} />
    </div>
  )
}

export default Demand
