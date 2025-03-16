import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { userRoutes } from './user.routes.js';
import { clientRoutes } from './client.routes.js';
import { developmentRoutes } from './development.routes.js';
import { saleRoutes } from './sale.routes.js';
import { teamRoutes } from './team.routes.js';
import { leadRoutes } from './lead.routes.js';
import { businessRoutes } from './business.routes.js';
import { callModeSessionRoutes } from './callModeSession.routes.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/clients', authMiddleware, clientRoutes);
router.use('/developments', authMiddleware, developmentRoutes);
router.use('/sales', authMiddleware, saleRoutes);
router.use('/teams', authMiddleware, teamRoutes);
router.use('/leads', authMiddleware, leadRoutes);
router.use('/business', authMiddleware, businessRoutes);
router.use('/callModeSessions', authMiddleware, callModeSessionRoutes);

export { router };