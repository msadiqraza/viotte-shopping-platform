// -----------------------------------------------------------------------------
// File: backend/routes/paymentRoutes.js
// API routes for payment operations
// -----------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
const { authenticateSupabaseUser } = require("../middleware/authMiddleware");
const {
  createSetupIntentService,
  savePaymentMethodToSupabase,
  attachPaymentMethodToCustomer,
  listPaymentMethodsService,
  deletePaymentMethodService,
  setDefaultPaymentMethodService,
  createPaymentIntentService,
  getOrCreateStripeCustomerId,
} = require("../services/stripeServices");

// Create Stripe Setup Intent (to add a new card)
router.post("/create-setup-intent", authenticateSupabaseUser, async (req, res) => {
  try {
    const supabaseUserId = req.user.id;
    const userEmail = req.user.email;
    const { clientSecret, customerId } = await createSetupIntentService(supabaseUserId, userEmail);
    res.json({ clientSecret, customerId }); // Return customerId if frontend needs it for card setup options
  } catch (error) {
    console.error("/create-setup-intent error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save a new payment method (after successful card setup with Stripe Elements)
router.post("/save-payment-method", authenticateSupabaseUser, async (req, res) => {
  const { stripePaymentMethodId, isDefault, cardDetails } = req.body; // cardDetails might contain brand/last4 if client has it
  const supabaseUserId = req.user.id;
  const userEmail = req.user.email; // Needed for getOrCreateStripeCustomerId

  if (!stripePaymentMethodId) {
    return res.status(400).json({ error: "stripePaymentMethodId is required" });
  }

  try {
    // Get or create Stripe Customer
    const stripeCustomerId = await getOrCreateStripeCustomerId(supabaseUserId, userEmail);

    // Attach PM to Stripe Customer
    await attachPaymentMethodToCustomer(stripeCustomerId, stripePaymentMethodId);

    // Save PM reference to your Supabase DB
    const savedMethod = await savePaymentMethodToSupabase(
      supabaseUserId,
      stripePaymentMethodId,
      isDefault,
      cardDetails
    );

    res.status(201).json(savedMethod);
  } catch (error) {
    console.error("/save-payment-method error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's saved payment methods
router.get("/payment-methods", authenticateSupabaseUser, async (req, res) => {
  try {
    const supabaseUserId = req.user.id;
    const paymentMethods = await listPaymentMethodsService(supabaseUserId);
    res.json(paymentMethods);
  } catch (error) {
    console.error("/payment-methods GET error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a payment method
router.delete("/payment-methods/:id", authenticateSupabaseUser, async (req, res) => {
  try {
    const supabaseUserId = req.user.id;
    const paymentMethodInternalId = req.params.id; // Your internal DB ID for the payment method
    await deletePaymentMethodService(supabaseUserId, paymentMethodInternalId);
    res.status(200).json({ message: "Payment method deleted successfully" });
  } catch (error) {
    console.error("/payment-methods DELETE error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Set a payment method as default
router.post("/payment-methods/:id/set-default", authenticateSupabaseUser, async (req, res) => {
  try {
    const supabaseUserId = req.user.id;
    const paymentMethodInternalId = req.params.id;
    const updatedMethod = await setDefaultPaymentMethodService(
      supabaseUserId,
      paymentMethodInternalId
    );
    res.json(updatedMethod);
  } catch (error) {
    console.error("/payment-methods SET-DEFAULT error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe Payment Intent (for making a payment)
router.post("/create-payment-intent", authenticateSupabaseUser, async (req, res) => {
  const { amount, currency, paymentMethodId } = req.body; // amount in cents, paymentMethodId is YOUR internal DB ID
  const supabaseUserId = req.user.id;
  const userEmail = req.user.email;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency are required" });
  }

  try {
    const { clientSecret, paymentIntentId } = await createPaymentIntentService(
      supabaseUserId,
      userEmail,
      amount,
      currency,
      paymentMethodId
    );
    res.json({ clientSecret, paymentIntentId });
  } catch (error) {
    console.error("/create-payment-intent error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
