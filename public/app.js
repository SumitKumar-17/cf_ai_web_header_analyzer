const startBtn = document.getElementById('start-btn');
const continueBtn = document.getElementById('continue-btn');
const promptInput = document.getElementById('prompt');
const userInput = document.getElementById('user-input');
const startScreen = document.getElementById('start-screen');
const storyScreen = document.getElementById('story-screen');
const storyContainer = document.getElementById('story-container');
const loading = document.getElementById('loading');

let currentStoryId = null;

async function startStory() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    setLoading(true);
    try {
        const res = await fetch('/api/start-story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!res.ok) throw new Error('Failed to start story');

        const data = await res.json();
        currentStoryId = data.storyId;

        startScreen.classList.remove('active');
        storyScreen.classList.add('active');

        // Poll for updates
        pollStoryUpdates();
    } catch (err) {
        console.error(err);
        alert('Something went wrong starting the story.');
        setLoading(false);
    }
}

async function continueStory() {
    const input = userInput.value.trim();
    if (!input) return;

    setLoading(true);
    try {
        const res = await fetch('/api/continue-story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyId: currentStoryId, input })
        });

        if (!res.ok) throw new Error('Failed to continue story');

        userInput.value = '';
        pollStoryUpdates();
    } catch (err) {
        console.error(err);
        alert('Something went wrong continuing the story.');
        setLoading(false);
    }
}

async function pollStoryUpdates() {
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/api/get-story?id=${currentStoryId}`);
            if (!res.ok) return;

            const data = await res.json();
            renderStory(data.history);

            // If the last message is from assistant, stop loading and polling
            const lastMsg = data.history[data.history.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
                clearInterval(interval);
                setLoading(false);
            }
        } catch (err) {
            console.error('Polling error:', err);
        }
    }, 2000);
}

function renderStory(history) {
    storyContainer.innerHTML = '';
    history.forEach(msg => {
        if (msg.role === 'system') return; // Skip system prompt

        const div = document.createElement('div');
        div.className = 'story-segment';
        div.innerHTML = `
            <div class="role-${msg.role}">${msg.role === 'user' ? 'You' : 'Story Teller'}</div>
            <div class="content">${msg.content}</div>
        `;
        storyContainer.appendChild(div);
    });
    storyContainer.scrollTop = storyContainer.scrollHeight;
}

function setLoading(isLoading) {
    if (isLoading) {
        loading.classList.remove('hidden');
        startBtn.disabled = true;
        continueBtn.disabled = true;
    } else {
        loading.classList.add('hidden');
        startBtn.disabled = false;
        continueBtn.disabled = false;
    }
}

startBtn.addEventListener('click', startStory);
continueBtn.addEventListener('click', continueStory);
