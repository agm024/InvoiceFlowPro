import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resolvedSearchParams = await searchParams
  const message = resolvedSearchParams?.message

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <div className="flex flex-col gap-4 bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">
              Sign in to InvoiceFlowPro
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Enter your email to sign in to your workspace
            </p>
          </div>
          
          <label className="text-sm font-medium text-zinc-300" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <button
            formAction={login}
            className="bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-zinc-200 transition-colors"
          >
            Send Magic Link
          </button>
          
          {message && (
            <p className="mt-4 p-4 bg-zinc-800/50 text-zinc-300 text-center text-sm rounded-md border border-zinc-700/50">
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
