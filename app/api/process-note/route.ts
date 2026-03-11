import { streamText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 30

const noteSchema = z.object({
  publicNote: z.string().nullable().describe('Customer-facing professional response'),
  internalNote: z.string().nullable().describe('Internal team documentation'),
})

export async function POST(request: Request) {
  const { draftNote, generatePublic, generateInternal } = await request.json()

  if (!draftNote) {
    return Response.json({ error: 'Draft note is required' }, { status: 400 })
  }

  if (!generatePublic && !generateInternal) {
    return Response.json(
      { error: 'At least one note type must be selected' },
      { status: 400 }
    )
  }

  const noteTypes = []
  if (generatePublic) noteTypes.push('publicNote: A polished, professional customer-facing response')
  if (generateInternal) noteTypes.push('internalNote: A clear internal note for team documentation')

  const result = streamText({
    model: 'google/gemini-2.5-flash-preview-05-20',
    output: Output.object({ schema: noteSchema }),
    prompt: `You are a professional help desk assistant. Transform the following draft note into structured notes.

Draft note: "${draftNote}"

Generate the following based on the draft:
${noteTypes.join('\n')}

Rules:
- Only include information from the original draft
- For publicNote: Use a friendly, professional tone suitable for customers. Remove internal jargon.
- For internalNote: Write naturally like how a helpdesk agent documents issues for teammates.
- Set any note type that wasn't requested to null.
${!generatePublic ? '- Set publicNote to null' : ''}
${!generateInternal ? '- Set internalNote to null' : ''}`,
    abortSignal: request.signal,
  })

  return result.toTextStreamResponse()
}
