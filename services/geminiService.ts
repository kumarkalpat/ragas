import { GoogleGenAI } from "@google/genai";
import { Raga } from '../types';

// This will hold the initialized GoogleGenAI client.
let ai: GoogleGenAI | null = null;

// This function fetches the API key from our serverless function
// and initializes the Gemini client. It's a singleton.
const getAiClient = async (): Promise<GoogleGenAI> => {
  if (ai) {
    return ai;
  }

  try {
    const configResponse = await fetch('/api/config');
    if (!configResponse.ok) {
        const errorData = await configResponse.json();
        throw new Error(errorData.error || 'Failed to fetch API configuration from server.');
    }
    const { apiKey } = await configResponse.json();

    if (!apiKey) {
      throw new Error("API key was not returned from the server.");
    }
    
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
      console.error("Error initializing Gemini client:", error);
      // We'll throw the error up so the UI can display a message.
      // Re-throwing is important so the caller knows initialization failed.
      throw error;
  }
};


// Cache to store Gemini explanations, with Raga ID as the key.
export const explanationCache = new Map<string, string>();

export const getRagaExplanation = async (raga: Raga): Promise<string> => {
  // 1. Check the cache first. If found, return the cached value.
  if (explanationCache.has(raga.id)) {
    return explanationCache.get(raga.id)!;
  }
  
  try {
    // Ensure the client is initialized before using it.
    const client = await getAiClient();

    // 2. If not in cache, proceed to generate the prompt and call the API.
    const family = raga.style === 'Hindustani' 
      ? `the ${raga.thaat} Thaat` 
      : `the ${raga.melakarta} Melakarta system`;

    const compositionsInfo = raga.compositions && raga.compositions.length > 0
      ? `- Famous compositions include: ${raga.compositions.map(c => `'${c.name}' by ${c.composer.name}`).join(', ')}`
      : '';

    const prompt = `
      Explain the Indian classical raga '${raga.name}'. This is a ${raga.style} raga from ${family}.
      
      Key details:
      - Aroha (ascent): '${raga.aroha}'
      - Avaroha (descent): '${raga.avaroha}'
      ${raga.pakad ? `- Pakad (characteristic phrase): '${raga.pakad}'` : ''}
      ${compositionsInfo}

      Explain its mood (rasa), the ideal time of day to perform it (${raga.time}), and what makes it unique. 
      Include a small, interesting anecdote or story related to this raga. You can mention one of the famous compositions as an example.
      
      The explanation should be accessible for a beginner, concise (under 200 words), and a single block of text without markdown headers.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;
    if (text) {
      // 3. On successful API call, store the result in the cache.
      explanationCache.set(raga.id, text);
      return text;
    } else {
      // Do not cache failures.
      return "Could not generate an explanation for this raga.";
    }
  } catch (error) {
    // This will catch errors from both getAiClient and generateContent
    console.error("Error generating raga explanation:", error);
    if (error instanceof Error) {
        return `An error occurred: ${error.message}. Please check the console for details.`;
    }
    return "An unknown error occurred while fetching the explanation.";
  }
};