"use client"

import { useState } from "react"

import FollowerFilter from "@/components/team/filters/Follower"
import FollowingFilter from "@/components/team/filters/Following"
import PriorityBadgeFilter from "@/components/team/filters/PriorityBadge"

type teamFilterProps = {
  disabled: boolean
  onChange: (val: boolean) => void
  checked: boolean
}

interface TeamFiltersProps {
  followingFilterProps: teamFilterProps
  followerFilterProps: teamFilterProps
  priorityBadgeFilterProps: teamFilterProps
}
const TeamFilters = ({
  followerFilterProps,
  followingFilterProps,
  priorityBadgeFilterProps,
}: TeamFiltersProps) => {
  const [displayFilters, setDisplayFilters] = useState(false)

  const handleFilterClick = (e) => {
    e.preventDefault()
    setDisplayFilters(!displayFilters)
  }
  return (
    <div className="flex flex-col items-start">
      <div className="flex  flex-wrap gap-2">
        <FollowerFilter {...followerFilterProps} />
        <FollowingFilter {...followingFilterProps} />
        <PriorityBadgeFilter {...priorityBadgeFilterProps} />
      </div>
    </div>
  )
}

export default TeamFilters
