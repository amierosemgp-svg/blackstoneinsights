import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 py-24">
      <h1 className="font-serif text-4xl tracking-tight">Nothing at this address</h1>
      <p className="mt-4 text-muted max-w-md">
        The page may have moved, or the report may have been withdrawn. Try the reports index.
      </p>
      <Link href="/reports" className="mt-6 inline-block">
        All reports
      </Link>
    </div>
  );
}
