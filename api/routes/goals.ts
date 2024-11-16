import express, { Request, Response, NextFunction } from 'express';
import goalService from '../services/goalService';
import { Goal } from '../models/goalModel';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post(
  '/goals',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goalData: Goal = req.body;
      if (!goalData.type || !goalData.target || !goalData.timeframe || goalData.target <= 0) {
        return res.status(400).json({ message: 'All fields are required and target must be greater than zero.' });
      }
      const newGoal = await goalService.createGoal(goalData);
      res.status(201).json(newGoal);
    } catch (error: any) {
      console.error('Error creating goal:', error);
      res.status(500).json({ message: 'Failed to create goal.' });
    }
  }
);

router.get(
  '/goals',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goals = await goalService.getGoals();
      res.json(goals);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ message: 'Failed to fetch goals.' });
    }
  }
);

router.put(
  '/goals/:id',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const goalId = parseInt(req.params.id, 10);
    try {
      const updatedGoalData: Goal = req.body;
      if (!updatedGoalData.type || !updatedGoalData.target || !updatedGoalData.timeframe || updatedGoalData.target <= 0) {
        return res.status(400).json({ message: 'All fields are required and target must be greater than zero.' });
      }
      const updatedGoal = await goalService.updateGoal(updatedGoalData, goalId);
      res.json(updatedGoal);
    } catch (error: any) {
      console.error('Error updating goal:', error);
      if (error.message === 'Goal not found.') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Failed to update goal.' });
      }
    }
  }
);

router.delete(
  '/goals/:id',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const goalId = parseInt(req.params.id, 10);
    try {
      await goalService.deleteGoal(goalId);
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      if (error.message === 'Goal not found.') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Failed to delete goal.' });
      }
    }
  }
);

export default router;
```