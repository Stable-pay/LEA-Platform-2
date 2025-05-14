
import { Graph } from 'graphlib';
import { BlockchainTransaction, Wallet } from '@/shared/schema';

interface Node {
  id: string;
  type: 'wallet' | 'exchange' | 'mixer' | 'contract';
  metadata: Record<string, any>;
}

interface Edge {
  source: string;
  target: string;
  type: 'transaction' | 'ownership' | 'interaction';
  metadata: Record<string, any>;
}

export class NetworkAnalysis {
  private graph: Graph;
  private walletMetadata: Map<string, any> = new Map();

  constructor() {
    this.graph = new Graph({ directed: true, compound: false });
  }

  public addNode(node: Node) {
    this.graph.setNode(node.id, node);
  }

  public addEdge(edge: Edge) {
    this.graph.setEdge(edge.source, edge.target, edge);
  }

  public findConnections(nodeId: string, depth: number = 2): Node[] {
    const visited = new Set<string>();
    const connections: Node[] = [];
    
    this.traverseNetwork(nodeId, depth, visited, connections);
    
    return connections;
  }

  private traverseNetwork(
    nodeId: string, 
    depth: number,
    visited: Set<string>,
    connections: Node[]
  ) {
    if (depth === 0 || visited.has(nodeId)) return;
    
    visited.add(nodeId);
    const neighbors = this.graph.neighbors(nodeId);
    
    if (neighbors) {
      for (const neighbor of neighbors) {
        const node = this.graph.node(neighbor);
        if (node && !visited.has(neighbor)) {
          connections.push(node);
          this.traverseNetwork(neighbor, depth - 1, visited, connections);
        }
      }
    }
  }

  public analyzeNetwork(startNodeId: string) {
    return {
      centrality: this.calculateCentrality(startNodeId),
      clusters: this.findClusters(),
      riskPaths: this.findRiskPaths(startNodeId),
      metrics: this.calculateNetworkMetrics()
    };
  }

  private calculateCentrality(nodeId: string): number {
    const totalNodes = this.graph.nodes().length;
    const shortestPaths = this.findShortestPaths(nodeId);
    
    let sum = 0;
    for (const path of Object.values(shortestPaths)) {
      sum += path;
    }
    
    return sum / (totalNodes - 1);
  }

  private findShortestPaths(startNode: string): Record<string, number> {
    const distances: Record<string, number> = {};
    const nodes = this.graph.nodes();
    
    nodes.forEach(node => {
      distances[node] = Infinity;
    });
    distances[startNode] = 0;
    
    // Dijkstra's algorithm implementation
    return distances;
  }

  private findClusters(): Node[][] {
    const clusters: Node[][] = [];
    const visited = new Set<string>();
    
    this.graph.nodes().forEach(nodeId => {
      if (!visited.has(nodeId)) {
        const cluster = this.expandCluster(nodeId, visited);
        if (cluster.length > 0) {
          clusters.push(cluster);
        }
      }
    });
    
    return clusters;
  }

  private expandCluster(nodeId: string, visited: Set<string>): Node[] {
    const cluster: Node[] = [];
    const queue: string[] = [nodeId];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);
        cluster.push(this.graph.node(current));
        
        const neighbors = this.graph.neighbors(current);
        if (neighbors) {
          queue.push(...neighbors);
        }
      }
    }
    
    return cluster;
  }

  private findRiskPaths(startNodeId: string): Edge[][] {
    const riskPaths: Edge[][] = [];
    const visited = new Set<string>();
    
    this.findRiskPathsDFS(startNodeId, [], visited, riskPaths);
    
    return riskPaths;
  }

  private findRiskPathsDFS(
    currentNode: string,
    currentPath: Edge[],
    visited: Set<string>,
    riskPaths: Edge[][]
  ) {
    visited.add(currentNode);
    
    const neighbors = this.graph.neighbors(currentNode);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const edge = this.graph.edge(currentNode, neighbor);
          if (this.isRiskyEdge(edge)) {
            const newPath = [...currentPath, edge];
            riskPaths.push(newPath);
            this.findRiskPathsDFS(neighbor, newPath, visited, riskPaths);
          }
        }
      }
    }
    
    visited.delete(currentNode);
  }

  private isRiskyEdge(edge: Edge): boolean {
    return edge.metadata.riskScore > 0.7;
  }

  private calculateNetworkMetrics() {
    return {
      density: this.calculateDensity(),
      avgDegree: this.calculateAverageDegree(),
      clusteringCoeff: this.calculateClusteringCoefficient()
    };
  }

  private calculateDensity(): number {
    const nodes = this.graph.nodes().length;
    const edges = this.graph.edges().length;
    return (2 * edges) / (nodes * (nodes - 1));
  }

  private calculateAverageDegree(): number {
    const degrees = this.graph.nodes().map(node => 
      (this.graph.neighbors(node) || []).length
    );
    return degrees.reduce((a, b) => a + b, 0) / degrees.length;
  }

  private calculateClusteringCoefficient(): number {
    const coefficients = this.graph.nodes().map(node => {
      const neighbors = this.graph.neighbors(node) || [];
      if (neighbors.length < 2) return 0;
      
      let triangles = 0;
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          if (this.graph.hasEdge(neighbors[i], neighbors[j])) {
            triangles++;
          }
        }
      }
      
      const possibleTriangles = (neighbors.length * (neighbors.length - 1)) / 2;
      return triangles / possibleTriangles;
    });
    
    return coefficients.reduce((a, b) => a + b, 0) / coefficients.length;
  }
}

export default NetworkAnalysis;
