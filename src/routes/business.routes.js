import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller.js';

const businessRoutes = Router();
const businessController = new BusinessController();

businessRoutes.get('/', businessController.list);
businessRoutes.post('/', businessController.create);
businessRoutes.get('/:id', businessController.show);
businessRoutes.put('/:id', businessController.update);
businessRoutes.delete('/:id', businessController.delete);

export { businessRoutes };