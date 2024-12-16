import { DevelopmentService } from '../services/development.service.js';

export class DevelopmentController {
  constructor() {
    this.developmentService = new DevelopmentService();
  }

  list = async (req, res) => {
    try {
      const developments = await this.developmentService.list();
      return res.json(developments);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  create = async (req, res) => {
    try {
      const data = req.body;
      const development = await this.developmentService.create(data);
      return res.status(201).json(development);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  show = async (req, res) => {
    try {
      const development = await this.developmentService.findById(req.params.id);
      if (!development) {
        return res.status(404).json({ error: 'Empreendimento não encontrado' });
      }
      return res.json(development);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  update = async (req, res) => {
    try {
      const data = req.body;
      const development = await this.developmentService.update(req.params.id, data);
      if (!development) {
        return res.status(404).json({ error: 'Empreendimento não encontrado' });
      }
      return res.json(development);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  delete = async (req, res) => {
    try {
      await this.developmentService.delete(req.params.id);
      return res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      if (error.message === 'DEVELOPMENT_HAS_RECEIVABLES') {
        return res.status(400).json({ error: 'Empreendimento possui recebíveis e não pode ser excluído' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}