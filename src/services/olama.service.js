import axios from 'axios';

import { env } from '../config/env.js';
import { buildNutritionPrompt } from '../prompts/nutrition.prompt.js';
import { safeJsonParse } from '../utils/json.util.js';

export const analyzeMeal = async (meal) => {
  const prompt = buildNutritionPrompt(meal);

  if (env.devLog) console.log(`[DEV] Sending request to Ollama -> model: ${env.ollamaModel}, url: ${env.ollamaBaseUrl}`);

  const start = Date.now();
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
    const elapsed = Date.now() - start;
    if (env.devLog) console.log(`[DEV] Ollama request failed after ${elapsed}ms -> code: ${err.code}, message: ${err.message}`);

    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw new Error(`Ollama request timed out after ${elapsed}ms. The model may be overloaded or unavailable.`);
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      throw new Error('Unable to reach Ollama. Make sure the service is running.');
    }

    if (err.response) {
      throw new Error(`Ollama returned an error: ${err.response.status} ${err.response.statusText}`);
    }

    throw new Error(`Ollama request failed: ${err.message}`);
  }

  const elapsed = Date.now() - start;
  if (env.devLog) console.log(`[DEV] Ollama responded in ${elapsed}ms -> eval_count: ${response.data.eval_count}, prompt_eval_count: ${response.data.prompt_eval_count}`);

  const parsed = safeJsonParse(response.data.response);

  if (!parsed) {
    throw new Error('Invalid JSON received from Ollama');
  }

  return parsed;
};