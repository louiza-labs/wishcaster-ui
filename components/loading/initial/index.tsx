import { Icons } from "@/components/icons"

const references = ["Hold on to your butts!"]

const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * length)
}

const InitialLoading = () => {
  const randomIndex = getRandomIndex(references.length)
  const reference = references[0]

  return (
    <div className="bg-background flex h-screen w-full flex-col items-center justify-center">
      <div className="mb-4 animate-bounce">
        <Icons.logo />
      </div>
      <div className="text-center text-lg "> Hold on to your butts</div>
    </div>
  )
}

export default InitialLoading
