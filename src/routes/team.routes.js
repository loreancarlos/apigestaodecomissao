import { Router } from 'express';
import { TeamController } from '../controllers/team.controller.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const teamRoutes = Router();
const teamController = new TeamController();

teamRoutes.get('/', teamController.list);
teamRoutes.post('/', adminMiddleware, teamController.create);
teamRoutes.get('/:id', teamController.show);
teamRoutes.put('/:id', adminMiddleware, teamController.update);
teamRoutes.delete('/:id', adminMiddleware, teamController.delete);
teamRoutes.post('/members', adminMiddleware, teamController.addMember);
teamRoutes.delete('/members/:userId', adminMiddleware, teamController.removeMember);

export { teamRoutes };