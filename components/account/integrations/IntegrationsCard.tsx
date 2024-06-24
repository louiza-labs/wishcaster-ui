import Image from "next/image"
import { SignInButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    <Card className="  gap-y-4">
      <div className="rounded-tr-xl ">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "80%" }} // optional
          src={image}
          className="rounded-t-xl"
          alt={title}
        />
      </div>
      <CardContent className=" relative mt-4  flex flex-col">
        <CardTitle>{title}</CardTitle>

        <CardDescription className="my-6">{description}</CardDescription>
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
