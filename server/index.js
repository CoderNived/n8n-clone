const express = require('express');
const cors = require('cors');
const db = require('./db');
const { executeWorkflow } = require('./executor');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// POST /workflows - Save workflow
app.post('/workflows', (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    if (!nodes || !edges) {
      return res.status(400).json({ error: 'Nodes and edges are required' });
    }

    const stmt = db.prepare(
      'INSERT INTO workflows (name, nodes, edges) VALUES (?, ?, ?)'
    );

    const result = stmt.run(
      name || 'Untitled Workflow',
      JSON.stringify(nodes),
      JSON.stringify(edges)
    );

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save workflow' });
  }
});

// GET /workflows - Load all workflows
app.get('/workflows', (req, res) => {
  try {
    const workflows = db
      .prepare('SELECT * FROM workflows ORDER BY created_at ASC')
      .all();

    const parsed = workflows.map((w) => ({
      ...w,
      nodes: JSON.parse(w.nodes),
      edges: JSON.parse(w.edges),
    }));

    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load workflows' });
  }
});

// POST /workflows/:id/execute - Execute workflow
app.post('/workflows/:id/execute', (req, res) => {
  try {
    const workflow = db
      .prepare('SELECT * FROM workflows WHERE id = ?')
      .get(req.params.id);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const nodes = JSON.parse(workflow.nodes);
    const edges = JSON.parse(workflow.edges);
    const results = executeWorkflow(nodes, edges);

    res.json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Execution failed' });
  }
});

// ✅ app.listen is always last
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});