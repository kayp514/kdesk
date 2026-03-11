'use client'

import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { ScrollArea } from './ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Copy, Loader2, Globe, Lock } from 'lucide-react'

interface ProcessedNotes {
  publicNote: string | null
  internalNote: string | null
}

export function NoteProcessor() {
  const [draftNote, setDraftNote] = useState('')
  const [processedNotes, setProcessedNotes] = useState<ProcessedNotes | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatePublic, setGeneratePublic] = useState(true)
  const [generateInternal, setGenerateInternal] = useState(true)

  const processNote = useCallback(async () => {
    if (!draftNote.trim()) {
      setError('Draft note is required')
      return
    }

    if (!generatePublic && !generateInternal) {
      setError('Please select at least one note type to generate')
      return
    }

    setIsLoading(true)
    setError('')
    setProcessedNotes(null)

    try {
      const response = await fetch('/api/process-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftNote: draftNote.trim(),
          generatePublic,
          generateInternal,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process note')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        fullContent += decoder.decode(value, { stream: true })

        try {
          const parsed = JSON.parse(fullContent)
          setProcessedNotes(parsed)
        } catch {
          // Content is still streaming, continue
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [draftNote, generatePublic, generateInternal])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            kayDesk
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transform draft notes into professional responses
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Draft Input */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="px-6 py-4 border-b border-border shrink-0">
            <h2 className="text-sm font-medium text-foreground">Draft Note</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your rough notes and let AI polish them
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              <Textarea
                placeholder="Type your draft note here...

Example: Customer had login issues. Reset password. Browser cache problem. Fixed now."
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                className="min-h-[200px] resize-none text-sm"
              />

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Generate</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={generatePublic}
                      onCheckedChange={(checked) => setGeneratePublic(checked as boolean)}
                    />
                    <span className="text-sm text-foreground">Public Note</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={generateInternal}
                      onCheckedChange={(checked) => setGenerateInternal(checked as boolean)}
                    />
                    <span className="text-sm text-foreground">Internal Note</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              <Button
                onClick={processNote}
                disabled={isLoading || !draftNote.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process Note'
                )}
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Generated Notes */}
        <div className="w-1/2 flex flex-col">
          <div className="px-6 py-4 border-b border-border shrink-0">
            <h2 className="text-sm font-medium text-foreground">Generated Notes</h2>
            <p className="text-xs text-muted-foreground mt-1">
              AI-generated professional versions
            </p>
          </div>

          <div className="flex-1 p-6 min-h-0">
            {processedNotes || isLoading ? (
              <Tabs defaultValue="internal" className="h-full flex flex-col">
                <TabsList className="w-full shrink-0">
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
                  <Card className="h-full flex flex-col">
                    <CardHeader className="shrink-0 pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Internal Note</CardTitle>
                          <CardDescription>Team documentation</CardDescription>
                        </div>
                        {processedNotes?.internalNote && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(processedNotes.internalNote!)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                      <ScrollArea className="h-full">
                        {isLoading && !processedNotes?.internalNote ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Generating...</span>
                          </div>
                        ) : processedNotes?.internalNote ? (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {processedNotes.internalNote}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {generateInternal ? 'No internal note generated yet' : 'Internal note generation disabled'}
                          </p>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="public" className="flex-1 mt-4">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="shrink-0 pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Public Note</CardTitle>
                          <CardDescription>Customer-facing response</CardDescription>
                        </div>
                        {processedNotes?.publicNote && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(processedNotes.publicNote!)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                      <ScrollArea className="h-full">
                        {isLoading && !processedNotes?.publicNote ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Generating...</span>
                          </div>
                        ) : processedNotes?.publicNote ? (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                            {processedNotes.publicNote}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {generatePublic ? 'No public note generated yet' : 'Public note generation disabled'}
                          </p>
                        )}
                      </ScrollArea>
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
                  <h3 className="text-sm font-medium text-foreground">No notes yet</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a draft note and click Process to generate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
