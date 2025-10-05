import Link from 'next/link'
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 2025-01-01</p>
      <section className="prose prose-neutral mt-8 dark:prose-invert">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of this application. By
          accessing or using the app, you agree to be bound by these Terms.
        </p>
        <h2>Use of Service</h2>
        <p>
          You agree to use the service in compliance with all applicable laws and not to misuse or
          attempt to disrupt the service.
        </p>
        <h2>Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and for all
          activities that occur under your account.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis with no
          warranties of any kind.
        </p>
        <p className="mt-8">If you have any questions about these Terms, please contact support.</p>
      </section>
      <div className="mt-10">
        <Link href="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </div>
    </main>
  )
}
