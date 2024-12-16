import { Router } from 'express';
import { ClientController } from '../controllers/client.controller.js';

const clientRoutes = Router();
const clientController = new ClientController();

clientRoutes.get('/', clientController.list);
clientRoutes.post('/', clientController.create);
clientRoutes.get('/:id', clientController.show);
clientRoutes.put('/:id', clientController.update);
clientRoutes.delete('/:id', clientController.delete);

export { clientRoutes };