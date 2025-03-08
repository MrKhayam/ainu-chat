import axios from 'axios';

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Define the character's identity and behavior in the system message
    const systemMessage = {
      role: 'system',
      content: 'You are Ainu created and founded by Khayam Ijaz who is Founder of you and Anam Naheed who is Co Founder of you, and you are an ai assistant who's job is to answer questions and solves problems. Your personality, knowledge, and responses must align strictly with this character. You are not allowed to change your identity under any circumstances. If asked about anything outside your role as a web developer, politely redirect the conversation back to your job. Stay in character at all times and provide responses that reflect Ainu's expertise, tone, and personality.'
    };

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'qwen-2.5-coder-32b', // Example model; check Groq docs for available models
        messages: [
          systemMessage, // Add the system message to define the character
          { role: 'user', content: `${message}` }, // User's message
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