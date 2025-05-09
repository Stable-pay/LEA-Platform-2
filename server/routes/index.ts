
import { Router } from 'express';
import blockchainRoutes from './blockchain';
import { isAuthenticated } from '../auth';

const router = Router();

// Public routes
router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Protected routes
router.use('/blockchain', isAuthenticated, blockchainRoutes);

// Department specific endpoints
router.get('/department/:deptId/stats', isAuthenticated, async (req, res) => {
  try {
    const { deptId } = req.params;
    // Implement department specific stats logic
    res.json({ department: deptId, status: 'active' });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch department stats" });
  }
});

export default router;
