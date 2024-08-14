"use client"

import useFetchGithubRepos from "@/hooks/github/useFetchGithubRepos"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RelatedProjectsProps {
  searchIdea: string
  similarIdeas: string[]
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CircleDotIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  )
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

const RelatedProjects = ({
  searchIdea,
  similarIdeas,
}: RelatedProjectsProps) => {
  const allIdeas = [...similarIdeas, searchIdea]
  const { githubRepos, fetchingGithubRepos } = useFetchGithubRepos(allIdeas)

  const handleVisitProject = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }

  const RelatedProjectCard = ({
    name,
    description,
    stars,
    owner,
    url,
  }: any) => {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-secondary text-secondary-foreground">
            <Button
              onClick={() => handleVisitProject(url)}
              variant="secondary"
              className="px-3 shadow-none"
            >
              Visit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {/* <div className="flex items-center">
              <CircleDotIcon className="mr-1 size-3" />
            </div> */}
            <div className="flex items-center">
              <StarIcon className="mr-1 size-3" />
              {stars}
            </div>
            {/* <div>Updated April 2023</div> */}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center  gap-3 ">
      {githubRepos && githubRepos.length ? (
        githubRepos.map((repo) => (
          <RelatedProjectCard
            name={repo.name}
            description={repo.description}
            stars={repo.stars}
            url={repo.url}
            owner={repo.owner}
            key={repo.url}
          />
        ))
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          <p className="text-center text-xl font-semibold">
            No Projects Found 👀{" "}
          </p>
        </div>
      )}
    </div>
  )
}

export default RelatedProjects
