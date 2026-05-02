require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('./database');

const plans = {};
plans[process.env.STRIPE_STARTER_ID] = 'starter';
plans[process.env.STRIPE_PRO_ID] = 'pro';
plans[process.env.STRIPE_PREMIUM_ID] = 'premium';

async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send('Webhook Error: ' + err.message);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details.email;
    const plan = plans[process.env.STRIPE_STARTER_ID] || 'starter';
    db.prepare('UPDATE commercants SET plan = ? WHERE email = ?').run(plan, email);
    console.log('Plan mis a jour:', email, '->', plan);
  }
  res.json({ received: true });
}
module.exports = handleWebhook;