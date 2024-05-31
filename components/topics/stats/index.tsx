"use client"

import { generateStatsObjectForTopic } from "@/lib/helpers"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardStatProp {
  title: string
  value: number
}
const CardStat = ({ title, value }: CardStatProp) => {
  return (
    <Card className="w-32">
      <CardHeader className="flex flex-col items-center justify-center p-6">
        <CardDescription className="text-3xl font-bold text-black dark:text-white">
          {value}
        </CardDescription>

        <CardTitle className="text-center text-xs text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

interface CastStatProps {
  statsObject: any
}

const TopicStats = ({ statsObject }: CastStatProps) => {
  const generatedStats: any = generateStatsObjectForTopic(statsObject, 0)

  return (
    <div className="flex flex-row gap-4 pl-8 sm:flex sm:flex-wrap md:pl-0	 xl:flex xl:flex-row xl:flex-nowrap">
      {generatedStats && Object.keys(generatedStats).length
        ? Object.keys(generatedStats).map((stat: string) => (
            <CardStat
              title={generatedStats[stat].label}
              value={generatedStats[stat].value}
              key={stat}
            />
          ))
        : null}
    </div>
  )
}

export default TopicStats
