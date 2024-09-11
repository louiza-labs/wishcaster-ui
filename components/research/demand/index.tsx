import { useMemo } from "react"

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
  // Memoize the idea-added map logic to prevent recalculating on each render
  const tweetsAndCastsForCurrentIdeaWithIdeaAdded = useMemo(() => {
    return tweetsAndCastsForCurrentIdea.map((posts: any) => ({
      ...posts,
      idea: currentIdea,
    }))
  }, [tweetsAndCastsForCurrentIdea, currentIdea])

  // Memoize the combination of posts
  const allPosts = useMemo(
    () => [
      ...tweetsAndCastsForCurrentIdeaWithIdeaAdded,
      ...tweetsAndCastsForSimilarIdeas,
    ],
    [tweetsAndCastsForCurrentIdeaWithIdeaAdded, tweetsAndCastsForSimilarIdeas]
  )

  // Memoize the visualization data preparation
  const { userDemandScore, benchmarkData } = useMemo(() => {
    return prepareVisualizationData(allPosts, currentIdea)
  }, [allPosts, currentIdea])

  return (
    <div className="flex flex-col items-center gap-y-2">
      <p className="text-xl font-bold">What is the demand?</p>
      <DemandGauge score={userDemandScore} />
    </div>
  )
}

export default Demand
