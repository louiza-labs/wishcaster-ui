// Create a Providers component to wrap your application with all the components requiring 'use client', such as next-nprogress-bar or your different contexts...
"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

const LoadingBarProvider = ({ children }: any) => {
  return (
    <>
      <ProgressBar
        height="10px"
        color="#b700ff"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  )
}

export default LoadingBarProvider
