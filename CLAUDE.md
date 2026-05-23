# CLAUDE.md

## Project Overview

Express.js API service that accepts plain-English meal descriptions and returns structured nutrition data via a locally-running Ollama LLM (Qwen2.5). Designed to run on Raspberry Pi and integrate with iOS clients.

## Commands

```bash
npm run dev    # development with nodemon
npm start      # production
```

## Architecture

```
src/
├── app.js                    # Express app, route mounting
├── server.js                 # HTTP server bootstrap
├── config/env.js             # Env var loading (dotenv)
├── routes/meals.routes.js    # POST /meal/analyze
├── controllers/
│   └── meal.controller.js    # Validates request + response, delegates to service
├── services/
│   └── olama.service.js      # Axios call to Ollama /api/generate
├── prompts/
│   └── nutrition.prompt.js   # Builds the LLM prompt
├── validators/
│   └── meal.validator.js     # Zod schemas for request and nutrition response
└── utils/
    └── json.util.js          # Safe JSON parse helper
```

## Environment Variables

```env
PORT=3000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b-instruct-q4_K_M
```

Copy `.env.example` to `.env` and fill in values before running.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns `{ status, ollama }` — `ollama` is a live reachability check |
| POST | `/meal/analyze` | Accepts `{ meal: string }`, returns structured nutrition JSON |

## Key Decisions

- **ESM (`"type": "module"`)** — all imports use `.js` extensions.
- **Ollama model config** is runtime via env vars; no hardcoded model names in service code.
- **Zod validates both directions** — request body and the AI response, so malformed LLM output is caught before it reaches the client.
- **Health check hits `/api/tags`** on Ollama (lightweight list endpoint) with a 3-second timeout to avoid blocking.
- **Temperature 0.2 / top_p 0.8** keeps nutrition estimates deterministic.
