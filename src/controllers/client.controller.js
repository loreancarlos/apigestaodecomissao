import { ClientService } from '../services/client.service.js';

export class ClientController {
  constructor() {
    this.clientService = new ClientService();
  }

  list = async (req, res) => {
    try {
      const clients = await this.clientService.list();
      return res.json(clients);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  create = async (req, res) => {
    try {
      const data = req.body;
      const client = await this.clientService.create(data);
      return res.status(201).json(client);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  show = async (req, res) => {
    try {
      const client = await this.clientService.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      return res.json(client);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  update = async (req, res) => {
    try {
      const data = req.body;
      const client = await this.clientService.update(req.params.id, data);
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      return res.json(client);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  delete = async (req, res) => {
    try {
      await this.clientService.delete(req.params.id);
      return res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      if (error.message === 'CLIENT_HAS_SALES') {
        return res.status(400).json({ error: 'Cliente possui venda e não pode ser excluído!' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}