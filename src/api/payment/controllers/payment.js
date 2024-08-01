'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const stripe = require('stripe')(process.env.STRIPE_KEY);

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
  async create(ctx) {
    const { email, name, classs, prices } = ctx.request.body;

    try {
  

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}?success=true`,
        cancel_url: `${process.env.CLIENT_URL}?success=false`,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: classs,
              },
              unit_amount: prices * 100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        customer_email: email,
      });

  

      await strapi.service('api::payment.payment').create({
        data: {
          Name: name,
          Email: email,
          Package: classs,
          PaymentID: session.id,
          Price:prices
        },
      });

      return { stripeSession: session };
    } catch (err) {
      console.error('Error creating Stripe session:', err);
      ctx.response.status = 500;
      return { error: 'Unable to create Stripe session' };
    }
  },
}));
