"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useFormContext } from "@/contexts/company"
import { ChevronRight, Loader2, Rocket } from "lucide-react"

import useCompleteOnboarding from "@/hooks/company/onboarding/complete"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import CompanyProfileStep from "@/components/company/onboarding/account"
import ResultsStep from "@/components/company/onboarding/results"

export default function OnboardingFlow() {
  const { formState, setField } = useFormContext()

  const [step, setStep] = useState(1)
  const router = useRouter()

  const nextStep = useCallback(() => {
    if (step === 5) router.push("/")
    else setStep((prev) => Math.min(prev + 1, 5))
  }, [step, router])

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const {
    handleCompleteOnboarding,
    submittingForm,
    successfullySubmittingForm,
    errorSubmittingForm,
  } = useCompleteOnboarding({ nextStep })

  const isNextButtonDisabled = useMemo(() => {
    if (step === 5 || submittingForm) return true
    if (
      step === 1 &&
      (!formState.companyName || !formState.industry || !formState.goal)
    )
      return true

    if (
      step === 3 &&
      (!formState.companyName ||
        !formState.industry ||
        !formState.goal ||
        !formState.keywords.length)
    )
      return true
    return false
  }, [step, formState, submittingForm])

  const renderStep = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <CompanyProfileStep formData={formState} updateFormData={setField} />
        )
      case 2:
        return (
          <ResultsStep
            isOpen={errorSubmittingForm || successfullySubmittingForm}
            isSuccess={successfullySubmittingForm}
          />
        )
      default:
        return null
    }
  }, [
    step,
    formState,
    setField,
    errorSubmittingForm,
    successfullySubmittingForm,
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        {renderStep}
        <CardFooter className="flex justify-between">
          {step < 2 && (
            <Button
              onClick={step === 1 ? handleCompleteOnboarding : nextStep}
              disabled={isNextButtonDisabled}
              className="w-full"
            >
              {submittingForm ? (
                <>
                  Submitting <Loader2 className="ml-2 size-4 animate-spin" />
                </>
              ) : (
                <>
                  {step === 1 ? "Finish" : "Revise"}{" "}
                  {step === 1 ? (
                    <Rocket className="ml-2 size-4" />
                  ) : (
                    <ChevronRight className="ml-2 size-4" />
                  )}
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
