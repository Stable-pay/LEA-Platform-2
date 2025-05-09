import type { Request, Response, NextFunction } from 'express';
import type { Express } from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';

const SessionStore = MemoryStore(session);

export const setupAuth = (app: Express) => {
  app.use(session({
    store: new SessionStore({
      checkPeriod: 86400000
    }),
    secret: process.env.SESSION_SECRET || 'development-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.get('/api/auth/replit', (req, res) => {
    // Implement Replit auth login
    res.redirect('https://replit.com/auth');
  });

  app.get('/api/auth/callback', (req, res) => {
    // Handle Replit auth callback
    req.session.user = { id: req.query.id };
    res.redirect('/');
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Please login' });
  }
};