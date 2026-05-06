"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
              Application error
            </p>
            <h1 className="text-3xl font-bold">Something went wrong.</h1>
            <p className="text-slate-300">
              The page could not be loaded. Try again, or return later if the
              problem continues.
            </p>
            {error.digest ? (
              <p className="text-xs text-slate-500">Error ID: {error.digest}</p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
