const Database = require('better-sqlite3');

// Creates workflows.db file automatically if it doesn't exist
const db = new Database('workflows.db');

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    nodes TEXT NOT NULL,
    edges TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;