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

export const buildImageNutritionPrompt = () => {
  return `
Analyze the meal shown in this image and estimate nutrition values.

Rules:
- Identify all visible food items
- Return ONLY valid JSON
- No markdown
- Use realistic Indian serving sizes
- All values must be numeric
- Set meal_data to a short description of what you see

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
