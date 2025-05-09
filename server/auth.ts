
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
  // Set up session middleware first
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

  // Passport session setup
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  app.get('/api/auth/replit', (req, res) => {
    const userId = req.headers['x-replit-user-id'];
    const userName = req.headers['x-replit-user-name'];
    
    if (userId && userName) {
      const user = { id: userId as string, name: userName as string };
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed' });
        }
        res.redirect('/');
      });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  });

  app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Authentication required' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: 'Please login' });
  }
};
