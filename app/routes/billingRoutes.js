// app/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.post('/stripe/createCheckoutLink', billingController.createCheckoutLink);
router.post('/stripe/hook', billingController.stripeHookOnCheckout);
router.post('/stripe/portal', billingController.billingPortal);

module.exports = router;
