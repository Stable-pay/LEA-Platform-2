
import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../auth';

const router = Router();

// Get all blockchain nodes
router.get('/nodes', async (req, res) => {
  try {
    const nodeType = req.query.type as string || "all";
    const nodes = await storage.getBlockchainNodesByType(nodeType);
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blockchain nodes" });
  }
});

// Get node by ID
router.get('/nodes/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const node = await storage.getBlockchainNodeById(nodeId);
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }
    res.json(node);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch node" });
  }
});

// Department specific routes
router.get('/lea/nodes', isAuthenticated, async (req, res) => {
  try {
    const nodes = await storage.getBlockchainNodesByType('LEA');
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch LEA nodes" });
  }
});

router.get('/fiu/nodes', isAuthenticated, async (req, res) => {
  try {
    const nodes = await storage.getBlockchainNodesByType('FIU');
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch FIU nodes" });
  }
});

router.get('/i4c/nodes', isAuthenticated, async (req, res) => {
  try {
    const nodes = await storage.getBlockchainNodesByType('I4C');
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch I4C nodes" });
  }
});

export default router;
