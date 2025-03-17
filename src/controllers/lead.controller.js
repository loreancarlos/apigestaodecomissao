import { LeadService } from '../services/lead.service.js';
import { BusinessService } from '../services/business.service.js';

export class LeadController {
  constructor() {
    this.leadService = new LeadService();
    this.businessService = new BusinessService();
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
        name: req.body.name,
        phone: req.body.phone,
        developmentsInterest: req.body.developmentsInterest,
        brokerId: (role === 'broker' || role === 'teamLeader') ? id : req.body.brokerId
      };
      const lead = await this.leadService.create(data);
      // Notificar todos os clientes conectados sobre o novo lead
      wsManager.broadcastUpdate('NEW_LEAD', lead);
      // Criar um negócio para cada empreendimento selecionado
      if (req.body.developmentsInterest) {
        lead.developmentsInterest.map(
          async (developmentId) => {
            const dataBusiness = {
              leadId: lead.id,
              developmentId,
              source: req.body.source,
              status: "new",
            };
            await this.businessService.create(dataBusiness);
          }
        );
      }
      return res.status(201).json(lead);
    } catch (error) {
      if (error.message == 'LEAD_DONT_HAS_DEVELOPMENTS') {
        return res.status(400).json({ error: 'Nenhum empreendimento selecionado!' });
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
      if (error.message === 'LEAD_HAS_BUSINESS') {
        return res.status(400).json({ error: 'Lead possui negócio e não pode ser excluído!' });
      }
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