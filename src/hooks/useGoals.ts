import { useState, useEffect, useCallback } from 'react';
import goalService from '../services/goalService';
import { Goal } from '../../api/models/goalModel';

interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal, goalId: number) => Promise<void>;
  deleteGoal: (goalId: number) => Promise<void>;
}


const useGoals = (): UseGoalsReturn => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedGoals = await goalService.getGoals();
      setGoals(fetchedGoals);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = useCallback(async (goal: Goal) => {
    if (!goal.type || !goal.target || !goal.timeframe || goal.target <= 0) {
      throw new Error('All fields are required and target must be greater than zero.');
    }
    try {
      await goalService.createGoal(goal);
      fetchGoals();
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, [fetchGoals]);

  const updateGoal = useCallback(async (goal: Goal, goalId: number) => {
    if (!goal.type || !goal.target || !goal.timeframe || goal.target <= 0) {
      throw new Error('All fields are required and target must be greater than zero.');
    }
    try {
      await goalService.updateGoal(goal, goalId);
      fetchGoals();
    } catch (error: any) {
      setError(error.message);
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        throw error;
      }
      throw error;
    }
  }, [fetchGoals]);

  const deleteGoal = useCallback(async (goalId: number) => {
    try {
      await goalService.deleteGoal(goalId);
      fetchGoals();
    } catch (error: any) {
      setError(error.message);
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        throw error;
      }
      throw error;
    }
  }, [fetchGoals]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, loading, error, fetchGoals, createGoal, updateGoal, deleteGoal };
};

export { useGoals };
```