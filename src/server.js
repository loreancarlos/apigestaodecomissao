import config from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { router } from './routes/index.js';
import { wsManager } from './websocket/websocketServer.js';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Inicializar WebSocket
wsManager.initialize(server);

app.use(cors());
app.use(express.json());
app.use('/api', router);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});