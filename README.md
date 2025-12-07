# HeaderGuard - Web Security Header Analyzer

HeaderGuard is a modern full-stack application designed to help developers and security professionals analyze HTTP security headers. Powered by Cloudflare Workers, Hono, and React Router, it provides real-time analysis and AI-driven security assessments to improve website security posture.

## Features

- **Real-time Header Analysis**: Instantly fetches and analyzes HTTP response headers from any public URL.
- **AI-Powered Assessment**: Uses Cloudflare Workers AI (Llama 3.3) to evaluate security headers and provide actionable recommendations.
- **Smart Caching**: Utilizes Cloudflare KV to cache analysis results for improved performance.
- **Modern UI**: Built with React Router v7 and Tailwind CSS v4 for a responsive and accessible user interface.
- **Edge Computing**: Fully serverless architecture running on Cloudflare Workers.

## Tech Stack

- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Backend Framework**: [Hono](https://hono.dev/)
- **Frontend Framework**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Model**: @cf/meta/llama-3.3-70b-instruct-fp8-fast
- **Storage**: Cloudflare KV

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn
- Cloudflare account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cf_ai_story_teller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server locally:

```bash
npm run dev
```

This will start the React Router dev server and the Cloudflare Workers dev environment.

### Deployment

Deploy the application to Cloudflare Workers:

```bash
npm run deploy
```

## Project Structure

- `/app`: Frontend application code (React Router).
- `/workers`: Backend worker code (Hono).
- `/workers/analyzer.ts`: AI analysis logic and prompts.
- `wrangler.jsonc`: Cloudflare Workers configuration.
