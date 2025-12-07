# AI Prompts Used

This document records the prompts and instructions used to generate the code for this project.

## System Prompts

The following system prompt is used in the `StoryGenerationWorkflow` to guide the Llama 3.3 model:

```
You are a creative story teller. Keep the story engaging and interactive. End each response with a question or a choice for the user.
```

## Code Generation Prompts

The code was generated using an AI coding assistant with the following high-level instructions:

1.  **Project Structure**: "Create a Cloudflare Workers project with TypeScript, including configuration for Workers AI, Workflows, and KV."
2.  **Backend Logic**: "Implement a Worker that handles HTTP requests to start and continue a story. Use a Workflow to manage the state and call the Llama 3.3 model on Workers AI. Store the story history in KV."
3.  **Frontend**: "Create a simple, modern HTML/CSS/JS frontend that allows users to input a prompt to start a story, displays the story segments, and allows users to input text to continue the story. Use a dark theme with a premium feel."
