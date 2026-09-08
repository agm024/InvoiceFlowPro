export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Account Suspended</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Your business account has been suspended by the administrator. Please contact support for more information and to resolve this issue.
        </p>
        <a href="mailto:support@siteradiant.com" className="inline-block bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700 transition">
          Contact Support
        </a>
      </div>
    </div>
  )
}
