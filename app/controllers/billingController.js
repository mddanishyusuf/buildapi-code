// app/controllers/todoController.js
const Todo = require('../models/Todo');
const User = require('../models/User');

const { responseList } = require('../errors/responseList');
const stripe = require('stripe')(process.env.STRIPE_SECREAT_KEY);

exports.createCheckoutLink = async (req, res) => {
    try {
        const {
            clientReferenceId,
            price,
            mode,
            quantity,
            allow_promotion_codes,
        } = req.body;

        let sessionParam = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price,
                    quantity,
                },
            ],
            mode,
            automatic_tax: {
                enabled: true,
            },
            billing_address_collection: 'required',
            tax_id_collection: {
                enabled: true,
            },
            client_reference_id: clientReferenceId,
            success_url: process.env.BILLING_SUCCESS_URL,
            cancel_url: process.env.BILLING_CANCEL_URL,
        };

        if (allow_promotion_codes) {
            sessionParam.allow_promotion_codes = true;
        }

        const session = await stripe.checkout.sessions.create(sessionParam);

        res.status(200).send({ url: session.url });
    } catch (err) {
        res.status(400).send(responseList(400, err.message));
    }
};

exports.stripeHookOnCheckout = async function (req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_CHECKOUT_HOOK_SECRET
        );
    } catch (err) {
        res.status(400).send(responseList(400, err.message));
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { client_reference_id, customer, payment_intent } = session;
        try {
            const uid = client_reference_id;

            await User.findOneAndUpdate(
                { uid },
                {
                    $set: {
                        status: 'pro',
                        stripe_customer: customer,
                    },
                },
                { upsert: true }
            );

            res.status(200).send({
                message: 'updated',
            });
        } catch (err) {
            res.status(400).send(responseList(400, err.message));
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const { customer } = subscription;
        try {
            await User.findOneAndUpdate(
                { stripe_customer: customer },
                {
                    $set: {
                        status: 'free',
                    },
                }
            );

            res.status(200).send({
                message: 'updated',
            });
        } catch (err) {
            res.status(400).send(responseList(400, err.message));
        }
    }
};

exports.billingPortal = async (req, res) => {
    try {
        const { customer } = req.body;

        const session = await stripe.billingPortal.sessions.create({
            customer,
            return_url: process.env.BILLING_SUCCESS_URL,
        });

        res.status(200).send({ url: session.url });
    } catch (err) {
        res.status(400).send(responseList(400, err.message));
    }
};
