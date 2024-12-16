import { SaleService } from '../services/sale.service.js';

export class SaleController {
  constructor() {
    this.saleService = new SaleService();
  }

  list = async (req, res) => {
    try {
      const sales = await this.saleService.list();
      return res.json(sales);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  create = async (req, res) => {
    try {
      const data = req.body;
      const sale = await this.saleService.create(data);
      return res.status(201).json(sale);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  show = async (req, res) => {
    try {
      const sale = await this.saleService.findById(req.params.id);
      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }
      return res.json(sale);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  update = async (req, res) => {
    try {
      const data = req.body;
      const sale = await this.saleService.update(req.params.id, data);
      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }
      return res.json(sale);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  delete = async (req, res) => {
    try {
      await this.saleService.delete(req.params.id);
      return res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}