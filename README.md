# Broco Meal Analyzer Agent Service

AI-powered meal nutrition analysis API using Node.js, Express, Ollama, and Qwen2.5 running locally on Raspberry Pi.

The API accepts a meal as plain text or a food image and returns structured nutrition data in JSON format.

---

# Features

- AI-powered meal analysis (text and image)
- Vision model support (LLaVA)
- Nutrition estimation
- JSON-only structured responses
- Ollama local inference
- Qwen2.5 text model + LLaVA vision model
- Request validation using Zod
- Request / response logging to `logs.txt`
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
| Text Model | Qwen2.5 3B |
| Vision Model | LLaVA |
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

# Pull AI Models

Pull text model:

```bash
ollama pull qwen2.5:3b-instruct-q4_K_M
```

Pull vision model (required for image analysis):

```bash
ollama pull llava
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
OLLAMA_VISION_MODEL=llava
DEV_LOG=True
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

# Docker

## First-Time Setup

**1. Build the image:**

```bash
docker build -t calories-calculator-agent .
```

**2. Create a `.env` file** (if not already):

```env
PORT=3000
OLLAMA_BASE_URL=http://host-gateway:11434
OLLAMA_MODEL=qwen2.5:3b-instruct-q4_K_M
OLLAMA_VISION_MODEL=llava
DEV_LOG=True
```

> `host-gateway` lets the container reach Ollama running on the host machine. Used in the `docker run` command below via `--add-host`.

**3. Run the container:**

```bash
docker run -d \
  --name calories-calculator-agent \
  --add-host=host-gateway:host-gateway \
  --env-file .env \
  -p 3000:3000 \
  calories-calculator-agent
```

**4. Verify it's running:**

```bash
docker ps
curl http://localhost:3000/health
```

> **Build error `tls: bad record MAC`?** This is a network/TLS corruption during image pull — not a code issue. Run `docker build` again; it resolves on retry.

---

## Update and Re-run

After making code changes, rebuild and restart:

**1. Stop and remove the old container:**

```bash
docker stop calories-calculator-agent
docker rm calories-calculator-agent
```

**2. Rebuild the image:**

```bash
docker build -t calories-calculator-agent .
```

**3. Run the new container:**

```bash
docker run -d \
  --name calories-calculator-agent \
  --add-host=host-gateway:host-gateway \
  --env-file .env \
  -p 3000:3000 \
  calories-calculator-agent
```

---

## Run via Docker Hub

### Push Image to Docker Hub

**1. Login to Docker Hub:**

```bash
docker login
```

**2. Build the image with your Docker Hub tag:**

```bash
docker build -t abhix09/calories-calculator-agent:latest .
```

**3. Push the image:**

```bash
docker push abhix09/calories-calculator-agent:latest
```

---

### Pull and Run from Docker Hub

**1. Pull the image on your VM / Raspberry Pi:**

```bash
docker pull abhix09/calories-calculator-agent:latest
```

**2. Create a `.env` file:**

```env
PORT=3000
OLLAMA_BASE_URL=http://host-gateway:11434
OLLAMA_MODEL=qwen2.5:3b-instruct-q4_K_M
OLLAMA_VISION_MODEL=llava
DEV_LOG=True
```

**3. Run the container:**

```bash
docker run -d \
  --name calories-calculator-agent \
  --add-host=host-gateway:host-gateway \
  --env-file .env \
  -p 3000:3000 \
  abhix09/calories-calculator-agent:latest
```

**4. Verify:**

```bash
curl http://localhost:3000/health
```

---

### Push a New Version

When you update the code, tag with a version before pushing:

```bash
docker build -t abhix09/calories-calculator-agent:v1.0.1 .
docker push abhix09/calories-calculator-agent:v1.0.1

# Also update latest
docker tag abhix09/calories-calculator-agent:v1.0.1 abhix09/calories-calculator-agent:latest
docker push abhix09/calories-calculator-agent:latest
```

---

## Useful Docker Commands

View live logs:

```bash
docker logs -f calories-calculator-agent
```

Stop the container:

```bash
docker stop calories-calculator-agent
```

Remove the container:

```bash
docker rm calories-calculator-agent
```

Remove the image:

```bash
docker rmi calories-calculator-agent
```

---

# API Endpoints

## Health Check

```http
GET /health
```

### Response

```json
{
  "status": "ok",
  "text_model_status": true,
  "vision_model_status": true
}
```

`text_model_status` and `vision_model_status` are `true` when the respective model is pulled and available in Ollama.

---

## Analyze Meal

### Request

```http
POST /meal/analyze
```

### Request Body — Text

```json
{
  "meal_media_type": "text",
  "meal_data": "3 Roti, small portion of aloo beans, 8g protein yogurt, 1 cucumber"
}
```

### Request Body — Image

```json
{
  "meal_media_type": "image",
  "meal_image_base64": "<base64-encoded-image>"
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

**Text:**
```bash
curl --location 'http://localhost:3000/meal/analyze' \
--header 'Content-Type: application/json' \
--data '{
    "meal_media_type": "text",
    "meal_data": "3 Roti, small portion of aloo beans, 8g protein yogurt, 1 cucumber"
}'
```

**Image:**
```bash
curl --location 'http://localhost:3000/meal/analyze' \
--header 'Content-Type: application/json' \
--data '{
    "meal_media_type": "image",
    "meal_image_base64": "<base64-encoded-image>"
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

# Test Ollama with cURL

Check if Ollama is reachable:

```bash
curl http://localhost:11434/api/tags
```

Expected response — a list of locally available models:

```json
{
  "models": [
    {
      "name": "qwen2.5:3b-instruct-q4_K_M",
      "model": "qwen2.5:3b-instruct-q4_K_M",
      "size": 2019393189,
      "digest": "..."
    }
  ]
}
```

Run a quick generate to confirm the model responds:

```bash
curl http://localhost:11434/api/generate \
--header 'Content-Type: application/json' \
--data '{
  "model": "qwen2.5:3b-instruct-q4_K_M",
  "prompt": "Say hello.",
  "stream": false
}'
```

Expected response:

```json
{
  "model": "qwen2.5:3b-instruct-q4_K_M",
  "response": "Hello! How can I assist you today?",
  "done": true
}
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