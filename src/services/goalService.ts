import axios from 'axios';
import { Goal } from '../../api/models/goalModel';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class GoalService {
  async createGoal(goal: Goal): Promise<Goal> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated.');
    }
    if (!goal.type || !goal.target || !goal.timeframe || goal.target <=0 ) {
      throw new Error('All fields are required and target must be greater than zero.');
    }

    try {
      const response = await axios.post(`${API_URL}/goals`, goal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating goal:', error);
      throw new Error(`Failed to create goal: ${error.message}`);
    }
  }

  async getGoals(): Promise<Goal[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated.');
    }

    try {
      const response = await axios.get(`${API_URL}/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to fetch goals: ${error.message}`);
    }
  }

  async updateGoal(goal: Goal, goalId: number): Promise<Goal> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated.');
    }
    if (!goal.type || !goal.target || !goal.timeframe || goal.target <= 0) {
        throw new Error('All fields are required and target must be greater than zero.');
      }
    try {
      const response = await axios.put(`${API_URL}/goals/${goalId}`, goal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please log in again.');
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Goal not found.');
      }
      throw new Error(`Failed to update goal: ${error.message}`);
    }
  }

  async deleteGoal(goalId: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated.');
    }

    try {
      await axios.delete(`${API_URL}/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please log in again.');
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Goal not found.');
      }
      throw new Error(`Failed to delete goal: ${error.message}`);
    }
  }
}

export default new GoalService();

```