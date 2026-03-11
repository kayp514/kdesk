import { NoteProcessor } from "@/components/note-processor";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8">
      <NoteProcessor />
    </div>
  );
}
