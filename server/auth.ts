
import type { Request, Response, NextFunction } from 'express';
import type { Express } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

interface DepartmentUser {
  id: string;
  name: string;
  department: string;
  role: string;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DepartmentUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const MOCK_USERS = {
  ED: { role: 'enforcer' },
  FIU: { role: 'investigator' },
  I4C: { role: 'cyber_expert' },
  IT: { role: 'technical' },
  VASP: { role: 'service_provider' },
  BANK: { role: 'financial' }
};

export const setupAuth = (app: Express) => {
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { department, username, password } = req.body;

      if (!department || !username || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
      }

      // Mock authentication - replace with real DB auth in production
      const departmentInfo = MOCK_USERS[department];
      if (!departmentInfo) {
        return res.status(401).json({ message: 'Invalid department' });
      }

      const user: DepartmentUser = {
        id: `${department}-${Date.now()}`,
        name: username,
        department,
        role: departmentInfo.role
      };

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
      res.json({ token, ...user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/verify', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.json({ message: 'Logged out successfully' });
  });
};
