export function getAffiliatePayout(plan: string | null, billingCycle: string | null): number {
  if (billingCycle !== "annual") {
    return 0; // Only pay for annual subscriptions
  }

  // Handle both lowercase and TitleCase just in case
  const planName = (plan || "").toLowerCase();

  switch (planName) {
    case "pro":
      return 35;
    case "elite":
      return 75;
    case "enterprise":
      return 100;
    default:
      return 0;
  }
}
