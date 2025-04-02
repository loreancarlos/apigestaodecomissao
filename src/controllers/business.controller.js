import { BusinessService } from '../services/business.service.js';
import { wsManager } from '../websocket/websocketServer.js';

export class BusinessController {
   constructor() {
      this.businessService = new BusinessService();
   }

   list = async (req, res) => {
      try {
         const { role, id, teamId } = req.user;
         let businesses;
         if (role === 'admin') {
            businesses = await this.businessService.list();
         } else if (role === 'teamLeader') {
            // Busca tanto os negócios da equipe quanto os negócios pessoais do líder
            const teamBusinesses = await this.businessService.list(null, teamId);
            const personalBusinesses = await this.businessService.list(id);
            businesses = Array.from(new Map([...teamBusinesses, ...personalBusinesses].map(business => [business.id, business])).values());;
         } else {
            businesses = await this.businessService.list(id);
         }
         return res.json(businesses);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }

   create = async (req, res) => {
      try {
         const data = req.body;
         const business = await this.businessService.create(data);
         // Notificar todos os clientes conectados sobre o novo business
         wsManager.broadcastUpdate('NEW_BUSINESS', business);
         return res.status(201).json(business);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }

   show = async (req, res) => {
      try {
         const { role, id, teamId } = req.user;
         let business;

         if (role === 'admin') {
            business = await this.businessService.findById(req.params.id);
         } else if (role === 'teamLeader') {
            business = await this.businessService.findByIdForTeamLeader(req.params.id, id, teamId);
         } else {
            business = await this.businessService.findById(req.params.id, id);
         }

         if (!business) {
            return res.status(404).json({ error: 'Negócio não encontrado' });
         }

         return res.json(business);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }

   update = async (req, res) => {
      try {
         const { role, id } = req.user;
         let business;
         if (role === 'admin' || role === 'teamLeader') {
            business = await this.businessService.update(req.params.id, req.body);
         } else {
            business = await this.businessService.update(req.params.id, req.body, id);
         }

         if (!business) {
            return res.status(404).json({ error: 'Negócio não encontrado' });
         }
         return res.json(business);
      } catch (error) {
         if (error.message.includes('Business must be assigned to a broker or team leader')) {
            return res.status(400).json({ error: 'Negócio deve ser atribuído a um corretor ou líder de equipe' });
         }
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }

   delete = async (req, res) => {
      try {
         const { role, id, teamId } = req.user;

         if (role === 'admin' || role === 'teamLeader') {
            await this.businessService.delete(req.params.id);
         } else {
            await this.businessService.delete(req.params.id, id);
         }

         return res.json({ message: 'Negócio deletado com sucesso' });
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }
}