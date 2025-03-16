import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller.js';

const leadRoutes = Router();
const leadController = new LeadController();

leadRoutes.get('/', leadController.list);
leadRoutes.post('/', leadController.create);
leadRoutes.get('/:id', leadController.show);
leadRoutes.put('/:id', leadController.update);
leadRoutes.delete('/:id', leadController.delete);

export { leadRoutes };