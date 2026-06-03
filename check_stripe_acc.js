const Stripe = require("stripe");
require("dotenv").config({ path: ".env.local" });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function run() {
  const account = await stripe.accounts.retrieve('acct_1Te4e7RyP8JU76xY');
  console.log("Account ID:", account.id);
  console.log("Details Submitted:", account.details_submitted);
  console.log("Charges Enabled:", account.charges_enabled);
  console.log("Payouts Enabled:", account.payouts_enabled);
  console.log("Requirements:", account.requirements);
}
run();
