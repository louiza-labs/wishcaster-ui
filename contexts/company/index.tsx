"use client"

import { ReactNode, createContext, useContext } from "react"

import { useFormReducer } from "@/hooks/company/onboarding/useOnboarding"

interface FormState {
  companyName: string
  industry: string
  goal: string
  keywords: string[]
}

interface FormContextType {
  formState: FormState
  setField: (field: keyof FormState, value: any) => void
  addToList: (field: keyof FormState, value: string) => void
  removeFromList: (field: keyof FormState, value: string) => void
}

const FormContext = createContext<FormContextType | null>(null)
interface FormProviderProps {
  children: ReactNode
}
export function FormProvider({ children }: FormProviderProps) {
  const form = useFormReducer()
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}
