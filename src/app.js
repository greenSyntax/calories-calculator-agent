import axios from 'axios';
import express from 'express';
import { env } from './config/env.js';
import mealRoutes from './routes/meals.routes.js';
import { logRequest, logResponse, logError, logModelStatus } from './utils/logger.util.js';

const app = express();

app.use(express.json({ limit: '50mb' }));

const isModelAvailable = async (modelName) => {
  try {
    const { data } = await axios.get(`${env.ollamaBaseUrl}/api/tags`, { timeout: 3000 });
    return data.models?.some((m) => m.name === modelName) ?? false;
  } catch {
    return false;
  }
};

app.use((req, res, next) => {
  const start = Date.now();
  const route = req.path; // capture now — Express strips the mount prefix once inside a sub-router
  const mediaType = req.body?.meal_media_type ?? 'N/A';
  req._logStart = start;
  logRequest(req.method, route, req.body);

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    logResponse(req.method, route, res.statusCode, mediaType, Date.now() - start, data);
    return originalJson(data);
  };

  // Runs after response is sent — no added latency for the client
  res.on('finish', async () => {
    const [textStatus, visionStatus] = await Promise.all([
      isModelAvailable(env.ollamaModel),
      isModelAvailable(env.ollamaVisionModel)
    ]);
    logModelStatus(env.ollamaModel, textStatus, env.ollamaVisionModel, visionStatus);
  });

  next();
});

app.use('/meal', mealRoutes);

app.get('/health', async (req, res) => {
  const [text_model_status, vision_model_status] = await Promise.all([
    isModelAvailable(env.ollamaModel),
    isModelAvailable(env.ollamaVisionModel)
  ]);

  res.json({
    status: 'ok',
    text_model_status,
    vision_model_status
  });
});

// Global error handler — logs to logs.txt before responding
app.use((err, req, res, next) => {
  const elapsed = req._logStart ? Date.now() - req._logStart : 0;
  logError(req.method, req.originalUrl, elapsed, err);
  res.status(500).json({ success: false, error: err.message });
});

export default app;
