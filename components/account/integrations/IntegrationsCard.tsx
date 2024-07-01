import { SignInButton } from "@clerk/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface IntegrationsCardProps {
  title: string
  description: string
  image: string
  handleClick: any
  isConnected: boolean
  featuresList: any
}
const IntegrationsCard = ({
  title,
  description,
  image,
  handleClick,
  isConnected,
  featuresList,
}: IntegrationsCardProps) => {
  const IntegrationFeatures = () => {
    return (
      <div className="flex flex-col gap-y-2">
        {featuresList.map((feature: any) => (
          <div className="flex w-full flex-row items-center justify-start gap-x-4">
            <>
              {feature.status === "pending" ? (
                <Icons.dottedCircle className="size-4" />
              ) : (
                <Icons.circledCheck className="size-4" />
              )}
            </>
            <p className="text-sm">{feature.label}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="rounded-lg border border-gray-200 p-4 shadow-md">
      {/* <div className="h-auto overflow-hidden rounded-t-lg">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "80%" }} // optional
          src={image}
          className="-xl  rounded"
          alt={title}
        />
      </div> */}
      <div className="flex flex-row items-center gap-x-4">
        <Avatar className="relative size-10">
          {image ? <AvatarImage src={image} alt={title} /> : null}
          <AvatarFallback className="text-sm font-semibold">
            {title}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
      <CardContent className="p-4">
        <CardDescription className="mt-2 text-sm">
          <IntegrationFeatures />
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4">
        {title === "-inear" ? (
          <SignInButton>{isConnected ? "Disconnect" : "Connect"}</SignInButton>
        ) : (
          <Button
            onClick={handleClick}
            variant={isConnected ? "outline" : "default"}
            className="w-full"
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default IntegrationsCard
