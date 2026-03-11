'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'

interface ProcessedNotes {
  publicNote?: string
  internalNote?: string
}

export function NoteProcessor() {
  const [draftNote, setDraftNote] = useState('')
  const [processedNotes, setProcessedNotes] = useState<ProcessedNotes | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatePublic, setGeneratePublic] = useState(true)
  const [generateInternal, setGenerateInternal] = useState(true)

  const processNote = async () => {
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

    try {
      const response = await fetch('/api/process-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          draftNote: draftNote.trim(),
          generatePublic,
          generateInternal
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process note')
      }

      setProcessedNotes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          kayDesk
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your draft notes into professional public responses and detailed internal documentation using AI
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">Note Processor</CardTitle>
          <CardDescription className="text-base">
            Enter your rough draft below and let AI create polished versions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="draftNote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Draft Note
            </label>
            <Textarea
              id="draftNote"
              placeholder="Type your draft note here... (e.g., 'Customer had login issues. Reset password. Browser cache problem. Fixed now.')"
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              rows={6}
              className="min-h-[120px] resize-none text-base"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium leading-none">Note Types to Generate</label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generatePublic"
                  checked={generatePublic}
                  onCheckedChange={(checked) => setGeneratePublic(checked as boolean)}
                />
                <label
                  htmlFor="generatePublic"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Public Note
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generateInternal"
                  checked={generateInternal}
                  onCheckedChange={(checked) => setGenerateInternal(checked as boolean)}
                />
                <label
                  htmlFor="generateInternal"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Internal Note
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Select which types of notes you want to generate. You can choose one or both.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <Button
            onClick={processNote}
            disabled={isLoading || !draftNote.trim()}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              'Process Note'
            )}
          </Button>
        </CardContent>
      </Card>

      {processedNotes && (
        <div className={`grid gap-8 ${processedNotes.publicNote && processedNotes.internalNote ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {processedNotes.publicNote && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <CardTitle className="text-green-700 dark:text-green-400">Public Note</CardTitle>
                </div>
                <CardDescription>Customer-facing response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <Textarea
                    value={processedNotes.publicNote}
                    readOnly
                    rows={10}
                    className="resize-none text-sm leading-relaxed bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-900/90 hover:bg-green-50 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800"
                    onClick={() => copyToClipboard(processedNotes.publicNote!)}
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {processedNotes.internalNote && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <CardTitle className="text-blue-700 dark:text-blue-400">Internal Note</CardTitle>
                </div>
                <CardDescription>Team documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <Textarea
                    value={processedNotes.internalNote}
                    readOnly
                    rows={10}
                    className="resize-none text-sm leading-relaxed bg-white/80 dark:bg-gray-900/80 border-blue-200 dark:border-blue-800"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-900/90 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800"
                    onClick={() => copyToClipboard(processedNotes.internalNote!)}
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}