"use client"

import React, { useCallback } from "react"
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

interface FormState {
  name: string
  email: string
  username: string
  password: string
  connectedNetworks: string[]
  fileUploaded: boolean
  jobRoles: string[]
  companies: string[]
  csvData: any[] // Add this to store parsed CSV data
}
interface PreferencesProps {
  formData: {
    jobRoles: string[]
    companies: string[]
  }
  addCompany: (company: string) => void
  addJobRole: (role: string) => void
  setCurrentCompany: (value: string) => void
  setCurrentRole: (value: string) => void
  currentCompany: string
  currentRole: string
  addToList: (field: keyof FormState, value: string) => void
  removeCompany: (company: string) => void
  removeJobRole: (role: string) => void
}

const presetJobRoles = [
  "Software Engineer",
  "Product Manager",
  "Operations Manager",
  "Data Scientist",
  "Quantitative Trader",
  "UX Designer",
]
const presetCompanies = [
  "Google",
  "Coinbase",
  "Blackrock",
  "Amazon",
  "Apple",
  "Microsoft",
]

const Preferences: React.FC<PreferencesProps> = ({
  formData,
  addCompany,
  addJobRole,
  setCurrentCompany,
  setCurrentRole,
  currentCompany,
  currentRole,
  removeCompany,
  removeJobRole,
  addToList,
}) => {
  // Helper to check if an array includes a value (case-insensitive)
  const includesIgnoreCase = useCallback((array: string[], value: string) => {
    return array.some((item) => item.toLowerCase() === value.toLowerCase())
  }, [])

  const handleAddJobRole = useCallback(() => {
    if (
      currentRole &&
      !includesIgnoreCase(formData.jobRoles, currentRole.trim())
    ) {
      addJobRole(currentRole.trim())
      setCurrentRole("")
    }
  }, [
    currentRole,
    formData.jobRoles,
    addJobRole,
    setCurrentRole,
    includesIgnoreCase,
  ])

  const handleAddPresetJobRole = useCallback(
    (job: string) => {
      if (job && !includesIgnoreCase(formData.jobRoles, job.trim())) {
        addToList("jobRoles", job)
      }
    },
    [addToList, includesIgnoreCase, formData.jobRoles]
  )

  const handleAddCompany = useCallback(() => {
    if (
      currentCompany &&
      !includesIgnoreCase(formData.companies, currentCompany.trim())
    ) {
      addCompany(currentCompany.trim())
      setCurrentCompany("")
    }
  }, [
    currentCompany,
    formData.companies,
    addCompany,
    setCurrentCompany,
    includesIgnoreCase,
  ])
  const handleAddPresetCompany = useCallback(
    (company: string) => {
      if (company && !includesIgnoreCase(formData.companies, company.trim())) {
        addToList("companies", company)
      }
    },
    [addToList, includesIgnoreCase, formData.companies]
  )

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Your Job Preferences
        </CardTitle>
        <CardDescription className="text-center">
          Add in some job roles and companies you&apos;re interested in.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Job Roles Input */}
        <div>
          <Label htmlFor="job-role">Desired Job Roles</Label>
          <div className="my-4 flex flex-wrap gap-2">
            {presetJobRoles.map((role) => (
              <Button
                key={role}
                variant={
                  includesIgnoreCase(formData.jobRoles, role)
                    ? "default"
                    : "outline"
                }
                onClick={() => handleAddPresetJobRole(role)}
                className="px-2  text-xs"
                disabled={includesIgnoreCase(formData.jobRoles, role)}
              >
                {role}
              </Button>
            ))}
          </div>
          <div className="mt-1.5 flex">
            <Input
              id="job-role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="E.g., Software Engineer, Product Manager"
            />
            <Button onClick={handleAddJobRole} className="ml-2" type="button">
              Add
            </Button>
          </div>

          {/* Job Roles Badges */}
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.jobRoles.map((role) => (
              <Badge
                key={role}
                className="flex items-center space-x-1 px-2 py-1"
              >
                {role}
                <button
                  onClick={() => removeJobRole(role)}
                  className="ml-1 focus:outline-none"
                  aria-label={`Remove job role ${role}`}
                >
                  <X className="size-4" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Companies Input */}
        <div>
          <Label htmlFor="company">Target Companies</Label>
          <div className="my-4 flex flex-wrap gap-2">
            {presetCompanies.map((company) => (
              <Button
                key={company}
                variant={
                  includesIgnoreCase(formData.companies, company)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => handleAddPresetCompany(company)}
                className="text-sm"
                disabled={includesIgnoreCase(formData.companies, company)}
              >
                {company}
              </Button>
            ))}
          </div>
          <div className="mt-1.5 flex">
            <Input
              id="company"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              placeholder="E.g., Google, Amazon, Startup"
            />
            <Button onClick={handleAddCompany} className="ml-2" type="button">
              Add
            </Button>
          </div>

          {/* Companies Badges */}
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.companies.map((company) => (
              <Badge
                key={company}
                className="flex items-center space-x-1 px-2 py-1"
              >
                {company}
                <button
                  onClick={() => removeCompany(company)}
                  className="ml-1 focus:outline-none"
                  aria-label={`Remove company ${company}`}
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

export default Preferences
