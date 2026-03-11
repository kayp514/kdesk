"use client";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Loader2 } from "lucide-react";

interface LeftPanelProps {
  draftNote: string;
  setDraftNote: (value: string) => void;
  generatePublic: boolean;
  setGeneratePublic: (value: boolean) => void;
  generateInternal: boolean;
  setGenerateInternal: (value: boolean) => void;
  error: string;
  isLoading: boolean;
  onProcessNote: () => void;
}

export function LeftPanel({
  draftNote,
  setDraftNote,
  generatePublic,
  setGeneratePublic,
  generateInternal,
  setGenerateInternal,
  error,
  isLoading,
  onProcessNote,
}: LeftPanelProps) {
  return (
    <div className="w-1/2 border-r border-border flex flex-col">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h2 className="text-sm font-medium text-foreground">Draft Note</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your rough notes and let AI polish them
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Type your draft note here...

Example: Customer had login issues. Reset password. Browser cache problem. Fixed now."
              value={draftNote}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 100) {
                  setDraftNote(value);
                }
              }}
              className="min-h-[200px] resize-none text-sm"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{draftNote.length}/100 characters</span>
              {draftNote.length >= 100 && (
                <span className="text-destructive">Character limit reached</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Generate
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={generatePublic}
                  onCheckedChange={(checked) =>
                    setGeneratePublic(checked as boolean)
                  }
                />
                <span className="text-sm text-foreground">Public Note</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={generateInternal}
                  onCheckedChange={(checked) =>
                    setGenerateInternal(checked as boolean)
                  }
                />
                <span className="text-sm text-foreground">
                  Internal Note
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={onProcessNote}
            disabled={isLoading || !draftNote.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Process Note"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}