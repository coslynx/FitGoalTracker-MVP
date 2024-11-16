import authService from '../services/authService';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { expect } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('AuthService', () => {
  describe('registerUser', () => {
    it('should successfully register a user', async () => {
      const mockUserData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      mockedAxios.post.mockResolvedValue({ data: mockUser });

      const registeredUser = await authService.registerUser(mockUserData);
      expect(registeredUser).toEqual(mockUser);
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/register', { name: 'Test User', email: 'test@example.com', password: expect.any(String) });
    });

    it('should return an error for missing fields', async () => {
      const mockUserData = { name: '', email: '', password: '' };
      await expect(authService.registerUser(mockUserData)).rejects.toThrow('All fields are required.');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
    it('should return an error for existing email', async () => {
        const mockUserData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
        mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Email already exists' }, status: 400 } });
        await expect(authService.registerUser(mockUserData)).rejects.toThrow('Registration failed: Email already exists');
        expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/register', { name: 'Test User', email: 'test@example.com', password: expect.any(String) });
    });

    it('should handle unexpected errors', async () => {
      const mockUserData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      mockedAxios.post.mockRejectedValue(new Error('Network error'));
      await expect(authService.registerUser(mockUserData)).rejects.toThrow('Registration failed: Network error');
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/register', { name: 'Test User', email: 'test@example.com', password: expect.any(String) });
    });
  });

  describe('loginUser', () => {
    it('should successfully login a user', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      const mockToken = 'mockToken';
      mockedAxios.post.mockResolvedValue({ data: { token: mockToken } });

      const token = await authService.loginUser(mockCredentials);
      expect(token).toBe(mockToken);
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/login', { email: 'test@example.com', password: 'password123' });
    });

    it('should return an error for invalid credentials', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'wrongpassword' };
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' }, status: 401 } });
      await expect(authService.loginUser(mockCredentials)).rejects.toThrow('Login failed: Invalid credentials');
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/login', { email: 'test@example.com', password: 'wrongpassword' });
    });

    it('should handle unexpected errors', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      mockedAxios.post.mockRejectedValue(new Error('Network error'));
      await expect(authService.loginUser(mockCredentials)).rejects.toThrow('Login failed: Network error');
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/login', { email: 'test@example.com', password: 'password123' });
    });
  });

  describe('logoutUser', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'mockToken');
      authService.logoutUser();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('getUserProfile', () => {
    it('should successfully get user profile', async () => {
      const mockToken = 'mockToken';
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('token', mockToken);
      mockedAxios.get.mockResolvedValue({ data: mockUser });

      const user = await authService.getUserProfile();
      expect(user).toEqual(mockUser);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/profile', { headers: { Authorization: `Bearer ${mockToken}` } });
    });

    it('should return an error if not authenticated', async () => {
      await expect(authService.getUserProfile()).rejects.toThrow('Not authenticated.');
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should return an error if session expired', async () => {
      const mockToken = 'mockToken';
      localStorage.setItem('token', mockToken);
      mockedAxios.get.mockRejectedValue({ response: { status: 401 } });
      await expect(authService.getUserProfile()).rejects.toThrow('Session expired. Please login again.');
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/profile', { headers: { Authorization: `Bearer ${mockToken}` } });
    });

    it('should handle unexpected errors', async () => {
      const mockToken = 'mockToken';
      localStorage.setItem('token', mockToken);
      mockedAxios.get.mockRejectedValue(new Error('Network error'));
      await expect(authService.getUserProfile()).rejects.toThrow('Failed to fetch user profile. Please try again later.');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/profile', { headers: { Authorization: `Bearer ${mockToken}` } });
    });
  });

  describe('updateUserProfile', () => {
    it('should successfully update user profile', async () => {
      const mockToken = 'mockToken';
      const mockUserData = { id: 1, name: 'Updated User', email: 'updated@example.com' };
      localStorage.setItem('token', mockToken);
      mockedAxios.put.mockResolvedValue({});

      await authService.updateUserProfile(mockUserData);
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/profile', mockUserData, { headers: { Authorization: `Bearer ${mockToken}` } });
    });
    it('should return an error if not authenticated', async () => {
      const mockUserData = { id: 1, name: 'Updated User', email: 'updated@example.com' };
      await expect(authService.updateUserProfile(mockUserData)).rejects.toThrow('Not authenticated.');
      expect(mockedAxios.put).not.toHaveBeenCalled();
    });

    it('should return an error if session expired', async () => {
      const mockToken = 'mockToken';
      const mockUserData = { id: 1, name: 'Updated User', email: 'updated@example.com' };
      localStorage.setItem('token', mockToken);
      mockedAxios.put.mockRejectedValue({ response: { status: 401 } });
      await expect(authService.updateUserProfile(mockUserData)).rejects.toThrow('Session expired. Please login again.');
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/profile', mockUserData, { headers: { Authorization: `Bearer ${mockToken}` } });
    });

    it('should handle unexpected errors', async () => {
      const mockToken = 'mockToken';
      const mockUserData = { id: 1, name: 'Updated User', email: 'updated@example.com' };
      localStorage.setItem('token', mockToken);
      mockedAxios.put.mockRejectedValue(new Error('Network error'));
      await expect(authService.updateUserProfile(mockUserData)).rejects.toThrow('Failed to update user profile. Please try again later.');
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/profile', mockUserData, { headers: { Authorization: `Bearer ${mockToken}` } });
    });
  });
});

```