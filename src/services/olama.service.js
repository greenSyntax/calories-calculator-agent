import axios from 'axios';

import { env } from '../config/env.js';
import { buildNutritionPrompt } from '../prompts/nutrition.prompt.js';
import { safeJsonParse } from '../utils/json.util.js';

export const analyzeMeal = async (meal) => {
  const prompt = buildNutritionPrompt(meal);

  const response = await axios.post(
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

  const parsed = safeJsonParse(response.data.response);

  if (!parsed) {
    throw new Error('Invalid JSON received from Ollama');
  }

  return parsed;
};