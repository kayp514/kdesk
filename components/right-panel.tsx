"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Copy, Globe, Lock, Loader2 } from "lucide-react";

interface ProcessedNotes {
  publicNote?: string;
  internalNote?: string;
}

interface RightPanelProps {
  processedNotes: ProcessedNotes | null;
  streamingNotes: ProcessedNotes;
  isLoading: boolean;
  generatePublic: boolean;
  generateInternal: boolean;
  onCopyToClipboard: (text: string) => void;
}

export function RightPanel({
  processedNotes,
  streamingNotes,
  isLoading,
  generatePublic,
  generateInternal,
  onCopyToClipboard,
}: RightPanelProps) {
  return (
    <div className="w-1/2 flex flex-col">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h2 className="text-sm font-medium text-foreground">
          Generated Notes
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          AI-generated professional versions
        </p>
      </div>

      <div className="flex-1 p-6 min-h-0">
        {processedNotes || isLoading ? (
          <Tabs defaultValue="internal" className="h-full flex flex-col">
            <TabsList className="w-full shrink-0 bg-white dark:bg-muted">
              <TabsTrigger value="internal" className="flex-1 gap-2">
                <Lock className="h-4 w-4" />
                Internal Note
              </TabsTrigger>
              <TabsTrigger value="public" className="flex-1 gap-2">
                <Globe className="h-4 w-4" />
                Public Note
              </TabsTrigger>
            </TabsList>

            <TabsContent value="internal" className="flex-1 mt-4">
              <Card className="h-full flex flex-col bg-white dark:bg-card">
                <CardHeader className="shrink-0 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Internal Note
                      </CardTitle>
                      <CardDescription>Team documentation</CardDescription>
                    </div>
                    {(processedNotes?.internalNote || streamingNotes.internalNote) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onCopyToClipboard(
                            (processedNotes?.internalNote || streamingNotes.internalNote)!
                          )
                        }
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 bg-white dark:bg-card">
                  <div className="h-full overflow-auto">
                    {isLoading && !processedNotes?.internalNote && !streamingNotes.internalNote ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generating...</span>
                      </div>
                    ) : (processedNotes?.internalNote || streamingNotes.internalNote) ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-black dark:text-foreground">
                        {processedNotes?.internalNote || streamingNotes.internalNote}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {generateInternal
                          ? "No internal note generated yet"
                          : "Internal note generation disabled"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="public" className="flex-1 mt-4">
              <Card className="h-full flex flex-col bg-white dark:bg-card">
                <CardHeader className="shrink-0 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Public Note
                      </CardTitle>
                      <CardDescription>
                        Customer-facing response
                      </CardDescription>
                    </div>
                    {(processedNotes?.publicNote || streamingNotes.publicNote) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onCopyToClipboard(
                            (processedNotes?.publicNote || streamingNotes.publicNote)!
                          )
                        }
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 bg-white dark:bg-card">
                  <div className="h-full overflow-auto">
                    {isLoading && !processedNotes?.publicNote && !streamingNotes.publicNote ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generating...</span>
                      </div>
                    ) : (processedNotes?.publicNote || streamingNotes.publicNote) ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-black dark:text-foreground">
                        {processedNotes?.publicNote || streamingNotes.publicNote}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {generatePublic
                          ? "No public note generated yet"
                          : "Public note generation disabled"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground">
                No notes yet
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enter a draft note and click Process to generate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}