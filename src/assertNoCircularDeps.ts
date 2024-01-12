enum NodeState {
  Unvisited,
  Visiting,
  Visited,
}

const findCircularDependency = (graph: Record<string, readonly string[]>) => {
  const pathStack: string[] = [];
  const nodeStates = new Map<string, NodeState>(
    Object.keys(graph).map((key) => [key, NodeState.Unvisited] as const)
  );

  // DFS function to detect cycle
  const dfs = (nodeName: string): string[] | undefined => {
    const nodeState = nodeStates.get(nodeName);
    if (nodeState === NodeState.Visiting) {
      return pathStack.slice(pathStack.lastIndexOf(nodeName)); // Found a cycle
    }
    if (nodeState === NodeState.Visited) {
      return; // Already Visited, no cycle here
    }

    // Mark the current node as Visiting
    nodeStates.set(nodeName, NodeState.Visiting);
    pathStack.push(nodeName);

    for (const dependency of graph[nodeName]) {
      const cyclePath = dfs(dependency);
      if (cyclePath) {
        return cyclePath; // Cycle detected in a dependency
      }
    }

    // Mark the current node as Visited
    nodeStates.set(nodeName, NodeState.Visited);
    pathStack.pop();
  };

  // Check each node for a cycle
  for (const node of Object.keys(graph)) {
    const cyclePath = dfs(node);
    if (cyclePath) {
      return cyclePath; // Return the first cycle detected
    }
  }
};

export const assertNoCircularDeps = (
  graph: Record<string, readonly string[]>
) => {
  const circular = findCircularDependency(graph);
  if (circular) {
    const message = [...circular, circular[0]].join(" -> ");
    throw new Error(`Circular dependency detected: ${message}`);
  }
};
