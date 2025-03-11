import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller.js';

const saleRoutes = Router();
const saleController = new SaleController();

saleRoutes.get('/', saleController.list);
saleRoutes.post('/', saleController.create);
saleRoutes.get('/:id', saleController.show);
saleRoutes.put('/:id', saleController.update);
saleRoutes.delete('/:id', saleController.delete);

export { saleRoutes };