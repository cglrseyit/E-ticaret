export function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center text-[13px] font-medium tracking-tight sm:text-sm">
        {text}
      </div>
    </div>
  );
}
