import { SignInButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface IntegrationsCardProps {
  title: string
  description: string
  image: string
  handleClick: any
  isConnected: boolean
}
const IntegrationsCard = ({
  title,
  description,
  image,
  handleClick,
  isConnected,
}: IntegrationsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <img src={image} alt={title} />
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {title === "-inear" ? (
          // <Button
          //   onClick={handleClick}
          //   variant={isConnected ? "outline" : "default"}
          //   className="w-full"
          // >
          <SignInButton>{isConnected ? "Disconnect" : "Connect"}</SignInButton>
        ) : (
          // </Button>
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
