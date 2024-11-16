export interface Goal {
  id?: number;
  userId: number;
  type: string;
  target: number;
  timeframe: string;
  currentValue: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export function validateGoal(goal: Goal): void {
  if (!goal.userId || typeof goal.userId !== 'number') {
    throw new Error('User ID is required and must be a number.');
  }
  if (!goal.type || typeof goal.type !== 'string' || goal.type.trim() === '') {
    throw new Error('Goal type is required and cannot be empty.');
  }
  if (!goal.target || typeof goal.target !== 'number' || goal.target <= 0) {
    throw new Error('Target value is required and must be a positive number.');
  }
  if (!goal.timeframe || typeof goal.timeframe !== 'string' || goal.timeframe.trim() === '') {
    throw new Error('Timeframe is required and cannot be empty.');
  }
  if (!goal.currentValue || typeof goal.currentValue !== 'number' || goal.currentValue < 0) {
    throw new Error('Current value is required and must be a non-negative number.');
  }
  if (goal.currentValue > goal.target) {
    throw new Error('Current value cannot exceed the target value.');
  }

}
```