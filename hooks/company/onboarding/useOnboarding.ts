"use client"

import { useReducer } from "react"

interface FormState {
  companyName: string
  industry: string
  goal: string
  keywords: string[]
}

// Define Action types
type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: any }
  | { type: "ADD_TO_LIST"; field: keyof FormState; value: string }
  | { type: "REMOVE_FROM_LIST"; field: keyof FormState; value: string }
  | { type: "SET_CSV_DATA"; field: keyof FormState; value: any[] }

// Type-safe reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }

    case "ADD_TO_LIST":
      return {
        ...state,
        [action.field]: [...(state[action.field] as string[]), action.value],
      }

    case "REMOVE_FROM_LIST":
      return {
        ...state,
        [action.field]: (state[action.field] as string[]).filter(
          (item) => item !== action.value
        ),
      }

    default:
      return state
  }
}

export function useFormReducer() {
  const initialFormState: FormState = {
    companyName: "",
    industry: "",
    goal: "",
    keywords: [],
  }

  const [formState, dispatch] = useReducer(formReducer, initialFormState)

  const setField = (field: keyof FormState, value: any) => {
    dispatch({ type: "SET_FIELD", field, value })
  }

  const addToList = (field: keyof FormState, value: string) => {
    dispatch({ type: "ADD_TO_LIST", field, value })
  }

  const removeFromList = (field: keyof FormState, value: string) => {
    dispatch({ type: "REMOVE_FROM_LIST", field, value })
  }
  const setCSVData = (field: keyof FormState, value: any[]) => {
    dispatch({ type: "SET_CSV_DATA", field, value })
  }

  return {
    formState,
    setField,
    addToList,
    setCSVData,
    removeFromList,
  }
}
