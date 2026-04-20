async function ask() {
    const input = document.getElementById('input');
    const display = document.getElementById('display');
    const msg = input.value;
    if (!msg) return;

    // User Message
    display.innerHTML += `
        <div class="message-user p-4 rounded-xl mb-4 fade-in">
            <span class="text-[10px] text-sky-500 font-bold block mb-1">STATION_USER</span>
            <div class="text-sm">${msg}</div>
        </div>`;
    
    input.value = '';
    display.scrollTop = display.scrollHeight;

    try {
        // Gunakan path standar Netlify Functions
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        if (!response.ok) {
            throw new Error(`Server status: ${response.status}`);
        }

        const data = await response.json();

        // AI Message
        display.innerHTML += `
            <div class="message-ai p-4 rounded-xl mb-4 fade-in glass-panel">
                <span class="text-[10px] text-sky-400 font-bold block mb-1">ZENNN_AI_RESPONSE</span>
                <pre class="text-sm whitespace-pre-wrap leading-relaxed text-sky-100">${data.reply}</pre>
            </div>`;
    } catch (e) {
        console.error("Error Detail:", e);
        display.innerHTML += `
            <div class="text-red-500 text-[10px] font-bold p-2 bg-red-500/10 border border-red-500/20 rounded">
                [SYSTEM_FAILURE]: ${e.message}. Periksa Dashboard Netlify atau API Key.
            </div>`;
    }
    display.scrollTop = display.scrollHeight;
}