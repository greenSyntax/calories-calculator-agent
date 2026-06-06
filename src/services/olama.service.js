import axios from 'axios';

import { env } from '../config/env.js';
import { buildNutritionPrompt, buildImageNutritionPrompt } from '../prompts/nutrition.prompt.js';
import { safeJsonParse } from '../utils/json.util.js';

const SYSTEM_PROMPT =
  'You are an expert nutritionist. Estimate realistic nutrition values using common Indian serving sizes.';

const buildRequestBody = ({ meal_media_type, meal_data, meal_image_base64 }) => {
  const base = {
    model: env.ollamaModel,
    stream: false,
    format: 'json',
    options: { temperature: 0.2, top_p: 0.8 },
    system: SYSTEM_PROMPT
  };

  if (meal_media_type === 'image') {
    // Strip data-URL prefix if the client included it
    const base64 = meal_image_base64.replace(/^data:image\/[a-z]+;base64,/, '');
    return { ...base, prompt: buildImageNutritionPrompt(), images: [base64] };
  }

  return { ...base, prompt: buildNutritionPrompt(meal_data) };
};

export const analyzeMeal = async (input) => {
  const requestBody = buildRequestBody(input);

  if (env.devLog)
    console.log(
      `[DEV] Sending request to Ollama -> model: ${env.ollamaModel}, url: ${env.ollamaBaseUrl}, type: ${input.meal_media_type}`
    );

  const start = Date.now();
  let response;

  try {
    response = await axios.post(`${env.ollamaBaseUrl}/api/generate`, requestBody, { timeout: 60000 });
  } catch (err) {
    const elapsed = Date.now() - start;
    if (env.devLog)
      console.log(
        `[DEV] Ollama request failed after ${elapsed}ms -> code: ${err.code}, message: ${err.message}`
      );

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
  if (env.devLog)
    console.log(
      `[DEV] Ollama responded in ${elapsed}ms -> eval_count: ${response.data.eval_count}, prompt_eval_count: ${response.data.prompt_eval_count}`
    );

  const parsed = safeJsonParse(response.data.response);

  if (!parsed) {
    throw new Error('Invalid JSON received from Ollama');
  }

  return parsed;
};
