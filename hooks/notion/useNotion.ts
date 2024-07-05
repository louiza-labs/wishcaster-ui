"use client"

import { useEffect, useMemo, useState } from "react"

import { createNotionItem, getUsersNotionAccessCode } from "@/app/actions"
import { extractNotionTitle } from "@/lib/helpers"

const useNotion = (castHash: string, notionResults = <any>[]) => {
  ;[]
  const [providerToken, setProviderToken] = useState("")

  const wcLinkForCast = `https://www.warpcast.com/${castHash}`

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState(`Issue Description for...
  ${wcLinkForCast}
    `)
  const [notionPages, setNotionPages] = useState([])
  const [notionDBs, setNotionDBs] = useState([])
  const [parentPageId, setParentPageId] = useState("")
  const [parentDBId, setParentDBId] = useState("")
  const [priority, setPriority] = useState(0)
  const [isPageOrDB, setIsPageOrDB] = useState("page")
  const [submittingIssue, setSubmittingIssue] = useState(false)
  const [errorSubmittingIssue, setErrorSubmittingIssue] = useState(false)
  const [successfullySubmittedIssue, setSuccessfullySubmittedIssue] =
    useState(false)
  const [projectId, setProjectId] = useState("")

  useEffect(() => {
    const fetchAndSetProviderToken = async () => {
      const providerTokenFromDB = await getUsersNotionAccessCode()
      setProviderToken(providerTokenFromDB)
    }
    fetchAndSetProviderToken()
  }, [])

  useEffect(() => {
    if (notionResults && notionResults.length) {
      const notionPagesFromResults = notionResults.filter(
        (result:any) => result.object === "page" && result.in_trash === false
      )
      const notionDBsFromResults = notionResults.filter(
        (result:any) => result.object === "database" && result.in_trash === false
      )
      const formattedNotionPages = notionPagesFromResults.map((page: any) => {
        return {
          name: extractNotionTitle(page),
          id: page.id,
          value: page.id,
        }
      })
      const formattedNotionDBs = notionPagesFromResults.map((page: any) => {
        return {
          name: extractNotionTitle(page),
          id: page.id,
          value: page.id,
        }
      })
      setNotionPages(formattedNotionPages)
      setNotionDBs(formattedNotionDBs)
    }
  }, [notionResults, providerToken])

  const handleTitleChange = (e: React.BaseSyntheticEvent) => {
    let titleVal = e.target.value
    setTitle(titleVal)
  }
  const handleDescriptionChange = (e: React.BaseSyntheticEvent) => {
    let descriptionVal = e.target.value

    setDescription(descriptionVal)
  }
  const handleParentPageIdChange = (val: any) => {
    setParentPageId(val)
  }
  const handleParentDBIdChange = (e: React.BaseSyntheticEvent) => {
    let dbId = e.target.value
    setParentDBId(dbId)
  }

  const handleIsPageOrDBChange = (val: string) => {
    setIsPageOrDB(val)
  }

  const pageOrDBField = [{}]

  const fieldsForCreatingAnIssue = useMemo(() => {
    return [
      {
        label: "Title",
        value: title,
        handleChange: handleTitleChange,
        id: "title",
        inputType: "text",
        placeholder: "Issue Title",
      },
      {
        label: "Description",
        value: description,
        handleChange: handleDescriptionChange,
        id: "description",
        inputType: "textarea",
        placeholder: `Issue Description for...
    ${wcLinkForCast}
      `,
      },
      {
        label: "Where to add this",
        value: parentPageId,
        handleChange: handleParentPageIdChange,
        id: "parentPage",
        inputType: "select",
        options: notionPages,
        placeholder: "Page to save to",
      },
      // {
      //   label: "Parent DB",
      //   value: projectId,
      //   handleChange: handleParentDBIdChange,
      //   id: "parentDB",
      //   inputType: "select",
      //   options: notionDBs,
      //   placeholder: "DB to save to",
      // },
    ]
  }, [
    providerToken,
    notionResults,
    description,
    title,
    notionPages,
    notionDBs,
    parentDBId,
    parentPageId,
    wcLinkForCast,
  ])

  const handleClose = (val: boolean) => {
    if (!val) {
      setTitle("")
      setDescription(`Issue Description for...
      ${wcLinkForCast}
        `)
      setParentPageId("")
      setParentDBId("")
      setProjectId("")
    }
  }

  const handleSubmitIssue = async () => {
    try {
      if (
        title &&
        title.length &&
        description &&
        description.length &&
        providerToken &&
        ((parentDBId && parentDBId.length) ||
          (parentPageId && parentPageId.length))
      ) {
        setSubmittingIssue(true)
        setSuccessfullySubmittedIssue(false)
        setErrorSubmittingIssue(false)
        const res = await createNotionItem(
          providerToken,
          "page",
          parentPageId,
          { title, description },
          wcLinkForCast
        )
        setSubmittingIssue(false)
        if (res) {
          setSuccessfullySubmittedIssue(true)
        }
      }
    } catch (e) {
      setErrorSubmittingIssue(true)
      setSubmittingIssue(false)
      console.error("error creating issue", e)
    }
  }

  return {
    fieldsForCreatingAnIssue,
    handleSubmitIssue,
    submittingIssue,
    errorSubmittingIssue,
    successfullySubmittedIssue,
    handleClose,
  }
}

export default useNotion
