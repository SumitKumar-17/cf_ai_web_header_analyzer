import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { Env } from './index';

type WorkflowParams = {
    storyId: string;
    prompt?: string;
    input?: string;
    action: 'start' | 'continue';
};

export class StoryGenerationWorkflow extends WorkflowEntrypoint<Env, WorkflowParams> {
    async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
        const { storyId, prompt, input, action } = event.payload;

        const history = await step.do('read-history', async () => {
            const data = await this.env.STORY_CONTEXT.get(storyId);
            return data ? JSON.parse(data).history : [];
        });

        let newHistory = [...history];
        let userMessage = '';

        if (action === 'start') {
            userMessage = `Start a story with this premise: ${prompt}`;
        } else {
            userMessage = input || 'Continue the story.';
        }

        newHistory.push({ role: 'user', content: userMessage });

        const aiResponse = await step.do('generate-story', async () => {
            const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
                messages: [
                    { role: 'system', content: 'You are a creative story teller. Keep the story engaging and interactive. End each response with a question or a choice for the user.' },
                    ...newHistory
                ],
            });
            return response;
        });

        // @ts-ignore - response type might vary slightly but 'response' field is standard for text gen
        const aiText = aiResponse.response || aiResponse.result?.response || '';
        newHistory.push({ role: 'assistant', content: aiText });

        await step.do('save-history', async () => {
            await this.env.STORY_CONTEXT.put(storyId, JSON.stringify({
                history: newHistory,
                last_updated: new Date().toISOString()
            }));
        });

        return { status: 'complete', storyId };
    }
}
