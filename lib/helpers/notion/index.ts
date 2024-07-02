export const extractNotionTitle = (page: any) => {
  if (!page && page.properties) return "untitled"
  const pageProperties = page.properties
  const pageTitleObject = Object.keys(pageProperties).reduce(
    (titleObj, currentKey) => {
      if (
        pageProperties[currentKey] &&
        pageProperties[currentKey].type === "title"
      ) {
        titleObj = pageProperties[currentKey]
      }
      return titleObj
    },
    {}
  )

  const pageTitleObjectArray = pageTitleObject.title
  const pageTitleText =
    pageTitleObjectArray && pageTitleObjectArray.length
      ? pageTitleObjectArray[0].plain_text
      : ""
  return pageTitleText
}
