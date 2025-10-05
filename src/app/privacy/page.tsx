export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 2025-01-01</p>
      <section className="prose prose-neutral mt-8 dark:prose-invert">
        <p>
          We respect your privacy. This policy explains what data we collect, how we use it, and
          your rights.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide, such as your name and email, and usage data to improve
          the service.
        </p>
        <h2>How We Use Information</h2>
        <p>
          We use data to operate, maintain, and improve the service, and to communicate with you.
        </p>
        <h2>Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal information as permitted
          by law.
        </p>
        <p className="mt-8">For privacy inquiries, please contact support.</p>
      </section>
      <div className="mt-10">
        <a href="/" className="text-primary hover:underline">
          Go back home
        </a>
      </div>
    </main>
  )
}
