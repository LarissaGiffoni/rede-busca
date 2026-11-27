import { Router } from 'express';
import { login, me, register } from './auth.controller';
import { authenticate } from './auth.middleware';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/me', authenticate, me);

export default authRoutes;
