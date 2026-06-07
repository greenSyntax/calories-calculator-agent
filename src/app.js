import axios from 'axios';
import express from 'express';
import { env } from './config/env.js';
import mealRoutes from './routes/meals.routes.js';
import { logRequest, logResponse, logError } from './utils/logger.util.js';

const app = express();

app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const route = req.path; // capture now — Express strips the mount prefix once inside a sub-router
  req._logStart = start;
  logRequest(req.method, route, req.body);

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    logResponse(req.method, route, Date.now() - start, data);
    return originalJson(data);
  };

  next();
});

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

// Global error handler — logs to logs.txt before responding
app.use((err, req, res, next) => {
  const elapsed = req._logStart ? Date.now() - req._logStart : 0;
  logError(req.method, req.originalUrl, elapsed, err);
  res.status(500).json({ success: false, error: err.message });
});

export default app;