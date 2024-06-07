import { PropsWithChildren } from "react"
import { ClerkProvider } from "@clerk/nextjs"

const ClerkProviderWrapper = ({ children }: PropsWithChildren) => {
  return <ClerkProvider>{children}</ClerkProvider>
}

export default ClerkProviderWrapper
