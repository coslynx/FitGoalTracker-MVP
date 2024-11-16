import express, { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { User, UserLoginData, UserRegistrationData } from '../models/userModel';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const userData: UserRegistrationData = req.body;
        const newUser: User = await authService.registerUser(userData);
        res.status(201).json({ user: {id: newUser.id, name: newUser.name} });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const credentials: UserLoginData = req.body;
        const token: string = await authService.loginUser(credentials);
        res.json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
});

router.get('/profile', verifyToken, async (req: Request, res: Response) => {
    try {
        const user: User = await authService.getUserProfile();
        res.json(user);
    } catch (error: any) {
        res.status(error.status || 401).json({ message: error.message });
    }
});

router.put('/profile', verifyToken, async (req: Request, res: Response) => {
    try {
        const userData: User = req.body;
        await authService.updateUserProfile(userData);
        res.json({ message: 'Profile updated successfully' });
    } catch (error: any) {
        res.status(error.status || 400).json({ message: error.message });
    }
});

export default router;

```