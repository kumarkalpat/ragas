// This is a Vercel Serverless Function
// It runs on the server, so it can safely access environment variables.
export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API_KEY is not configured on the server.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ apiKey }), 
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
