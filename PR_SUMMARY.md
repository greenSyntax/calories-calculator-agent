# PR Summary — Image-Based Meal Analysis

## What changed

Extended `POST /meal/analyze` to support two input types controlled by a new `meal_media_type` field.

| `meal_media_type` | Required field       | How it works                                      |
|-------------------|----------------------|---------------------------------------------------|
| `"text"`          | `meal_data` (string) | Existing text-prompt flow, unchanged              |
| `"image"`         | `meal_image_base64`  | Base64 image sent to Ollama's vision endpoint     |

## Files modified

| File | Change |
|------|--------|
| `src/validators/meal.validator.js` | Replaced flat schema with a Zod discriminated union on `meal_media_type` |
| `src/prompts/nutrition.prompt.js` | Added `buildImageNutritionPrompt()` for vision input |
| `src/services/olama.service.js` | `analyzeMeal` now routes to text or image Ollama request based on input type; strips `data:image/…;base64,` prefix automatically |
| `src/controllers/meal.controller.js` | Passes full validated object to service instead of just `meal` |
| `API_DOC.md` | New file — cURL examples and response tables for both input types |

## Response shape

Both input types return the same nutrition JSON:

```json
{
  "success": true,
  "data": {
    "meal_data": "...",
    "total_calories": 420,
    "carbs_percent": 45.0,
    "protein_percent": 22.0,
    "fat_percent": 28.0,
    "fibre_percent": 5.0,
    "sugar_g": 21.5,
    "sodium_mg": 380.0,
    "water_ml": 245.0
  }
}
```

## Note

Image analysis requires a vision-capable Ollama model (e.g. `llava`, `moondream`). Update `OLLAMA_MODEL` in `.env` when using `meal_media_type: "image"`.
