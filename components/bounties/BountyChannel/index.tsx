"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import useFetchChannels from "@/hooks/farcaster/useFetchChannels"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface BountyChannelSelectProps {
  value: any
  handleChange: any
}

export function BountyChannelSelect({
  value,
  handleChange,
}: BountyChannelSelectProps) {
  const [open, setOpen] = useState(false)
  const [channelSearchTerm, setChannelSearchTerm] = useState("")
  const [isDebouncing, setIsDebouncing] = useState(false)
  const {
    channels = [],
    gettingChannels,
    errorGettingChannels,
    fetchAndSetChannels,
  } = useFetchChannels(channelSearchTerm) // Default channels to an empty array

  const handleSubmitChannelSearch = async () => {
    const response = await fetchAndSetChannels(channelSearchTerm)
  }

  const handleChannelSearchTermChange = (value: string) => {
    setChannelSearchTerm(value)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Label>Search for a channel</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? channels.find((channel: any) => channel.id === value)?.name
              : "Select channel..."}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="PopoverContent w-full ">
          <Command className="w-full">
            <div className="flex w-full flex-row justify-between">
              {" "}
              <CommandInput
                placeholder="Search Channels..."
                value={channelSearchTerm}
                className=" w-full min-w-full"
                onValueChange={(value: string) =>
                  handleChannelSearchTermChange(value)
                }
              />
              <Button onClick={handleSubmitChannelSearch} variant={"ghost"}>
                Search
              </Button>
            </div>

            <CommandGroup>
              <CommandList className="w-full">
                {channels.map((channel) => (
                  <CommandItem
                    key={channel.id}
                    className="w-full"
                    value={channel.id}
                    onSelect={() => {
                      handleChange(channel.id === value ? "" : channel.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === channel.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {channel.name}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
