import express from 'express';
import mealRoutes from './routes/meals.routes.js';

const app = express();

app.use(express.json());
app.use('/meal', mealRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;