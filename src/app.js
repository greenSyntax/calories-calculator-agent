import axios from 'axios';
import express from 'express';
import { env } from './config/env.js';
import mealRoutes from './routes/meals.routes.js';

const app = express();

app.use(express.json());
app.use('/meal', mealRoutes);

app.get('/health', async (req, res) => {
  let ollamaConnected = false;
  try {
    await axios.get(`${env.ollamaBaseUrl}/api/tags`, { timeout: 3000 });
    ollamaConnected = true;
  } catch {
    ollamaConnected = false;
  }

  res.json({ status: 'ok', ollama: ollamaConnected });
});

export default app;