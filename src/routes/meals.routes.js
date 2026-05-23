import express from 'express';
import { analyzeMealController } from '../controllers/meal.controller.js';

const router = express.Router();

router.post('/analyze', analyzeMealController);

export default router;