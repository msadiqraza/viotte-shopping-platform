// -----------------------------------------------------------------------------
// File: backend/services/stripeService.js
// Logic for interacting with the Stripe API
// -----------------------------------------------------------------------------
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabaseAdmin } = require('../config/supabaseClient'); // For DB interactions

// Helper to get or create a Stripe Customer ID for a Supabase user
// Stores the Stripe Customer ID in your Supabase `profiles` table
const getOrCreateStripeCustomerId = async (supabaseUserId, userEmail) => {
  // 1. Check if user already has a stripe_customer_id in your 'profiles' table
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', supabaseUserId)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { // PGRST116: no rows found
    throw new Error(`Error fetching profile: ${profileError.message}`);
  }

  if (profile && profile.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // 2. If not, create a new Stripe Customer
  const customer = await stripe.customers.create({
    email: userEmail, // User's email from Supabase auth
    metadata: {
      supabase_user_id: supabaseUserId,
    },
  });

  // 3. Save the new Stripe Customer ID to the user's profile in Supabase
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', supabaseUserId);

  if (updateError) {
    // Log error, but still return customer.id as Stripe customer was created
    console.error(`Error updating profile with Stripe customer ID: ${updateError.message}`);
  }

  return customer.id;
};


const createSetupIntentService = async (supabaseUserId, userEmail) => {
  const customerId = await getOrCreateStripeCustomerId(supabaseUserId, userEmail);
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'], // Or other types like 'paypal' if configured
    usage: 'on_session', // Or 'off_session' if you plan to charge later without user interaction
  });
  return { clientSecret: setupIntent.client_secret, customerId };
};

const savePaymentMethodToSupabase = async (supabaseUserId, stripePaymentMethodId, isDefault = false, cardDetails = {}) => {
  // Fetch card details from Stripe to get brand, last4 (optional but good for display)
  let brand = cardDetails.brand || 'card';
  let last4 = cardDetails.last4 || '••••';

  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(stripePaymentMethodId);
    if (paymentMethod.card) {
      brand = paymentMethod.card.brand;
      last4 = paymentMethod.card.last4;
    }
  } catch (e) {
    console.warn("Could not retrieve payment method details from Stripe:", e.message);
  }


  // If setting this as default, unset other defaults for this user
  if (isDefault) {
    const { error: unsetError } = await supabaseAdmin
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', supabaseUserId)
      .eq('is_default', true);
    if (unsetError) throw new Error(`Failed to unset other default payment methods: ${unsetError.message}`);
  }

  const { data, error } = await supabaseAdmin
    .from('payment_methods') // Ensure you have this table
    .insert({
      user_id: supabaseUserId,
      type: 'stripe', // Or determine from paymentMethod.type
      provider_payment_method_id: stripePaymentMethodId,
      brand: brand,
      last4: last4,
      is_default: isDefault,
      // email: for paypal
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save payment method to database: ${error.message}`);
  return data;
};

const attachPaymentMethodToCustomer = async (stripeCustomerId, stripePaymentMethodId) => {
    try {
        await stripe.paymentMethods.attach(stripePaymentMethodId, {
            customer: stripeCustomerId,
        });
        // Optionally, set it as the default payment method for the customer for invoices/subscriptions
        // await stripe.customers.update(stripeCustomerId, {
        //   invoice_settings: { default_payment_method: stripePaymentMethodId },
        // });
        return { success: true };
    } catch (error) {
        console.error("Error attaching payment method to Stripe customer:", error);
        throw new Error(`Stripe attach error: ${error.message}`);
    }
};


const listPaymentMethodsService = async (supabaseUserId) => {
  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .select('*')
    .eq('user_id', supabaseUserId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch payment methods: ${error.message}`);
  return data || [];
};

const deletePaymentMethodService = async (supabaseUserId, paymentMethodInternalId) => {
  // 1. Get the provider_payment_method_id (Stripe PM ID) from your DB
  const { data: method, error: fetchError } = await supabaseAdmin
    .from('payment_methods')
    .select('provider_payment_method_id, type')
    .eq('id', paymentMethodInternalId)
    .eq('user_id', supabaseUserId) // Ensure user owns this method
    .single();

  if (fetchError || !method) {
    throw new Error(`Payment method not found or access denied: ${fetchError?.message || 'Not found'}`);
  }

  // 2. Detach from Stripe Customer (if it's a Stripe method)
  if (method.type === 'stripe' && method.provider_payment_method_id) {
    try {
      await stripe.paymentMethods.detach(method.provider_payment_method_id);
    } catch (stripeError) {
      // Log error, but proceed to delete from local DB if Stripe detachment fails (e.g., already detached)
      console.warn(`Stripe detach error for ${method.provider_payment_method_id}: ${stripeError.message}`);
    }
  }
  // Add similar logic for PayPal if needed

  // 3. Delete from your Supabase DB
  const { error: deleteError } = await supabaseAdmin
    .from('payment_methods')
    .delete()
    .eq('id', paymentMethodInternalId);

  if (deleteError) throw new Error(`Failed to delete payment method from DB: ${deleteError.message}`);
  return { success: true };
};

const setDefaultPaymentMethodService = async (supabaseUserId, paymentMethodInternalId) => {
  // 1. Set all other methods for this user to is_default = false
  const { error: unsetError } = await supabaseAdmin
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', supabaseUserId);
  if (unsetError) throw new Error(`Failed to unset other defaults: ${unsetError.message}`);

  // 2. Set the specified method to is_default = true
  const { data, error: setError } = await supabaseAdmin
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', paymentMethodInternalId)
    .eq('user_id', supabaseUserId) // Ensure user owns this method
    .select()
    .single();
  if (setError || !data) throw new Error(`Failed to set default payment method: ${setError?.message || 'Update failed'}`);
  
  // Optionally, update Stripe customer's default_payment_method if you use Stripe for subscriptions/invoices
  // const stripeCustomerId = await getOrCreateStripeCustomerId(supabaseUserId, ''); // Email might be needed
  // await stripe.customers.update(stripeCustomerId, {
  //   invoice_settings: { default_payment_method: data.provider_payment_method_id },
  // });

  return data;
};

const createPaymentIntentService = async (supabaseUserId, userEmail, amount, currency, paymentMethodIdFromClient) => {
  const customerId = await getOrCreateStripeCustomerId(supabaseUserId, userEmail);
  
  const paymentIntentParams = {
    amount: amount, // Amount in cents
    currency: currency,
    customer: customerId,
    payment_method_types: ['card'], // Add other types if needed
    // setup_future_usage: 'off_session', // If you want to save the card for later
  };

  if (paymentMethodIdFromClient) {
    // If client provides a specific saved payment method ID (from your DB, which maps to a Stripe PM ID)
    // You need to fetch the actual Stripe PM ID.
    const { data: pmRecord, error: pmError } = await supabaseAdmin
      .from('payment_methods')
      .select('provider_payment_method_id')
      .eq('id', paymentMethodIdFromClient) // Assuming paymentMethodIdFromClient is YOUR internal ID
      .eq('user_id', supabaseUserId)
      .single();

    if (pmError || !pmRecord) {
        throw new Error("Saved payment method not found or not owned by user.");
    }
    paymentIntentParams.payment_method = pmRecord.provider_payment_method_id;
  } else {
    // If no specific payment method is provided, Stripe will use the customer's default,
    // or the client will provide one with Stripe Elements during confirmation.
    // For PaymentElement, you often don't pass payment_method here.
  }

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
  return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
};


module.exports = {
  createSetupIntentService,
  savePaymentMethodToSupabase,
  attachPaymentMethodToCustomer,
  listPaymentMethodsService,
  deletePaymentMethodService,
  setDefaultPaymentMethodService,
  createPaymentIntentService,
  getOrCreateStripeCustomerId,
};
