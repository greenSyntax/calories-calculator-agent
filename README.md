# Broco Meal Analyzer Agent Service

AI-powered meal nutrition analysis API using Node.js, Express, Ollama, and Qwen2.5 running locally on Raspberry Pi.

The API accepts meal descriptions in plain English and returns structured nutrition data in JSON format.

---

# Features

- AI-powered meal analysis
- Nutrition estimation
- JSON-only structured responses
- Ollama local inference
- Qwen2.5 model integration
- Request validation using Zod
- Clean architecture
- Raspberry Pi compatible
- Lightweight deployment
- Easy iOS integration

---

# Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js |
| Framework | Express.js |
| AI Runtime | Ollama |
| AI Model | Qwen2.5 3B |
| Validation | Zod |
| HTTP Client | Axios |

---

# Recommended Hardware

- Raspberry Pi 5
- 8GB RAM
- Raspberry Pi OS 64-bit
- SSD recommended
- Active cooling recommended

---

# Project Structure

```text
meal-ai-api/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── routes/
│   │   └── meal.routes.js
│   │
│   ├── controllers/
│   │   └── meal.controller.js
│   │
│   ├── services/
│   │   └── ollama.service.js
│   │
│   ├── prompts/
│   │   └── nutrition.prompt.js
│   │
│   ├── validators/
│   │   └── meal.validator.js
│   │
│   ├── utils/
│   │   └── json.util.js
│   │
│   └── config/
│       └── env.js
│
├── package.json
├── .env
└── README.md
```

---

# Install Ollama

Install Ollama:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verify installation:

```bash
ollama --version
```

---

# Pull AI Model

Pull Qwen2.5 model:

```bash
ollama pull qwen2.5:3b-instruct-q4_K_M
```

---

# Start Ollama

```bash
ollama serve
```

OR

```bash
sudo systemctl start ollama
```

---

# Setup Project

Clone repository:

```bash
git clone <your-repo-url>
```

Go to project directory:

```bash
cd meal-ai-api
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create `.env` file:

```env
PORT=3000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b-instruct-q4_K_M
```

---

# Run Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

# API Endpoint

## Analyze Meal

### Request

```http
POST /meal/analyze
```

### Request Body

```json
{
  "meal": "3 Roti, small portion of aloo beans, 8g protein yogurt, 1 cucumber"
}
```

---

# Example Response

```json
{
  "success": true,
  "data": {
    "meal_data": "3 rotis with aloo beans curry, yogurt and cucumber",
    "total_calories": 540,
    "carbs_percent": 56,
    "protein_percent": 18,
    "fat_percent": 22,
    "fibre_percent": 4,
    "sugar_g": 8,
    "sodium_mg": 620,
    "water_ml": 310
  }
}
```

---

# cURL Example

```bash
curl --location 'http://localhost:3000/meal/analyze' \
--header 'Content-Type: application/json' \
--data '{
    "meal": "3 Roti, small portion of aloo beans, 8g protein yogurt, 1 cucumber"
}'
```

---

# How It Works

```text
Client Request
      |
      v
Express API
      |
      v
Prompt Builder
      |
      v
Ollama API
      |
      v
Qwen2.5 Model
      |
      v
Structured JSON Response
      |
      v
API Response
```

---

# AI Prompt Strategy

The API uses:
- low temperature inference
- JSON mode
- strict nutrition prompt
- deterministic responses

Ollama request configuration:

```json
{
  "stream": false,
  "format": "json",
  "raw": true,
  "options": {
    "temperature": 0.2,
    "top_p": 0.8
  }
}
```

---

# Production Recommendations

## Recommended Improvements

### Queue System

Use:
- BullMQ
- Redis

Why:
- AI inference can be slow
- prevents request timeout
- improves scalability

---

### Caching

Cache repeated meals:

Example:

```text
2 roti dal rice
```

Benefits:
- faster responses
- reduced AI calls
- lower CPU usage

---

### Monitoring

Recommended:
- PM2
- Grafana
- Prometheus

---

### Retry Mechanism

Sometimes LLMs return malformed JSON.

Add:
- automatic retry
- JSON validation
- fallback parser

---

### Hybrid Nutrition Engine

Best architecture:

```text
Meal Text
   |
   v
LLM Food Extraction
   |
   v
Nutrition Database
   |
   v
Rule Engine
   |
   v
Final Nutrition JSON
```

Instead of:
- pure AI calorie guessing

Use:
- USDA database
- IFCT database

For higher accuracy.

---

# Raspberry Pi Optimization

## Increase Swap Memory

Edit:

```bash
sudo nano /etc/dphys-swapfile
```

Update:

```text
CONF_SWAPSIZE=4096
```

Restart:

```bash
sudo systemctl restart dphys-swapfile
```

---

# Useful Ollama Commands

List models:

```bash
ollama list
```

Remove model:

```bash
ollama rm qwen2.5:3b-instruct-q4_K_M
```

Run model manually:

```bash
ollama run qwen2.5:3b-instruct-q4_K_M
```

---

# Performance Expectations

| Metric | Approximate |
|---|---|
| First Response | 5–10 sec |
| Warm Response | 2–5 sec |
| RAM Usage | 3–4 GB |
| Concurrent Requests | 1–2 |

---

# Known Limitations

- Nutrition values are estimates
- Portion size assumptions may vary
- Oil/butter usage may not be fully accurate
- AI responses are probabilistic

Expected variance:
- ±15–25%

---

# Future Improvements

- Meal image analysis
- Voice meal input
- User meal history
- Macro tracking
- AI personalization
- Fine-tuned Indian nutrition model
- Redis caching
- Queue workers
- Docker deployment
- Kubernetes deployment

---

# License

MIT