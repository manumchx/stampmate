const Database = require('better-sqlite3');
const db = new Database('stampmate.db');

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS commercants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    couleur TEXT DEFAULT '#000000',
    logo_url TEXT,
    plan TEXT DEFAULT 'gratuit',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commercant_id INTEGER NOT NULL,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    pass_serial TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commercant_id) REFERENCES commercants(id)
  );

  CREATE TABLE IF NOT EXISTS visites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    points_gagnes INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );
`);

console.log('✅ Base de données StampMate initialisée');

module.exports = db;