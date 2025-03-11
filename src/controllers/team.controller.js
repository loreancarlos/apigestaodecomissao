import { TeamService } from '../services/team.service.js';

export class TeamController {
  constructor() {
    this.teamService = new TeamService();
  }

  list = async (req, res) => {
    try {
      const teams = await this.teamService.list();
      return res.json(teams);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  create = async (req, res) => {
    try {
      const data = req.body;
      const team = await this.teamService.create(data);
      return res.status(201).json(team);
    } catch (error) {
      if (error.message.includes('Team leader must have teamLeader role')) {
        return res.status(400).json({ error: 'O líder do time deve ter a função de líder de equipe' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  show = async (req, res) => {
    try {
      const team = await this.teamService.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ error: 'Time não encontrado' });
      }
      return res.json(team);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  update = async (req, res) => {
    try {
      const data = req.body;
      const team = await this.teamService.update(req.params.id, data);
      if (!team) {
        return res.status(404).json({ error: 'Time não encontrado' });
      }
      return res.json(team);
    } catch (error) {
      if (error.message.includes('Team leader must have teamLeader role')) {
        return res.status(400).json({ error: 'O líder do time deve ter a função de líder de equipe' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  delete = async (req, res) => {
    try {
      await this.teamService.delete(req.params.id);
      return res.json({ message: 'Time deletado com sucesso' });
    } catch (error) {
      if (error.message === 'TEAM_HAS_MEMBERS') {
        return res.status(400).json({ error: 'Time possui membros e não pode ser excluído' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  addMember = async (req, res) => {
    try {
      const { teamId, userId } = req.body;
      const user = await this.teamService.addMember(teamId, userId);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  removeMember = async (req, res) => {
    try {
      const user = await this.teamService.removeMember(req.params.userId);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}