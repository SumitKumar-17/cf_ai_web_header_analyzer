# Cloudflare AI Story Teller (cf_ai_story_teller)

An AI-powered interactive story telling application built on Cloudflare Workers, Workflows, Workers AI, and Pages.

## Components

- **LLM**: Llama 3.3 on Workers AI (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`)
- **Workflow**: Cloudflare Workflows for managing story generation state and steps.
- **Frontend**: Cloudflare Pages (HTML/CSS/JS) for the user interface.
- **State**: Cloudflare KV for storing story history.

## Prerequisites

- Node.js and npm
- Cloudflare Wrangler CLI (`npm install -g wrangler`)
- A Cloudflare account with Workers AI and Workflows enabled.

## Setup & Running

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Login to Cloudflare**
    ```bash
    npx wrangler login
    ```

3.  **Create KV Namespace**
    Create a KV namespace and update the `id` in `wrangler.toml`.
    ```bash
    npx wrangler kv:namespace create STORY_CONTEXT
    ```
    Copy the ID from the output and replace `STORY_CONTEXT_ID` in `wrangler.toml`.

4.  **Run Locally**
    ```bash
    npx wrangler dev
    ```
    Open your browser at `http://localhost:8787` (or the URL provided by Wrangler).

## Usage

1.  Enter a prompt to start a new story.
2.  Wait for the AI to generate the opening.
3.  Type your response or choice to continue the story.
4.  The AI will generate the next segment, keeping the context of the conversation.

## Project Structure

- `src/index.ts`: Main Worker entry point. Handles API requests and serves static assets.
- `src/workflow.ts`: Defines the `StoryGenerationWorkflow` that orchestrates the AI calls and state management.
- `public/`: Static assets for the frontend.
- `wrangler.toml`: Cloudflare configuration.
