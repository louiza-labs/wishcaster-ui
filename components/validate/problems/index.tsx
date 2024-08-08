import ProblemCard from "./problem"

interface ProblemsProps {
  problemsData: any[]
}

const Problems = ({ problemsData }: ProblemsProps) => {
  return (
    <div className="flex flex-col items-center gap-y-3">
      {problemsData && problemsData.length ? (
        problemsData.map((problem) => (
          <ProblemCard
            problemDescription={problem.description}
            problemTitle={problem.problem}
            problemMetrics={problem.metrics}
            problemSentiment={problem.sentiment}
            key={problem.description}
          />
        ))
      ) : (
        <p className="text-center">No problems found...yikes</p>
      )}
    </div>
  )
}

export default Problems
