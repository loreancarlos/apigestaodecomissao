import { Router } from 'express';
import { DevelopmentController } from '../controllers/development.controller.js';

const developmentRoutes = Router();
const developmentController = new DevelopmentController();

developmentRoutes.get('/', developmentController.list);
developmentRoutes.post('/', developmentController.create);
developmentRoutes.get('/:id', developmentController.show);
developmentRoutes.put('/:id', developmentController.update);
developmentRoutes.delete('/:id', developmentController.delete);

export { developmentRoutes };