const Stripe = require('stripe');
const config = require('cloud/config');

Stripe.initialize(config.STRIPE_PUBLISHABLE_KEY);

module.exports = Stripe;