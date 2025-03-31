import { CallModeSessionService } from '../services/callModeSession.service.js';

export class CallModeSessionController {
   constructor() {
      this.callModeSessionService = new CallModeSessionService();
   }

   create = async (req, res) => {
      try {
         const { startTime, endTime, businessViewed } = req.body;
         const userId = req.user.id;

         const session = await this.callModeSessionService.create({
            userId,
            startTime,
            endTime,
            businessViewed,
            answeredCalls: req.body.answeredCalls || 0,
            scheduledCalls: req.body.scheduledCalls || 0,
            whatsappCalls: req.body.whatsappCalls || 0,
            notInterestCalls: req.body.notInterestCalls || 0,
            recallCalls: req.body.recallCalls || 0,
            voicemailCalls: req.body.voicemailCalls || 0,
            invalidNumberCalls: req.body.invalidNumberCalls || 0,
            notReceivingCalls: req.body.notReceivingCalls || 0
         });

         return res.status(201).json(session);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }

   list = async (req, res) => {
      try {
         const sessions = await this.callModeSessionService.list();
         return res.json(sessions);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }

   update = async (req, res) => {
      try {
         const session = await this.callModeSessionService.update(req.params.id, req.body);
         return res.json(session);
      } catch (error) {
         return res.status(500).json({ error: 'Erro interno do servidor' });
      }
   }
}