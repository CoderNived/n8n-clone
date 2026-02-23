import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow, MiniMap, Controls, Background,
  useNodesState, useEdgesState, addEdge,
} from '@xyflow/react';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import NodePanel from './NodePanel';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const initialNodes = [
  { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Webhook' } },
  { id: '2', type: 'action', position: { x: 400, y: 100 }, data: { label: 'HTTP Request' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
];

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const idCounter = useRef(3);

  const handleAddNode = useCallback((type) => {
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
          type === 'trigger' ? 'New Trigger' :
          type === 'condition' ? 'New Condition' : 'New Action',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onConnect = useCallback((connection) => {
    setEdges((eds) => {
      const exists = eds.some(
        (edge) => edge.source === connection.source && edge.target === connection.target
      );
      if (exists) return eds;
      return addEdge(connection, eds);
    });
  }, [setEdges]);

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:5000/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Workflow', nodes, edges }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkflowId(data.id);
        alert('Workflow saved!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save workflow');
    }
  };

  const handleLoad = async () => {
    try {
      const res = await fetch('http://localhost:5000/workflows');
      const data = await res.json();
      if (data.length === 0) { alert('No workflows found'); return; }
      const latest = data[data.length - 1];
      setNodes(latest.nodes);
      setEdges(latest.edges);
      setWorkflowId(latest.id);
      alert('Workflow loaded!');
    } catch (error) {
      console.error(error);
      alert('Failed to load workflow');
    }
  };

  const handleRun = async () => {
    try {
      if (!workflowId) { alert('Please save the workflow first!'); return; }
      const res = await fetch(`http://localhost:5000/workflows/${workflowId}/execute`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        const output = data.results.map((r) => `${r.label}: ${r.status}`).join('\n');
        alert(output);
      }
    } catch (error) {
      console.error(error);
      alert('Execution failed');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>

      <div style={{ position: 'absolute', top: 20, left: isPanelOpen ? 270 : 20, zIndex: 20, transition: 'left 0.2s' }}>
        <button onClick={() => setIsPanelOpen((prev) => !prev)}>
          {isPanelOpen ? '✕' : '+'}
        </button>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 20 }}>
        <button onClick={handleSave} style={{ marginRight: 10 }}>Save</button>
        <button onClick={handleLoad} style={{ marginRight: 10 }}>Load</button>
        <button onClick={handleRun} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
          ▶ Run
        </button>
      </div>

      {isPanelOpen && (
        <NodePanel onAdd={handleAddNode} onClose={() => setIsPanelOpen(false)} />
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
