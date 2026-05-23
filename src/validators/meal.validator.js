import { z } from 'zod';

export const mealRequestSchema = z.object({
  meal: z.string().min(2)
});

export const nutritionResponseSchema = z.object({
  meal_data: z.string(),
  total_calories: z.number(),
  carbs_percent: z.number(),
  protein_percent: z.number(),
  fat_percent: z.number(),
  fibre_percent: z.number(),
  sugar_g: z.number(),
  sodium_mg: z.number(),
  water_ml: z.number()
});