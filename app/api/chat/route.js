import axios from 'axios';

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'qwen-2.5-coder-32b', // Example model; check Groq docs for available models
        // Inside the POST function, update the messages array:
messages: [
  { 
    role: 'system', 
    content: '' 
  },
  { role: 'user', content: message },
],
        max_tokens: 10000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content; // Groq’s response structure
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}