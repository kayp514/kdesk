import { streamText } from 'ai'

export const maxDuration = 30

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
  if (generatePublic) noteTypes.push('- publicNote: A polished, professional customer-facing response')
  if (generateInternal) noteTypes.push('- internalNote: A clear internal note for team documentation')

  const result = streamText({
    model: 'google/gemini-2.0-flash',
    prompt: `You are a professional help desk assistant. Transform the following draft note into structured JSON.

Draft note: "${draftNote}"

Generate a JSON object with the following fields:
${noteTypes.join('\n')}

Rules:
- Only include information from the original draft
- For publicNote: Use a friendly, professional tone suitable for customers. Remove internal jargon.
- For internalNote: Write naturally like how a helpdesk agent documents issues for teammates.
- Set any note type that wasn't requested to null.
${!generatePublic ? '- Set publicNote to null' : ''}
${!generateInternal ? '- Set internalNote to null' : ''}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{"publicNote": "...", "internalNote": "..."}

Do not include any markdown, code blocks, or explanations. Just the raw JSON object.`,
    abortSignal: request.signal,
  })

  return result.toTextStreamResponse()
}
