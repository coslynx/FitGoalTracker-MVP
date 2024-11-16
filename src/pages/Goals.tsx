import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Container, Button } from '@mui/material';
import { useGoals } from '../hooks/useGoals';
import GoalProgressChart from '../components/GoalProgressChart';
import Input from '../components/Input';

interface Goal {
  id?: number;
  type: string;
  target: number;
  timeframe: string;
  currentValue: number;
  userId?: number;
}

const Goals: React.FC = () => {
  const { goals, createGoal, updateGoal, deleteGoal, fetchGoals, loading, error } = useGoals();
  const [newGoal, setNewGoal] = useState<Goal>({ type: '', target: 0, timeframe: '' });
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);


  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = () => {
    setIsCreatingGoal(true);
  };

  const handleSaveGoal = async () => {
    try {
      await createGoal(newGoal);
      setNewGoal({ type: '', target: 0, timeframe: '' });
      setIsCreatingGoal(false);
      fetchGoals();
    } catch (err: any) {
      console.error("Error creating goal:", err);
    }
  };

  const handleUpdateGoal = async () => {
      if (editingGoal && isEditing) {
          try {
              await updateGoal(editingGoal, isEditing);
              setIsEditing(null);
              setEditingGoal(null);
              fetchGoals();
          } catch (err: any) {
              console.error("Error updating goal:", err);
          }
      }
  };


  const handleDeleteGoal = async (id: number) => {
    try {
        await deleteGoal(id);
        fetchGoals();
    } catch (err: any) {
        console.error("Error deleting goal:", err);
    }
  };

  const handleProgressChange = async (id: number, currentValue: number) => {
    try {
      await updateGoal({...editingGoal, currentValue}, id);
      fetchGoals();
    } catch (err: any) {
      console.error("Error updating progress:", err);
    }
  };

  const handleInputChange = (field: keyof Goal, value: string | number) => {
    setNewGoal({ ...newGoal, [field]: typeof newGoal[field] === 'number' ? Number(value) : value });
  };

  const handleEditGoal = (goal: Goal) => {
    setIsEditing(goal.id);
    setEditingGoal(goal);
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Fitness Goals
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {loading && <Typography>Loading...</Typography>}
      {goals && goals.length > 0 && (
          <>
              <GoalProgressChart goals={goals} />
              {goals.map((goal) => (
                  <Box key={goal.id} mb={2} border={1} borderColor="grey.300" p={2} borderRadius={2}>
                      <Typography variant="h6">{goal.type}</Typography>
                      <Typography>Target: {goal.target}</Typography>
                      <Typography>Timeframe: {goal.timeframe}</Typography>
                      <Typography>Progress: {Math.round((goal.currentValue / goal.target) * 100)}%</Typography>
                      <Input
                          label="Current Value"
                          type="number"
                          value={goal.currentValue}
                          onChange={(e) => handleProgressChange(goal.id!, Number(e.target.value))}
                      />
                      <Box mt={2} display="flex" justifyContent="space-between">
                          <Button variant="outlined" color="primary" onClick={() => handleEditGoal(goal)}>Edit</Button>
                          <Button variant="outlined" color="error" onClick={() => handleDeleteGoal(goal.id!)}>Delete</Button>
                      </Box>
                  </Box>
              ))}
          </>
      )}
      {!isCreatingGoal && (
        <Button variant="contained" color="primary" onClick={handleCreateGoal}>
          Create New Goal
        </Button>
      )}
      {isCreatingGoal && (
        <>
          <Input label="Goal Type" type="text" value={newGoal.type} onChange={(e) => handleInputChange('type', e.target.value)} />
          <Input label="Target Value" type="number" value={newGoal.target} onChange={(e) => handleInputChange('target', e.target.value)} />
          <Input label="Timeframe" type="text" value={newGoal.timeframe} onChange={(e) => handleInputChange('timeframe', e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleSaveGoal}>Save Goal</Button>
          <Button variant="outlined" color="secondary" onClick={() => setIsCreatingGoal(false)}>Cancel</Button>
        </>
      )}
        {isEditing && (
            <>
                <Input label="Goal Type" type="text" value={editingGoal!.type} onChange={(e) => handleInputChange('type', e.target.value)} />
                <Input label="Target Value" type="number" value={editingGoal!.target} onChange={(e) => handleInputChange('target', e.target.value)} />
                <Input label="Timeframe" type="text" value={editingGoal!.timeframe} onChange={(e) => handleInputChange('timeframe', e.target.value)} />
                <Button variant="contained" color="primary" onClick={handleUpdateGoal}>Update Goal</Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditing(null)}>Cancel</Button>
            </>
        )}
    </Container>
  );
};

export default Goals;

```