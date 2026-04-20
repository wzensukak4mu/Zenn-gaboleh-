const Groq = require('groq-sdk');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { message } = JSON.parse(event.body);
        // Kita gunakan process.env agar aman saat dideploy
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Anda adalah Expert Coding Assistant. Berikan solusi kode yang bersih, efisien, dan jelaskan langkah-langkahnya jika perlu." 
                },
                { role: "user", content: message }
            ],
            model: "llama3-8b-8192",
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: completion.choices[0].message.content }),
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};