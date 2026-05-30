"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f3f3] p-6 text-black">
      <section className="max-w-xl border-2 border-[#777] bg-white p-5 font-mono">
        <h1 className="text-2xl font-bold">The page remembered the wrong module.</h1>
        <p className="mt-3">This is a real application error, not one of the generated broken-image states.</p>
        <button className="mt-4 border border-black bg-[#e6e6e6] px-3 py-2" onClick={() => reset()}>
          Retry available tab
        </button>
      </section>
    </main>
  );
}
