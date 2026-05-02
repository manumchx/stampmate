require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPlans() {
  console.log('Création des plans StampMate...');

  const starter = await stripe.prices.create({
    currency: 'aud',
    unit_amount: 5900,
    recurring: { interval: 'month' },
    product_data: { name: 'StampMate Starter — 200 porteurs' },
  });

  const pro = await stripe.prices.create({
    currency: 'aud',
    unit_amount: 9900,
    recurring: { interval: 'month' },
    product_data: { name: 'StampMate Pro — 1000 porteurs' },
  });

  const premium = await stripe.prices.create({
    currency: 'aud',
    unit_amount: 17900,
    recurring: { interval: 'month' },
    product_data: { name: 'StampMate Premium — Illimité' },
  });

  console.log('✅ Plans créés !');
  console.log('Starter ID:', starter.id);
  console.log('Pro ID:', pro.id);
  console.log('Premium ID:', premium.id);
}

createPlans();
