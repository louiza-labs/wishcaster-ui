import Link from "next/link"

import { generateWhimsicalErrorMessages } from "@/lib/helpers"

export default function NotFound() {
  return (
    <div>
      <h6 className="mt-20 text-center text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        You may be lost
      </h6>
      <h5 className="mt-4 text-center text-2xl font-light leading-tight tracking-tighter md:text-3xl">
        {generateWhimsicalErrorMessages(true)}
      </h5>
      <Link href="/"> Home</Link>
    </div>
  )
}
