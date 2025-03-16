import { CallModeSessionService } from '../services/callModeSession.service.js';

export class CallModeSessionController {
   constructor() {
      this.callModeSessionService = new CallModeSessionService();
   }

   create = async (req, res) => {
      try {
         const { startTime, endTime, leadsViewed } = req.body;
         const userId = req.user.id;

         const session = await this.callModeSessionService.create({
            userId,
            startTime,
            endTime,
            leadsViewed
         });

         return res.status(201).json(session);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }

   list = async (req, res) => {
      try {
         const userId = req.user.id;
         const sessions = await this.callModeSessionService.list(userId);
         return res.json(sessions);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }
}