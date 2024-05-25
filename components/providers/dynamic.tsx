import { DynamicContextProvider } from "@/lib/dynamic"

export default function DynamicProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.DYNAMIC_ENVIRONMENT_ID
            ? process.env.DYNAMIC_ENVIRONMENT_ID
            : "",
        }}
      >
        {children}
      </DynamicContextProvider>
    </>
  )
}
