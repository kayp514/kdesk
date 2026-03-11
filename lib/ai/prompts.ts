export const publicPrompts = {
  rewriteNote: (draftNote: string) => `You are a professional help desk assistant. Rewrite the following draft note into a polished, professional public-facing customer response. Keep it natural and professional without adding details not mentioned in the original draft:

Draft note: ${draftNote}

Rewrite this as a professional customer response. Use a friendly tone, keep it clear and concise, and remove any internal jargon. Only include information that was in the original draft.

Public note:`
}

export const internalPrompts = {
  rewriteNote: (draftNote: string) => `You are a helpdesk agent writing an internal note for your team. Rewrite the following draft note in a natural way that helpdesk agents would write for each other. Keep it conversational but clear, and only use the information provided in the draft:

Draft note: ${draftNote}

Rewrite this as an internal helpdesk note. Write it naturally like how a helpdesk agent would document this for their teammates. Don't add extra technical details or steps that weren't mentioned in the original draft.

Internal note:`
}