"use client";

import { useState } from "react";
import { LeftPanel } from "./left-panel";
import { RightPanel } from "./right-panel";
import { ThemeToggle } from "./theme-toggle";

interface ProcessedNotes {
  publicNote?: string;
  internalNote?: string;
}

export function NoteProcessor() {
  const [draftNote, setDraftNote] = useState("");
  const [processedNotes, setProcessedNotes] = useState<ProcessedNotes | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatePublic, setGeneratePublic] = useState(true);
  const [generateInternal, setGenerateInternal] = useState(true);
  const [streamingNotes, setStreamingNotes] = useState<ProcessedNotes>({});

  const processNote = async () => {
    if (!draftNote.trim()) {
      setError("Draft note is required");
      return;
    }

    if (!generatePublic && !generateInternal) {
      setError("Please select at least one note type to generate");
      return;
    }

    setIsLoading(true);
    setError("");
    setProcessedNotes(null);
    setStreamingNotes({});

    try {
      const response = await fetch("/api/process-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draftNote: draftNote.trim(),
          generatePublic,
          generateInternal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process note");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";
      const tempNotes: ProcessedNotes = {};

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));


              if (data.type === "public_chunk") {
                tempNotes.publicNote =
                  (tempNotes.publicNote || "") + data.content;
                setStreamingNotes({ ...tempNotes });
              }

              if (data.type === "internal_chunk") {
                tempNotes.internalNote =
                  (tempNotes.internalNote || "") + data.content;
                setStreamingNotes({ ...tempNotes });
              }

              if (data.type === "public_complete") {
                tempNotes.publicNote = data.content;
              }

              if (data.type === "internal_complete") {
                tempNotes.internalNote = data.content;
              }

              if (data.type === "complete") {
                setProcessedNotes(data.results);
                setStreamingNotes({});
                break;
              }

              if (data.type === "error") {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStreamingNotes({});
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              kayDesk
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Transform draft notes into professional responses
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        <LeftPanel
          draftNote={draftNote}
          setDraftNote={setDraftNote}
          generatePublic={generatePublic}
          setGeneratePublic={setGeneratePublic}
          generateInternal={generateInternal}
          setGenerateInternal={setGenerateInternal}
          error={error}
          isLoading={isLoading}
          onProcessNote={processNote}
        />

        <RightPanel
          processedNotes={processedNotes}
          streamingNotes={streamingNotes}
          isLoading={isLoading}
          generatePublic={generatePublic}
          generateInternal={generateInternal}
          onCopyToClipboard={copyToClipboard}
        />
      </div>
    </div>
  );
}
