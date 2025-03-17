import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

class WebSocketManager {
  constructor() {
    this.clients = new Map(); // Map para armazenar conexões por userId
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws, req) => {
      try {
        // Extrair token do query parameter
        const url = new URL(req.url, 'ws://localhost');
        const token = url.searchParams.get('token');

        if (!token) {
          ws.close();
          return;
        }

        // Verificar e decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Armazenar a conexão
        if (!this.clients.has(userId)) {
          this.clients.set(userId, new Set());
        }
        this.clients.get(userId).add(ws);

        ws.on('close', () => {
          this.clients.get(userId)?.delete(ws);
          if (this.clients.get(userId)?.size === 0) {
            this.clients.delete(userId);
          }
        });

      } catch (error) {
        ws.close();
      }
    });
  }

  // Enviar atualização para todos os clientes conectados
  broadcastUpdate(type, data) {
    const message = JSON.stringify({ type, data });
    
    for (const connections of this.clients.values()) {
      for (const client of connections) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    }
  }

  // Enviar atualização para um usuário específico
  sendToUser(userId, type, data) {
    const connections = this.clients.get(userId);
    if (!connections) return;

    const message = JSON.stringify({ type, data });
    
    for (const client of connections) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}

export const wsManager = new WebSocketManager();