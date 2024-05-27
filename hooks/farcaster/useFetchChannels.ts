"use client"

import { useState } from "react"

import { fetchChannelWithSearch } from "@/app/actions"

const useFetchChannels = (searchTerm: string) => {
  const [channels, setChannels] = useState<any>([])
  const [gettingChannels, setGettingChannels] = useState(false)
  const [errorGettingChannels, setErrorGettingChannels] = useState(false)

  const fetchAndSetChannels = async (searchVal: string) => {
    if (!searchVal || !(searchVal && searchVal.length)) return
    try {
      setErrorGettingChannels(false)
      const channelsResponse = await fetchChannelWithSearch(searchVal)
      setChannels(channelsResponse.channels)
    } catch (error) {
      setErrorGettingChannels(true)
      console.error("Error fetching channels:", error)
    } finally {
      setGettingChannels(false)
    }
  }

  return {
    channels,
    gettingChannels,
    errorGettingChannels,
    fetchAndSetChannels,
  }
}

export default useFetchChannels
