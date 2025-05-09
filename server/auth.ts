
import type { Request, Response, NextFunction } from 'express';
import type { Express } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DepartmentUser {
  id: string;
  name: string;
  department: string;
  role: string;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DepartmentUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const setupAuth = (app: Express) => {
  app.post('/api/auth/login', async (req, res) => {
    const { department, username, password } = req.body;

    // This is a mock authentication - replace with real DB auth
    if (username && password) {
      const user: DepartmentUser = {
        id: `${department}-${Date.now()}`,
        name: username,
        department,
        role: 'user'
      };

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, ...user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.json({ message: 'Logged out successfully' });
  });
};
