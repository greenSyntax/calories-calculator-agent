import axios from 'axios';

import { env } from '../config/env.js';
import { buildNutritionPrompt } from '../prompts/nutrition.prompt.js';
import { safeJsonParse } from '../utils/json.util.js';

export const analyzeMeal = async (meal) => {
  const prompt = buildNutritionPrompt(meal);

  let response;

  try {
    response = await axios.post(
      `${env.ollamaBaseUrl}/api/generate`,
      {
        model: env.ollamaModel,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.2,
          top_p: 0.8
        },
        system:
          'You are an expert nutritionist. Estimate realistic nutrition values using common Indian serving sizes.',
        prompt
      },
      {
        timeout: 60000
      }
    );
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw new Error('Ollama request timed out. The model may be overloaded or unavailable.');
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      throw new Error('Unable to reach Ollama. Make sure the service is running.');
    }

    if (err.response) {
      throw new Error(`Ollama returned an error: ${err.response.status} ${err.response.statusText}`);
    }

    throw new Error(`Ollama request failed: ${err.message}`);
  }

  const parsed = safeJsonParse(response.data.response);

  if (!parsed) {
    throw new Error('Invalid JSON received from Ollama');
  }

  return parsed;
};