export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square w-full rounded-2xl bg-muted" />
        <div className="space-y-4">
          <div className="h-6 w-32 rounded-md bg-muted" />
          <div className="h-9 w-3/4 rounded-md bg-muted" />
          <div className="h-5 w-2/3 rounded-md bg-muted" />
          <div className="mt-6 h-12 w-40 rounded-md bg-muted" />
          <div className="space-y-2 pt-6">
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="h-4 w-5/6 rounded-md bg-muted" />
            <div className="h-4 w-4/6 rounded-md bg-muted" />
          </div>
          <div className="h-14 w-full rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
