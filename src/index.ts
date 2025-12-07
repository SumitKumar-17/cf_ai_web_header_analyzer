import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

export interface Env {
    AI: Ai;
    STORY_WORKFLOW: Workflow;
    STORY_CONTEXT: KVNamespace;
    ASSETS: Fetcher;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // Serve static assets (Pages)
        if (url.pathname === '/' || url.pathname.startsWith('/assets') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
            return env.ASSETS.fetch(request);
        }

        // API endpoints
        if (url.pathname === '/api/start-story' && request.method === 'POST') {
            const { prompt } = await request.json() as { prompt: string };
            const storyId = crypto.randomUUID();

            // Initialize story context in KV
            await env.STORY_CONTEXT.put(storyId, JSON.stringify({ history: [], current_state: 'started' }));

            // Trigger workflow
            await env.STORY_WORKFLOW.create({
                id: storyId,
                params: { storyId, prompt, action: 'start' },
            });

            return new Response(JSON.stringify({ storyId }), { headers: { 'Content-Type': 'application/json' } });
        }

        if (url.pathname === '/api/continue-story' && request.method === 'POST') {
            const { storyId, input } = await request.json() as { storyId: string, input: string };

            // Trigger workflow for continuation
            await env.STORY_WORKFLOW.create({
                id: storyId + '-' + Date.now(), // Unique ID for this step
                params: { storyId, input, action: 'continue' },
            });

            return new Response(JSON.stringify({ status: 'processing' }), { headers: { 'Content-Type': 'application/json' } });
        }

        if (url.pathname === '/api/get-story' && request.method === 'GET') {
            const storyId = url.searchParams.get('id');
            if (!storyId) return new Response('Missing id', { status: 400 });

            const story = await env.STORY_CONTEXT.get(storyId);
            return new Response(story, { headers: { 'Content-Type': 'application/json' } });
        }

        return new Response('Not Found', { status: 404 });
    },
};

// Re-export the Workflow class so the runtime can find it
export { StoryGenerationWorkflow } from './workflow';
