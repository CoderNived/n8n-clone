import { Handle, Position } from '@xyflow/react';

export default function ConditionNode({ data }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderLeft: '4px solid #f97316',
        padding: 12,
        borderRadius: 8,
        background: '#fff',
        minWidth: 180,
        fontSize: 14,
        textAlign: 'center',
      }}
    >
      <div style={{ fontWeight: 600 }}>❓ {data.label}</div>

      <Handle type="target" position={Position.Top} />

      {/* True/False labels */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8, fontSize: 11, color: '#888' }}>
        <span>True</span>
        <span>False</span>
      </div>

      {/* True Branch */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '25%' }}
      />

      {/* False Branch */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '75%' }}
      />
    </div>
  );
}