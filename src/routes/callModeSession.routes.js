import { Router } from 'express';
import { CallModeSessionController } from '../controllers/callModeSession.controller.js';

const callModeSessionRoutes = Router();
const callModeSessionController = new CallModeSessionController();

callModeSessionRoutes.post('/', callModeSessionController.create);
callModeSessionRoutes.get('/', callModeSessionController.list);
callModeSessionRoutes.put('/:id', callModeSessionController.update);

export { callModeSessionRoutes };