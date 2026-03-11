import { NextRequest } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { publicPrompts, internalPrompts } from '@/lib/ai/prompts'

export async function POST(request: NextRequest) {
  try {
    const { draftNote, generatePublic, generateInternal } = await request.json()

    if (!draftNote) {
      return new Response(
        JSON.stringify({ error: 'Draft note is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!generatePublic && !generateInternal) {
      return new Response(
        JSON.stringify({ error: 'At least one note type must be selected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured. Please check your environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    })

    const model = google('gemini-3.1-pro-preview')

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        const results: { publicNote?: string; internalNote?: string } = {}

        try {
          // Send initial status
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'starting' })}\n\n`))

          if (generatePublic) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'generating_public' })}\n\n`))

            const publicResult = await streamText({
              model,
              prompt: publicPrompts.rewriteNote(draftNote)
            })

            let publicNote = ''
            for await (const chunk of publicResult.textStream) {
              publicNote += chunk
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'public_chunk', content: chunk })}\n\n`))
            }
            results.publicNote = publicNote
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'public_complete', content: publicNote })}\n\n`))
          }

          if (generateInternal) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'generating_internal' })}\n\n`))

            const internalResult = await streamText({
              model,
              prompt: internalPrompts.rewriteNote(draftNote)
            })

            let internalNote = ''
            for await (const chunk of internalResult.textStream) {
              internalNote += chunk
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'internal_chunk', content: chunk })}\n\n`))
            }
            results.internalNote = internalNote
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'internal_complete', content: internalNote })}\n\n`))
          }

          // Send completion
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', results })}\n\n`))
          controller.close()
        } catch (error) {
          console.error('Error in stream:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Failed to process note' })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Error processing note:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process note. Please check your configuration and try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}