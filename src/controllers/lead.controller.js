import { LeadService } from '../services/lead.service.js';

export class LeadController {
  constructor() {
    this.leadService = new LeadService();
  }

  list = async (req, res) => {
    try {
      const { role, id, teamId } = req.user;
      let leads;

      if (role === 'admin') {
        leads = await this.leadService.list();
      } else if (role === 'teamLeader') {
        // Busca tanto os leads da equipe quanto os leads pessoais do líder
        const teamLeads = await this.leadService.list(null, teamId);
        const personalLeads = await this.leadService.list(id);
        leads = [...teamLeads, ...personalLeads];
      } else {
        leads = await this.leadService.list(id);
      }

      return res.json(leads);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  create = async (req, res) => {
    try {
      const { role, id } = req.user;
      const data = {
        ...req.body,
        brokerId: (role === 'broker' || role === 'teamLeader') ? id : req.body.brokerId
      };

      const lead = await this.leadService.create(data);
      return res.status(201).json(lead);
    } catch (error) {
      if (error.message.includes('Lead must be assigned to a broker or team leader')) {
        return res.status(400).json({ error: 'Lead deve ser atribuído a um corretor ou líder de equipe' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  show = async (req, res) => {
    try {
      const { role, id, teamId } = req.user;
      let lead;

      if (role === 'admin') {
        lead = await this.leadService.findById(req.params.id);
      } else if (role === 'teamLeader') {
        lead = await this.leadService.findByIdForTeamLeader(req.params.id, id, teamId);
      } else {
        lead = await this.leadService.findById(req.params.id, id);
      }

      if (!lead) {
        return res.status(404).json({ error: 'Lead não encontrado' });
      }

      return res.json(lead);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  update = async (req, res) => {
    try {
      const { role, id, teamId } = req.user;
      let lead;

      if (role === 'admin') {
        lead = await this.leadService.update(req.params.id, req.body);
      } else if (role === 'teamLeader') {
        lead = await this.leadService.updateForTeamLeader(req.params.id, req.body, id, teamId);
      } else {
        lead = await this.leadService.update(req.params.id, req.body, id);
      }

      if (!lead) {
        return res.status(404).json({ error: 'Lead não encontrado' });
      }

      return res.json(lead);
    } catch (error) {
      if (error.message.includes('Lead must be assigned to a broker or team leader')) {
        return res.status(400).json({ error: 'Lead deve ser atribuído a um corretor ou líder de equipe' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  delete = async (req, res) => {
    try {
      const { role, id, teamId } = req.user;

      if (role === 'admin') {
        await this.leadService.delete(req.params.id);
      } else if (role === 'teamLeader') {
        await this.leadService.deleteForTeamLeader(req.params.id, id, teamId);
      } else {
        await this.leadService.delete(req.params.id, id);
      }

      return res.json({ message: 'Lead deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  updateStatus = async (req, res) => {
    try {
      const { role, id, teamId } = req.user;
      const { status } = req.body;
      let lead;

      if (role === 'admin') {
        lead = await this.leadService.updateStatus(req.params.id, status);
      } else if (role === 'teamLeader') {
        lead = await this.leadService.updateStatusForTeamLeader(req.params.id, status, id, teamId);
      } else {
        lead = await this.leadService.updateStatus(req.params.id, status, id);
      }

      if (!lead) {
        return res.status(404).json({ error: 'Lead não encontrado' });
      }

      return res.json(lead);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}