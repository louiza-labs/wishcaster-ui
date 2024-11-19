"use client"

import React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompanyProfileStepProps {
  formData: {
    companyName: string
    industry: string
    goal: string // This will now store the selected goal
    keywords: string[]
  }
  updateFormData: (field: string | any, value: any) => void
}

const CompanyProfileStep: React.FC<CompanyProfileStepProps> = ({
  formData,
  updateFormData,
}) => {
  const [currentKeyword, setCurrentKeyword] = React.useState("")

  const handleAddKeyword = () => {
    if (currentKeyword && !formData.keywords.includes(currentKeyword)) {
      updateFormData("keywords", [...formData.keywords, currentKeyword])
      setCurrentKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    updateFormData(
      "keywords",
      formData.keywords.filter((k) => k !== keyword)
    )
  }

  const goals = [
    "Find new customers",
    "Find new roadmap items",
    "Validate roadmap items",
  ]

  const handleGoalSelection = (goal: string) => {
    updateFormData("goal", goal)
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Company Profile
        </CardTitle>
        <CardDescription className="text-center">
          Tell us about your company to help us tailor your experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => updateFormData("companyName", e.target.value)}
            placeholder="Enter your company name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => updateFormData("industry", e.target.value)}
            placeholder="E.g., Technology, Healthcare, Finance"
          />
        </div>
        <div className="space-y-2">
          <Label>Company Goal</Label>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal) => (
              <Badge
                key={goal}
                className={`cursor-pointer text-black hover:text-white ${
                  formData.goal === goal
                    ? "bg-primary text-white"
                    : "bg-secondary"
                }`}
                onClick={() => handleGoalSelection(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <div className="flex space-x-2">
            <Input
              id="keywords"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              placeholder="Enter keywords to filter your results"
            />
            <Button onClick={handleAddKeyword} type="button">
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.keywords.map((keyword) => (
              <Badge
                key={keyword}
                className="flex items-center space-x-1 px-2 py-1"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-1 focus:outline-none"
                  aria-label={`Remove keyword ${keyword}`}
                >
                  <X className="size-4" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </>
  )
}

export default CompanyProfileStep
