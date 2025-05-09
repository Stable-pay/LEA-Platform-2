import type { Request, Response, NextFunction } from 'express';
import type { Express } from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import passport from 'passport';

const SessionStore = MemoryStore(session);

declare module 'express-session' {
  interface SessionData {
    user?: { id: string };
  }
}

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

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/auth/replit', (req, res) => {
    // Store user info in session
    const userId = req.headers['x-replit-user-id'];
    if (userId) {
      req.session.user = { id: userId as string };
      res.redirect('/');
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
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