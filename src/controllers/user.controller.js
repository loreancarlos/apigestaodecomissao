import { UserService } from '../services/user.service.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  list = async (req, res) => {
    try {
      const users = await this.userService.list();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  create = async (req, res) => {
    try {
      const data = req.body;
      const user = await this.userService.create(data);
      return res.status(201).json(user);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  show = async (req, res) => {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  update = async (req, res) => {
    try {
      const data = req.body;
      const user = await this.userService.update(req.params.id, data);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.json(user);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  delete = async (req, res) => {
    try {
      await this.userService.delete(req.params.id);
      return res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      if (error.message === 'USER_HAS_DEPENDENCIES') {
        return res.status(400).json({ error: 'Usuário possui dependências e não pode ser excluído' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  toggleStatus = async (req, res) => {
    try {
      const user = await this.userService.toggleStatus(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}