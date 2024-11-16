import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { Goal } from '../../api/models/goalModel';

interface GoalProgressChartProps {
  goals: Goal[];
  chartType?: 'bar' | 'line' | 'pie';
  height?: number;
}

const GoalProgressChart: React.FC<GoalProgressChartProps> = ({ goals, chartType = 'bar', height = 300 }) => {
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    if (!goals || goals.length === 0) {
      return;
    }

    const canvas = document.getElementById('goalProgressChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found for GoalProgressChart');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context for GoalProgressChart canvas');
      return;
    }


    const labels = goals.map((goal) => goal.type);
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Progress',
          data: goals.map((goal) => (goal.currentValue / goal.target) * 100),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const config: any = {
      type: chartType,
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Goal Progress',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    };

    const newChart = new Chart(ctx, config);
    setChart(newChart);

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [goals, chartType, height]);

  return (
    <div>
      {goals.length === 0 && <p>No goals set yet.</p>}
      {goals.length > 0 && <canvas id="goalProgressChart" height={height} />}
    </div>
  );
};

export default GoalProgressChart;
```