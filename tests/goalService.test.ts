import { describe, it, expect, vi, beforeEach } from 'vitest';
import goalService from '../services/goalService';
import axios from 'axios';
import { Goal } from '../../api/models/goalModel';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('goalService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'mockToken');
  });

  describe('createGoal', () => {
    it('should successfully create a goal', async () => {
      const mockGoal: Goal = { userId: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 0 };
      const mockResponse: Goal = { ...mockGoal, id: 1 };
      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const createdGoal = await goalService.createGoal(mockGoal);
      expect(createdGoal).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/goals', mockGoal, { headers: { Authorization: 'Bearer mockToken' } });
    });

    it('should fail to create a goal with missing fields', async () => {
      const mockGoal: Partial<Goal> = { userId: 1, type: '', target: 10, timeframe: '1 month', currentValue: 0 };
      await expect(goalService.createGoal(mockGoal as Goal)).rejects.toThrow('All fields are required and target must be greater than zero.');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should fail to create a goal with invalid target', async () => {
      const mockGoal: Goal = { userId: 1, type: 'weight loss', target: -10, timeframe: '1 month', currentValue: 0 };
      await expect(goalService.createGoal(mockGoal)).rejects.toThrow('All fields are required and target must be greater than zero.');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
    it('should fail to create a goal with invalid token', async () => {
      localStorage.removeItem('token');
      const mockGoal: Goal = { userId: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 0 };
      await expect(goalService.createGoal(mockGoal)).rejects.toThrow('Not authenticated.');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const mockGoal: Goal = { userId: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 0 };
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'API error' }, status: 500 } });

      await expect(goalService.createGoal(mockGoal)).rejects.toThrow('Failed to create goal: API error');
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/goals', mockGoal, { headers: { Authorization: 'Bearer mockToken' } });
    });
  });

  describe('getGoals', () => {
    it('should successfully get goals', async () => {
      const mockGoals: Goal[] = [{ userId: 1, id: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 5 }];
      mockedAxios.get.mockResolvedValue({ data: mockGoals });

      const goals = await goalService.getGoals();
      expect(goals).toEqual(mockGoals);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/goals', { headers: { Authorization: 'Bearer mockToken' } });
    });

    it('should handle empty goals array', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });
      const goals = await goalService.getGoals();
      expect(goals).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/goals', { headers: { Authorization: 'Bearer mockToken' } });
    });

    it('should handle authentication errors', async () => {
      localStorage.removeItem('token');
      await expect(goalService.getGoals()).rejects.toThrow('Not authenticated.');
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 500 } });
      await expect(goalService.getGoals()).rejects.toThrow('Failed to fetch goals: An unexpected error occurred.');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/goals', { headers: { Authorization: 'Bearer mockToken' } });
    });
  });

  describe('updateGoal', () => {
    it('should successfully update a goal', async () => {
      const mockGoal: Goal = { userId: 1, id: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 5 };
      const mockUpdatedGoal: Goal = { ...mockGoal, currentValue: 7 };
      mockedAxios.put.mockResolvedValue({ data: mockUpdatedGoal });

      const updatedGoal = await goalService.updateGoal(mockUpdatedGoal, 1);
      expect(updatedGoal).toEqual(mockUpdatedGoal);
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/goals/1', mockUpdatedGoal, { headers: { Authorization: 'Bearer mockToken' } });
    });

    it('should fail to update a goal with missing fields', async () => {
        const mockGoal: Partial<Goal> = { userId: 1, id: 1, type: '', target: 10, timeframe: '1 month', currentValue: 5 };
        await expect(goalService.updateGoal(mockGoal as Goal, 1)).rejects.toThrow('All fields are required and target must be greater than zero.');
        expect(mockedAxios.put).not.toHaveBeenCalled();
      });

    it('should fail to update a goal with invalid target', async () => {
      const mockGoal: Goal = { userId: 1, id: 1, type: 'weight loss', target: -10, timeframe: '1 month', currentValue: 5 };
      await expect(goalService.updateGoal(mockGoal, 1)).rejects.toThrow('All fields are required and target must be greater than zero.');
      expect(mockedAxios.put).not.toHaveBeenCalled();
    });

    it('should handle goal not found error', async () => {
      const mockGoal: Goal = { userId: 1, id: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 5 };
      mockedAxios.put.mockRejectedValue({ response: { status: 404 } });
      await expect(goalService.updateGoal(mockGoal, 1)).rejects.toThrow('Goal not found.');
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/goals/1', mockGoal, { headers: { Authorization: 'Bearer mockToken' } });
    });
    it('should handle authentication errors', async () => {
      localStorage.removeItem('token');
      const mockGoal: Goal = { userId: 1, id: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 5 };
      await expect(goalService.updateGoal(mockGoal,1)).rejects.toThrow('Not authenticated.');
      expect(mockedAxios.put).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const mockGoal: Goal = { userId: 1, id: 1, type: 'weight loss', target: 10, timeframe: '1 month', currentValue: 5 };
      mockedAxios.put.mockRejectedValue({ response: { status: 500 } });
      await expect(goalService.updateGoal(mockGoal, 1)).rejects.toThrow('Failed to update goal: An unexpected error occurred.');
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/goals/1', mockGoal, { headers: { Authorization: 'Bearer mockToken' } });
    });
  });

  describe('deleteGoal', () => {
    it('should successfully delete a goal', async () => {
      mockedAxios.delete.mockResolvedValue({});
      await goalService.deleteGoal(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3000/goals/1', { headers: { Authorization: 'Bearer mockToken' } });
    });

    it('should handle goal not found error', async () => {
      mockedAxios.delete.mockRejectedValue({ response: { status: 404 } });
      await expect(goalService.deleteGoal(1)).rejects.toThrow('Goal not found.');
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3000/goals/1', { headers: { Authorization: 'Bearer mockToken' } });
    });
    it('should handle authentication errors', async () => {
      localStorage.removeItem('token');
      await expect(goalService.deleteGoal(1)).rejects.toThrow('Not authenticated.');
      expect(mockedAxios.delete).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      mockedAxios.delete.mockRejectedValue({ response: { status: 500 } });
      await expect(goalService.deleteGoal(1)).rejects.toThrow('Failed to delete goal: An unexpected error occurred.');
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3000/goals/1', { headers: { Authorization: 'Bearer mockToken' } });
    });
  });
});

```