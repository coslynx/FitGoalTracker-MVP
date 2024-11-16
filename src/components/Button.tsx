import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface ButtonProps {
  label: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

const MyButton: React.FC<ButtonProps> = ({ label, variant = 'contained', color = 'primary', onClick, disabled = false, fullWidth = false, loading = false }) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
    >
      {loading ? <CircularProgress size={20} /> : label}
    </Button>
  );
};

export default MyButton;
```