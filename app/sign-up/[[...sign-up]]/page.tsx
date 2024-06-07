import { SignUp } from "@clerk/nextjs"

export default async function Page({ searchParams }: any) {
  return (
    <>
      <div className="fixed inset-x-0 inset-y-16 z-40 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-xl lg:inset-0">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
            },
          }}
        />
      </div>
    </>
  )
}
