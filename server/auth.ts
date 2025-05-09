
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { User } from "@shared/schema";
import MemoryStore from "memorystore";

const scryptAsync = promisify(_scrypt);

// Type augmentation for Express.User
declare global {
  namespace Express {
    interface User extends User {
      id: string;
      name: string;
      bio: string;
      url: string;
      profileImage: string;
    }
  }
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Setup session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new (MemoryStore(session))({
        checkPeriod: 86400000 // 24 hours
      })
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/api/user", (req: Request, res: Response) => {
    const userData = {
      id: req.headers["x-replit-user-id"],
      name: req.headers["x-replit-user-name"],
      bio: req.headers["x-replit-user-bio"],
      url: req.headers["x-replit-user-url"],
      profileImage: req.headers["x-replit-user-profile-image"]
    };
    
    if (!userData.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json(userData);
  });

  // Configure Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        const isPasswordValid = await comparePasswords(password, user.password);
        
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, fullName, role, organization } = req.body;
      
      // Check if the user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(password);
      
      // Create the user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        fullName,
        role: role || "law_enforcement", // Default role
        organization: organization || null,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Log in the new user
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: User, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Authentication failed" });

      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.status(200).json({ message: "Logged out successfully" });
      });
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user as User;
    
    res.status(200).json(userWithoutPassword);
  });
  
  // Middleware to check if user is authenticated
  app.use("/api/*", (req: Request, res: Response, next: NextFunction) => {
    // Skip auth check for login, logout, register, and user endpoints
    if (
      req.path === "/api/login" || 
      req.path === "/api/logout" || 
      req.path === "/api/register" || 
      req.path === "/api/user"
    ) {
      return next();
    }
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    next();
  });
}
