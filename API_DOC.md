# API Documentation

Base URL: `http://localhost:3000`

---

## GET /health

Returns service status and Ollama reachability.

**cURL**

```bash
curl http://localhost:3000/health
```

**Response — Ollama reachable**

```json
{
  "status": "ok",
  "ollama": true
}
```

**Response — Ollama unreachable**

```json
{
  "status": "ok",
  "ollama": false
}
```

---

## POST /meal/analyze

Accepts a meal as plain text or a base64-encoded image and returns structured nutrition data.

---

### Text input

**cURL**

```bash
curl -X POST http://localhost:3000/meal/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "meal_media_type": "text",
    "meal_data": "2 scrambled eggs with whole wheat toast and a glass of orange juice"
  }'
```

**Request body**

| Field            | Type   | Required | Description                              |
|------------------|--------|----------|------------------------------------------|
| meal_media_type  | string | Yes      | Must be `"text"`                         |
| meal_data        | string | Yes      | Plain-English description (min 2 chars)  |

---

### Image input

**cURL**

```bash
curl -X POST http://localhost:3000/meal/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "meal_media_type": "image",
    "meal_image_base64": "/9j/4AAQSkZJRgAB..."
  }'
```

The `meal_image_base64` value must be a base64-encoded image. A data-URL prefix (`data:image/jpeg;base64,`) is accepted and stripped automatically.

**Request body**

| Field              | Type   | Required | Description                                      |
|--------------------|--------|----------|--------------------------------------------------|
| meal_media_type    | string | Yes      | Must be `"image"`                                |
| meal_image_base64  | string | Yes      | Base64-encoded image of the meal (JPEG/PNG/etc.) |

---

### Success response — 200 (both types)

```json
{
  "success": true,
  "data": {
    "meal_data": "2 scrambled eggs, 1 slice whole wheat toast, 240ml orange juice",
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

**Response fields**

| Field            | Type   | Description                              |
|------------------|--------|------------------------------------------|
| meal_data        | string | Normalized description of the meal       |
| total_calories   | number | Total estimated calories (kcal)          |
| carbs_percent    | number | Carbohydrates as % of total calories     |
| protein_percent  | number | Protein as % of total calories           |
| fat_percent      | number | Fat as % of total calories               |
| fibre_percent    | number | Dietary fibre as % of total calories     |
| sugar_g          | number | Total sugar in grams                     |
| sodium_mg        | number | Sodium in milligrams                     |
| water_ml         | number | Estimated water content in millilitres   |

---

### Error response — 400 (invalid request)

Returned when `meal_media_type` is missing or a required field for the chosen type is absent.

```json
{
  "success": false,
  "error": [
    {
      "code": "invalid_union_discriminator",
      "options": ["text", "image"],
      "path": ["meal_media_type"],
      "message": "Invalid discriminator value. Expected 'text' | 'image'"
    }
  ]
}
```

### Error response — 500 (LLM parse failure)

```json
{
  "success": false,
  "error": "Invalid nutrition response from AI"
}
```

### Error response — 500 (service error)

```json
{
  "success": false,
  "error": "Unable to reach Ollama. Make sure the service is running."
}
```
