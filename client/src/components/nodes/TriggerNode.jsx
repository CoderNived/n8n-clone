import { Handle, Position } from '@xyflow/react';

export default function TriggerNode({ data }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderLeft: '4px solid #22c55e',
        padding: 12,
        borderRadius: 8,
        background: '#fff',
        minWidth: 160,
        fontSize: 14,
      }}
    >
      <div style={{ fontWeight: 600 }}>⚡ {data.label}</div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}