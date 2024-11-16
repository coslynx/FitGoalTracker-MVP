import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  onChange: (value: string) => void;
  value?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ label, type = 'text', placeholder, onChange, value = '', error, helperText, fullWidth = false }) => {
  return (
    <TextField
      label={label}
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      error={!!error}
      helperText={error || helperText}
      fullWidth={fullWidth}
    />
  );
};

export default Input;

```