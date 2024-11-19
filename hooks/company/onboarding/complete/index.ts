"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormContext } from "@/contexts/company"

import { createCompany } from "@/app/actions/company"

interface FormState {
  companyName: string
  keywords: string[]
  goal: string
  industry: string
}
export function validateFormState(formState: FormState): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check for empty required fields
  if (!formState.companyName.trim()) {
    errors.push("Name is required.")
  }
  if (!formState.keywords.length) {
    errors.push("Keywords are required.")
  }
  if (!formState.goal.trim()) {
    errors.push("Goal is required.")
  }
  if (!formState.industry.trim()) {
    errors.push("Industry is required.")
  }
  // Check overall validity
  const isValid = errors.length === 0

  return { isValid, errors }
}

const useCompleteOnboarding = ({ nextStep }: { nextStep: () => void }) => {
  const { formState, addToList, removeFromList } = useFormContext()
  const router = useRouter()
  const [submittingForm, setSubmittingForm] = useState(false)
  const [successfullySubmittingForm, setSuccessfullySubmittingForm] =
    useState(false)
  const [errorSubmittingForm, setErrorSubmittingForm] = useState(false)
  const { userId } = { userId: "0x1295e0b82955ae01408f8ad8aa1a0b313c3da759" }

  const handleCompleteOnboarding = async () => {
    // if conditions are met
    try {
      setSubmittingForm(true)
      setSuccessfullySubmittingForm(false)
      setErrorSubmittingForm(false)

      const { isValid, errors } = validateFormState(formState)
      if (!isValid) {
        setSubmittingForm(false)
        setSuccessfullySubmittingForm(false)
        setErrorSubmittingForm(true)
        alert(JSON.stringify(errors))
        return
      }
      // first set up auth
      const signupObject = {
        companyName: formState.companyName,
        keywords: formState.keywords,
        companyIndustry: formState.industry,
        goal: formState.goal,
      }
      // alert(JSON.stringify(signupObject))

      const signupResult = await createCompany({
        userId: userId,
        companyInfo: signupObject,
      })
      console.log("signupResult", signupResult)
      setSubmittingForm(false)
      setSuccessfullySubmittingForm(true)
      setErrorSubmittingForm(false)
      nextStep()
      // then we send the data to the backend to be populated
      return signupResult
    } catch (e) {
      console.log("error", e)
      // nextStep()
      setSubmittingForm(false)
      setSuccessfullySubmittingForm(false)
      setErrorSubmittingForm(true)
    }
  }

  return {
    handleCompleteOnboarding,
    submittingForm,
    errorSubmittingForm,
    successfullySubmittingForm,
  }
}

export default useCompleteOnboarding
