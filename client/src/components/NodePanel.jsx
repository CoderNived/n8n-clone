import React from 'react';

const nodeOptions = [
  { type: 'trigger', label: 'Trigger', icon: '⚡', color: '#22c55e' },
  { type: 'action', label: 'Action', icon: '🔗', color: '#3b82f6' },
  { type: 'condition', label: 'Condition', icon: '❓', color: '#f97316' },
];

export default function NodePanel({ onAdd, onClose }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: 250,
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        padding: 20,
        zIndex: 20,
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ marginBottom: 20 }}>Add Node</h3>

      {nodeOptions.map((node) => (
        <div
          key={node.type}
          onClick={() => {
            onAdd(node.type);
            onClose();
          }}
          style={{
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            cursor: 'pointer',
            borderLeft: `4px solid ${node.color}`,
            background: '#f9fafb',
          }}
        >
          <strong>
            {node.icon} {node.label}
          </strong>
        </div>
      ))}

      <button
        onClick={onClose}
        style={{ marginTop: 20, width: '100%' }}
      >
        Close
      </button>
    </div>
  );
}