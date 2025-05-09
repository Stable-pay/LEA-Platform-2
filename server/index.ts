import express from "express";
import session from "express-session";
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { testConnection } from "./db";

async function startServer() {
  const app = express();

  // Basic middleware
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Setup WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      console.log('Received:', message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Test database connection
  await testConnection();

  // Setup auth and routes
  setupAuth(app);
  const server = await registerRoutes(app);

  // Handle WebSocket upgrade
  server.on('upgrade', (request, socket, head) => {
    if (request.url?.startsWith('/ws')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  // Start server
  const port = process.env.PORT || 5000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);