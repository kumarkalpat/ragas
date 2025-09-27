// This is a Vercel Serverless Function
// It runs on the server, so it can safely access environment variables.
export const config = {
  runtime: 'edge',
};

// Using a default export for the handler function is a common and robust pattern
// for Vercel Serverless Functions. This avoids potential ambiguity when a file
// has multiple exports (like this one, which also exports `config`).
export default function handler(request) {
  const apiKey = process.env.API_KEY;
  const version = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local';

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
    JSON.stringify({ apiKey, version }), 
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
