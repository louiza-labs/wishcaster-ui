import { login, signup } from "@/app/actions"

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-y-2">
      <div className="flex flex-col">
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
      </div>
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  )
}
