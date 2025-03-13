import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.validateCredentials(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          teamId: user.teamId,
          lastLogin: user.lastLogin
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      await this.authService.updateLastLogin(user.id);
      return res.json({
        token, user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          teamId: user.teamId,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const success = await this.authService.changePassword(userId, currentPassword, newPassword);
      if (!success) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  adminResetPassword = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { userId, newPassword } = req.body;
      await this.authService.adminResetPassword(userId, newPassword);
      return res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
