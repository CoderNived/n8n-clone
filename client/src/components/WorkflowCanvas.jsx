import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import NodePanel from './NodePanel';

import '@xyflow/react/dist/style.css';

// IMPORTANT: Define outside component
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { label: 'Webhook' },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 400, y: 100 },
    data: { label: 'HTTP Request' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
];

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Stable ID counter (better than nodes.length)
  const idCounter = useRef(3);

  // Add node from panel
  const handleAddNode = useCallback(
    (type) => {
      const id = `${idCounter.current++}`;

      const newNode = {
        id,
        type,
        position: {
          x: Math.random() * 400 + 150,
          y: Math.random() * 300 + 150,
        },
        data: {
          label:
            type === 'trigger'
              ? 'New Trigger'
              : type === 'condition'
              ? 'New Condition'
              : 'New Action',
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Prevent duplicate edges
  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        const exists = eds.some(
          (edge) =>
            edge.source === connection.source &&
            edge.target === connection.target
        );

        if (exists) return eds;

        return addEdge(connection, eds);
      });
    },
    [setEdges]
  );

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      
      {/* Toggle Sidebar Button */}
      <div style={{ position: 'absolute', top: 20, left: isPanelOpen ? 270 : 20, zIndex: 20, transition: 'left 0.2s' }}>
        <button onClick={() => setIsPanelOpen((prev) => !prev)}>
        {isPanelOpen ? '✕' : '+'}
        </button>
        </div>

      {/* Sidebar */}
      {isPanelOpen && (
        <NodePanel
          onAdd={handleAddNode}
          onClose={() => setIsPanelOpen(false)}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}