export const buildNutritionPrompt = (meal) => {
  return `
Analyze this meal and estimate nutrition values.

Meal:
${meal}

Rules:
- Return ONLY valid JSON
- No markdown
- Use realistic Indian serving sizes
- All values must be numeric

Schema:
{
  "meal_data": "string",
  "total_calories": number,
  "carbs_percent": number,
  "protein_percent": number,
  "fat_percent": number,
  "fibre_percent": number,
  "sugar_g": number,
  "sodium_mg": number,
  "water_ml": number
}
`;
};