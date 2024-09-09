"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Comprehensive list of industries
const industries = [
  { value: "hardware", label: "Hardware" },
  { value: "ai_machine_learning", label: "AI & Machine Learning" },
  { value: "blockchain", label: "Blockchain" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cloud_computing", label: "Cloud Computing" },
  { value: "iot", label: "Internet of Things (IoT)" },
  { value: "ar_vr", label: "AR/VR" },
  { value: "finance", label: "Finance" },
  { value: "banking", label: "Banking" },
  { value: "cryptocurrency", label: "Cryptocurrency" },
  { value: "insurance", label: "Insurance" },
  { value: "investment", label: "Investment" },
  { value: "fintech", label: "FinTech" },
  { value: "accounting", label: "Accounting" },
  { value: "healthcare", label: "Healthcare" },
  { value: "pharmaceuticals", label: "Pharmaceuticals" },
  { value: "biotechnology", label: "Biotechnology" },
  { value: "telemedicine", label: "Telemedicine" },
  { value: "medical_devices", label: "Medical Devices" },
  { value: "healthcare_it", label: "Healthcare IT" },
  { value: "retail", label: "Retail" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "brick_mortar", label: "Brick-and-Mortar" },
  { value: "consumer_goods", label: "Consumer Goods" },
  { value: "fashion_apparel", label: "Fashion & Apparel" },
  { value: "luxury_goods", label: "Luxury Goods" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "automotive", label: "Automotive" },
  { value: "electronics", label: "Electronics" },
  { value: "textiles", label: "Textiles" },
  { value: "machinery", label: "Machinery" },
  { value: "chemicals", label: "Chemicals" },
  { value: "energy", label: "Energy" },
  { value: "oil_gas", label: "Oil & Gas" },
  { value: "renewable_energy", label: "Renewable Energy" },
  { value: "utilities", label: "Utilities" },
  { value: "nuclear_energy", label: "Nuclear Energy" },
  { value: "mining", label: "Mining" },
  { value: "education", label: "Education" },
  { value: "k12", label: "K-12" },
  { value: "higher_education", label: "Higher Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "film_tv", label: "Film & Television" },
  { value: "music", label: "Music" },
  { value: "video_games", label: "Video Games" },
  { value: "publishing", label: "Publishing" },
  { value: "sports_recreation", label: "Sports & Recreation" },
  { value: "hospitality", label: "Hospitality" },
  { value: "hotels_resorts", label: "Hotels & Resorts" },
  { value: "restaurants", label: "Restaurants" },
  { value: "travel_tourism", label: "Travel & Tourism" },
  { value: "event_planning", label: "Event Planning" },
  { value: "real_estate", label: "Real Estate" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "property_management", label: "Property Management" },
  { value: "real_estate_investment", label: "Real Estate Investment" },
  { value: "logistics", label: "Logistics" },
  { value: "transportation", label: "Transportation" },
  { value: "supply_chain_management", label: "Supply Chain Management" },
  { value: "freight_shipping", label: "Freight & Shipping" },
  { value: "warehousing", label: "Warehousing" },
  { value: "agriculture", label: "Agriculture" },
  { value: "farming", label: "Farming" },
  { value: "food_production", label: "Food Production" },
  { value: "agritech", label: "Agritech" },
  { value: "forestry", label: "Forestry" },
  { value: "fisheries", label: "Fisheries" },
  { value: "government", label: "Government" },
  { value: "defense", label: "Defense" },
  { value: "international_relations", label: "International Relations" },
  { value: "public_health", label: "Public Health" },
  { value: "non_profit", label: "Non-Profit" },
  { value: "charities", label: "Charities" },
  { value: "foundations", label: "Foundations" },
]

interface IndustrySelectionMenu {
  handleChange: any
  value: any
}

export default function IndustrySelectionMenu({
  handleChange,
  value,
}: IndustrySelectionMenu) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? industries.find((industry) => industry.value === value)?.label
            : "Select industry..."}
          <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search industry..." className="h-9" />
          <CommandList>
            <CommandEmpty>No industry found.</CommandEmpty>
            <CommandGroup>
              {industries.map((industry) => (
                <CommandItem
                  key={industry.value}
                  value={industry.value}
                  onSelect={(currentValue) => {
                    handleChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {industry.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto size-4",
                      value === industry.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
