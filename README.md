# aiDesk - Help Desk Note Processor

aiDesk is a Next.js application that helps help desk agents transform their draft notes into professional public responses and detailed internal documentation using AI.

## Features

- **Draft Note Processing**: Input your draft notes and get professional outputs
- **Dual Output**: Generates both public-facing customer responses and internal team documentation
- **Google AI Integration**: Uses Google's Gemini AI for intelligent note processing
- **Modern UI**: Built with Next.js 16, React 19, and shadcn/ui components
- **Dark Mode Support**: Automatically adapts to your system's dark/light theme preference
- **Secure API Key Storage**: API keys are stored in environment variables, not in the UI
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

Before you begin, ensure you have:
- Node.js (version 18 or higher)
- A Google AI API key (get one from [Google AI Studio](https://aistudio.google.com/))

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-desk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your API key**

   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Google AI API key:
   ```
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Write your draft note**: Enter your rough draft in the text area
2. **Click "Process Note"**: The AI will generate both public and internal versions
3. **Copy the results**: Use the copy buttons to copy either the public or internal note

> **Note**: The API key is now securely stored in environment variables, so you don't need to enter it in the UI.

### Example

**Draft Note:**
```
Customer having login issues. Reset password. Works now. Browser cache problem.
```

**Public Note (AI-generated):**
```
Thank you for contacting support regarding your login difficulties. I've successfully reset your password, which has resolved the issue. The problem was caused by cached data in your browser. Your account is now working properly, and you should be able to log in without any further issues.
```

**Internal Note (AI-generated):**
```
Ticket Resolution: Customer login failure
- Issue: User unable to authenticate
- Root cause: Browser cache corruption preventing proper session handling
- Action taken: Password reset via admin panel
- Resolution: Login functionality restored
- Follow-up: Advised customer on browser cache clearing procedures
- Status: Resolved
```

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Vercel AI SDK with Google AI provider
- **Language**: TypeScript

## API Routes

- `POST /api/process-note`: Processes draft notes and returns public/internal versions

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
