import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

interface UserLoginData {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; //This should ideally be fetched from the backend, and error handling should be added for when it's not available


class AuthService {
  async registerUser(userData: UserRegistrationData): Promise<User> {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password: hashedPassword });
      return response.data;
    } catch (error: any) {
      if(error.response){
        throw new Error(`Registration failed: ${error.response.data.message || 'An unexpected error occurred'}`);
      }
      throw new Error('Registration failed: An unexpected error occurred.');
    }
  }

  async loginUser(credentials: UserLoginData): Promise<string> {
    const { email, password } = credentials;
    if (!email || !password) {
      throw new Error('All fields are required.');
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data.token;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Login failed: ${error.response.data.message || 'Invalid credentials'} `);
      }
      throw new Error('Login failed: An unexpected error occurred.');
    }
  }

  logoutUser(): void {
    localStorage.removeItem('token');
  }

  async getUserProfile(): Promise<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated.');
    }
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        this.logoutUser();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to fetch user profile. Please try again later.');
    }
  }


  async updateUserProfile(userData: User): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated.');
    }
    try {
      await axios.put(`${API_URL}/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        this.logoutUser();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to update user profile. Please try again later.');
    }
  }
}

export default new AuthService();

```