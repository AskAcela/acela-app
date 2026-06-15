export const plans = [
  {
    name: "guest_free",
    screen_name: "Free Plan",
    usd_price: 0,
    free: true,
    credits: 5
  },
  {
    name: "authenticated_free",
    screen_name: "Free Plan",
    usd_price: 0,
    free: true,
    credits: 10
  },
  {
    name: "purchase_2",
    screen_name: "Mini",
    usd_price: 2,
    free: false,
    credits: 40
  },
  {
    name: "purchase_5",
    screen_name: "Standard",
    usd_price: 5,
    free: false,
    credits: 120
  },
  {
    name: "purchase_10",
    screen_name: "Mega",
    usd_price: 10,
    free: false,
    credits: 300
  }
]

export const FREE_CREDITS = plans.reduce((acc, plan) => {
  if (plan.free && plan.credits > 0) {
    acc[plan.name] = plan.credits;
  }
  return acc;
}, {} as Record<BillingPlan, number>);

export const PURCHASE_CREDITS = plans.reduce((acc, plan) => {
  if (!plan.free && plan.credits > 0) {
    acc[plan.name] = plan.credits;
  }
  return acc;
}, {} as Record<BillingPlan, number>);

export const TOKENS_PER_CREDIT = Number(process.env.TOKENS_PER_CREDIT ?? 1000);

export type BillingPlan = typeof plans[number]['name'];

export function creditsForPurchase(amountUSD: 2 | 5 | 10): number {
  return PURCHASE_CREDITS[amountUSD];
}

export function tokensToCredits(tokens: number): number {
  if (!Number.isFinite(tokens) || tokens <= 0) return 0;
  return Math.max(1, Math.ceil(tokens / TOKENS_PER_CREDIT));
}

export function estimateTokensFromText(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function estimateTokensFromMessages(
  messages: Array<{ content: string }>
): number {
  return messages.reduce(
    (sum, msg) => sum + estimateTokensFromText(msg.content ?? ""),
    0
  );
}

export function initialCreditsForGuest() {
  return FREE_CREDITS.guest_free;
}

export function initialCreditsForAuthenticated() {
  return FREE_CREDITS.authenticated_free;
}