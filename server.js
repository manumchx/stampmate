require('dotenv').config();
const express = require('express');
const db = require('./database');
const crypto = require('crypto');
const QRCode = require('qrcode');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));



app.post('/commercant/inscription', (req, res) => {
  const { nom, email, mot_de_passe } = req.body;
  if (!nom || !email || !mot_de_passe) return res.status(400).json({ erreur: 'Tous les champs sont requis' });
  try {
    const hash = crypto.createHash('sha256').update(mot_de_passe).digest('hex');
    const result = db.prepare('INSERT INTO commercants (nom, email, mot_de_passe) VALUES (?, ?, ?)').run(nom, email, hash);
    res.json({ succes: true, message: 'Compte créé !', id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ erreur: 'Email déjà utilisé' });
  }
});

app.post('/commercant/connexion', (req, res) => {
  const { email, mot_de_passe } = req.body;
  const hash = crypto.createHash('sha256').update(mot_de_passe).digest('hex');
  const commercant = db.prepare('SELECT * FROM commercants WHERE email = ? AND mot_de_passe = ?').get(email, hash);
  if (!commercant) return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' });
  res.json({ succes: true, commercant: { id: commercant.id, nom: commercant.nom, email: commercant.email, plan: commercant.plan } });
});

app.get('/commercant/:id/clients', (req, res) => {
  const clients = db.prepare('SELECT * FROM clients WHERE commercant_id = ?').all(req.params.id);
  res.json({ clients, total: clients.length });
});

app.post('/commercant/:id/client/ajouter', (req, res) => {
  const { nom, email } = req.body;
  const commercant_id = req.params.id;
  if (!nom || !email) return res.status(400).json({ erreur: 'Nom et email requis' });
  const total = db.prepare('SELECT COUNT(*) as count FROM clients WHERE commercant_id = ?').get(commercant_id);
  const commercant = db.prepare('SELECT plan FROM commercants WHERE id = ?').get(commercant_id);
  if (commercant.plan === 'gratuit' && total.count >= 10) return res.status(403).json({ erreur: 'Limite gratuit atteinte. Passez au plan Starter !' });
  try {
    const pass_serial = crypto.randomUUID();
    const result = db.prepare('INSERT INTO clients (commercant_id, nom, email, pass_serial) VALUES (?, ?, ?, ?)').run(commercant_id, nom, email, pass_serial);
    res.json({ succes: true, client: { id: result.lastInsertRowid, nom, email, points: 0, pass_serial } });
  } catch (err) {
    res.status(400).json({ erreur: 'Email déjà enregistré' });
  }
});

app.post('/client/:serial/points', (req, res) => {
  const { points } = req.body;
  const serial = req.params.serial;
  const client = db.prepare('SELECT * FROM clients WHERE pass_serial = ?').get(serial);
  if (!client) return res.status(404).json({ erreur: 'Client introuvable' });
  db.prepare('UPDATE clients SET points = points + ? WHERE pass_serial = ?').run(points || 1, serial);
  db.prepare('INSERT INTO visites (client_id, points_gagnes) VALUES (?, ?)').run(client.id, points || 1);
  const updated = db.prepare('SELECT * FROM clients WHERE pass_serial = ?').get(serial);
  res.json({ succes: true, points: updated.points });
});

app.get('/client/:serial/qrcode', async (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE pass_serial = ?').get(req.params.serial);
  if (!client) return res.status(404).json({ erreur: 'Client introuvable' });
  const url = 'http://localhost:3000/carte/' + req.params.serial;
  const qr = await QRCode.toDataURL(url);
  res.json({ succes: true, qrcode: qr, url });
});

app.get('/client/:serial', (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE pass_serial = ?').get(req.params.serial);
  if (!client) return res.status(404).json({ erreur: 'Client introuvable' });
  const commercant = db.prepare('SELECT nom FROM commercants WHERE id = ?').get(client.commercant_id);
  res.json({ client: { nom: client.nom, points: client.points }, commercant: { nom: commercant.nom } });
});

app.get('/carte/:serial', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.post('/create-checkout', async (req, res) => {
  const plans = {
    starter: process.env.STRIPE_STARTER_ID,
    pro: process.env.STRIPE_PRO_ID,
    premium: process.env.STRIPE_PREMIUM_ID
  };
  const priceId = plans[req.body.plan];
  if (!priceId) return res.status(400).json({ erreur: 'Plan invalide' });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: 'http://localhost:3000/dashboard.html?success=true',
    cancel_url: 'http://localhost:3000/pricing.html',
  });
  res.json({ url: session.url });
});

app.listen(port, () => {
  console.log('✅ StampMate serveur démarré sur http://localhost:' + port);
});
