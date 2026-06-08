# Technical Document — Calories Calculator Agent

**Version:** 1.0.0
**Author:** Abhishek Ravi
**License:** MIT

---

## 1. Overview

Calories Calculator Agent is a REST API service that accepts a meal — either as a plain-text description or a food image — and returns structured nutrition data. It runs a local LLM via [Ollama](https://ollama.com) so no external AI API calls or internet access are required at inference time. Designed to run on a Raspberry Pi and integrate with iOS clients.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| LLM Runtime | Ollama (local) |
| Text Model | `qwen2.5:3b-instruct-q4_K_M` |
| Vision Model | `llava` |
| Validation | Zod |
| HTTP Client | Axios |
| Config | dotenv |

---

## 3. Project Structure

```
src/
├── server.js                 # HTTP server bootstrap
├── app.js                    # Express app, middleware, routes
├── config/
│   └── env.js                # Environment variable loader
├── routes/
│   └── meals.routes.js       # POST /meal/analyze
├── controllers/
│   └── meal.controller.js    # Request/response validation, orchestration
├── services/
│   └── olama.service.js      # Ollama API calls (text + vision)
├── prompts/
│   └── nutrition.prompt.js   # Text and image prompt builders
├── validators/
│   └── meal.validator.js     # Zod schemas (request + nutrition response)
└── utils/
    ├── logger.util.js        # File logger (logs.txt)
    └── json.util.js          # Safe JSON parse helper
```

---

## 4. Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `OLLAMA_BASE_URL` | Ollama base URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | Text model name | `qwen2.5:3b-instruct-q4_K_M` |
| `OLLAMA_VISION_MODEL` | Vision model name | `llava` |
| `DEV_LOG` | Enable verbose console logs | `true` |

---

## 5. API Reference

### `GET /health`

Returns server status and model availability.

```json
{
  "status": "ok",
  "text_model_status": true,
  "vision_model_status": false
}
```

---

### `POST /meal/analyze`

Analyzes a meal and returns nutrition data.

**Text input**
```json
{
  "meal_media_type": "text",
  "meal_data": "2 scrambled eggs and toast"
}
```

**Image input**
```json
{
  "meal_media_type": "image",
  "meal_image_base64": "<base64-encoded-image>"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "meal_data": "string",
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

---

## 6. Request Flow

```
Client → Logging Middleware → Router → Controller → Service → Ollama
                                          │
                              Zod validates request body
                              Zod validates LLM response
```

- **Text:** prompt sent to `OLLAMA_MODEL` via `/api/generate`
- **Image:** base64 image + prompt sent to `OLLAMA_VISION_MODEL` via `/api/generate` with `images[]`
- Timeout: **60s** for text, **180s** for vision

---

## 7. Logging

All activity is appended to `logs.txt` at the project root.

```
[2026-06-07T10:30:00.000Z] REQUEST  POST /meal/analyze
media_type : text
Payload    : {"meal_media_type":"text","meal_data":"..."}

[2026-06-07T10:30:04.512Z] RESPONSE POST /meal/analyze 200 (4512ms)
media_type : text
Payload    : {"success":true,"data":{...}}
---
text_model   : qwen2.5:3b-instruct-q4_K_M — running
vision_model : llava — unavailable
```

- Base64 image data is masked as `<BASE_64_ENCODED>`
- Null fields are stripped
- Error logs include message and stack trace
- Model status is checked after every request (non-blocking)

---

## 8. Error Handling

| Scenario | Status |
|---|---|
| Invalid `meal_media_type` or missing fields | 400 |
| Ollama unreachable | 500 |
| Ollama timeout | 500 |
| LLM returns malformed JSON | 500 |
| LLM response fails nutrition schema | 500 |

---

## 9. Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill env
cp .env.example .env

# 3. Pull models
ollama pull qwen2.5:3b-instruct-q4_K_M
ollama pull llava

# 4. Start
npm run dev      # development
npm start        # production
```
