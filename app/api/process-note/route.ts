import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'

export async function POST(request: NextRequest) {
  try {
    const { draftNote, generatePublic, generateInternal } = await request.json()

    if (!draftNote) {
      return NextResponse.json(
        { error: 'Draft note is required' },
        { status: 400 }
      )
    }

    if (!generatePublic && !generateInternal) {
      return NextResponse.json(
        { error: 'At least one note type must be selected' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google AI API key not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    })

    const model = google('gemini-3.1-pro-preview')

    const results: { publicNote?: string; internalNote?: string } = {}

    if (generatePublic) {
      const publicNoteResult = await generateText({
        model,
        prompt: `You are a professional help desk assistant. Rewrite the following draft note into a polished, professional public-facing customer response. Keep it natural and professional without adding details not mentioned in the original draft:

Draft note: ${draftNote}

Rewrite this as a professional customer response. Use a friendly tone, keep it clear and concise, and remove any internal jargon. Only include information that was in the original draft.

Public note:`
      })
      results.publicNote = publicNoteResult.text
    }

    if (generateInternal) {
      const internalNoteResult = await generateText({
        model,
        prompt: `You are a helpdesk agent writing an internal note for your team. Rewrite the following draft note in a natural way that helpdesk agents would write for each other. Keep it conversational but clear, and only use the information provided in the draft:

Draft note: ${draftNote}

Rewrite this as an internal helpdesk note. Write it naturally like how a helpdesk agent would document this for their teammates. Don't add extra technical details or steps that weren't mentioned in the original draft.

Internal note:`
      })
      results.internalNote = internalNoteResult.text
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Error processing note:', error)
    return NextResponse.json(
      { error: 'Failed to process note. Please check your configuration and try again.' },
      { status: 500 }
    )
  }
}