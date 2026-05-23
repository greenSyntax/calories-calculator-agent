import {
  mealRequestSchema,
  nutritionResponseSchema
} from '../validators/meal.validator.js';

import { analyzeMeal } from '../services/olama.service.js';

export const analyzeMealController = async (req, res) => {
  try {
    const validation = mealRequestSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors
      });
    }

    const { meal } = validation.data;

    const result = await analyzeMeal(meal);

    const nutritionValidation =
      nutritionResponseSchema.safeParse(result);

    if (!nutritionValidation.success) {
      return res.status(500).json({
        success: false,
        error: 'Invalid nutrition response from AI'
      });
    }

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};