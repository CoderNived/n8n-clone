function executeWorkflow(nodes, edges) {
  const results = [];

  const triggerNode = nodes.find((n) => n.type === 'trigger');
  if (!triggerNode) {
    return [{ error: 'No trigger node found' }];
  }

  const nodeMap = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });

  const adjacency = {};
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  const visited = new Set();
  const queue = [triggerNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodeMap[currentId];
    if (!node) continue;

    if (node.type === 'trigger') {
      results.push({ id: currentId, label: node.data.label, status: 'Workflow started' });
    } else if (node.type === 'action') {
      results.push({ id: currentId, label: node.data.label, status: `Executing action: ${node.data.label}` });
    } else if (node.type === 'condition') {
      results.push({ id: currentId, label: node.data.label, status: 'Condition evaluated: true' });
    }

    const nextNodes = adjacency[currentId] || [];
    nextNodes.forEach((id) => queue.push(id));
  }

  return results;
}

module.exports = { executeWorkflow };