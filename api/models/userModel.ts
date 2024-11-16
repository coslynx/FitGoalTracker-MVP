import bcrypt from 'bcrypt';

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  hashedPassword: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserModel {
  static async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Failed to hash password: ${error}`);
    }
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Failed to compare password: ${error}`);
    }
  }

  static validateUserData(userData: UserRegistrationData): void {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Name, email, and password are required.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      throw new Error('Invalid email format.');
    }
  }
  
  static validateLoginData(loginData: UserLoginData): void {
    if (!loginData.email || !loginData.password) {
      throw new Error('Email and password are required.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      throw new Error('Invalid email format.');
    }
  }


}
```