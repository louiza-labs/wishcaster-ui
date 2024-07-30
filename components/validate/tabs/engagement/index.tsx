"use client"

import React from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EngagementStatsProps {
  rawStats: any
}
const Engagement = ({ rawStats }: EngagementStatsProps) => {
  const CardStat: React.FC<any> = ({ title, value }) => {
    return (
      <Card className="w-50 flex snap-start flex-col items-center md:w-32">
        {/* <Badge
          variant={"secondary"}
          className="m-2 mb-0 flex flex-row items-center justify-center gap-x-1"
        >
        </Badge> */}
        <CardHeader className="flex w-full flex-col items-center justify-center p-4">
          <CardDescription className="text-3xl font-bold text-black dark:text-white">
            {value.toLocaleString()}
          </CardDescription>
          <CardTitle className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            {title}
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }
  return (
    <div className="container mx-auto px-4">
      {/* <Header title={ideaTitle} subtitle={ideaSubtitle} /> */}
      <div className="flex flex-wrap gap-4">
        {Object.keys(rawStats).map((stat) => (
          <CardStat title={stat} value={rawStats[stat]} key={stat} />
        ))}
      </div>
    </div>
  )
}

export default Engagement
