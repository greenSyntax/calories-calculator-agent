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
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (env.devLog) console.log('[DEV] Failure from LLM ->', error.message);
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};