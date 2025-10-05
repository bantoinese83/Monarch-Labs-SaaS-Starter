import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen grunge-bg flex items-center justify-center px-6 py-24 text-center text-gray-200">
      <div>
        <div className="text-7xl grunge-headline">404</div>
        <p className="mt-4 text-xl grunge-ink">Page not found</p>
        <p className="mt-2 text-gray-400">
          The page you are looking for might be removed or temporarily unavailable.
        </p>
        <div className="mt-8 inline-flex items-center rounded-md grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 px-6 py-3 text-white hover:from-fuchsia-500 hover:to-purple-600">
          <Link href="/">Go back home</Link>
        </div>
      </div>
    </div>
  )
}
