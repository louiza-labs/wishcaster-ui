import ProblemCard from "./problem"

interface ProblemsProps {
  problemsData: any[]
}

const Problems = ({ problemsData }: ProblemsProps) => {
  return (
    <div className="flex flex-col gap-y-4 rounded-xl border-2 border-blue-200 p-4 shadow-lg">
      <p className="text-xl font-semibold">What problems exist?</p>
      <div className="grid grid-cols-1 items-center gap-y-3">
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
    </div>
  )
}

export default Problems
