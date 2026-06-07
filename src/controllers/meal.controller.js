import {
  mealRequestSchema,
  nutritionResponseSchema
} from '../validators/meal.validator.js';

import { analyzeMeal } from '../services/olama.service.js';
import { env } from '../config/env.js';

export const analyzeMealController = async (req, res) => {
  if (env.devLog) console.log('[DEV] Accepting Request ->', req.body);

  try {
    const validation = mealRequestSchema.safeParse(req.body);

    if (!validation.success) {
      console.log('[LLM_ERROR]', JSON.stringify({ success: false, error: validation.error.errors }, null, 2));
      return res.status(400).json({
        success: false,
        error: validation.error.errors
      });
    }

    const result = await analyzeMeal(validation.data);

    const nutritionValidation =
      nutritionResponseSchema.safeParse(result);

    if (!nutritionValidation.success) {
      if (env.devLog) console.log('[DEV] Failure from LLM -> Invalid nutrition schema', nutritionValidation.error.errors);
      return res.status(500).json({
        success: false,
        error: 'Invalid nutrition response from AI'
      });
    }

    if (env.devLog) console.log('[DEV] Success from LLM ->', result);
    console.log('[LLM_SUCCESS]', JSON.stringify({ success: true, data: result }, null, 2));
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (env.devLog) console.log('[DEV] Failure from LLM ->', error.message);
    console.log('[LLM_ERROR]', JSON.stringify({ success: false, error: error.message }, null, 2));
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};