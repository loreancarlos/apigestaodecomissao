import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', authController.login);
authRoutes.post('/change-password', authMiddleware, authController.changePassword);
authRoutes.post('/admin/reset-password', authMiddleware, adminMiddleware, authController.adminResetPassword);

export { authRoutes };