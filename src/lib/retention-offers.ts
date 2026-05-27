export type DayCategory = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface WinBackOffer {
  id: string;
  category: DayCategory;
  text: string;
}

export const RETENTION_OFFERS: WinBackOffer[] = [
  // MONDAY (Focus: Heavy discounts/freebies to drive traffic on the slowest day)
  { id: "mon-1", category: "monday", text: "Come back next Monday or Tuesday and your first round of drinks is completely on us." },
  { id: "mon-2", category: "monday", text: "We want to make it right. Join us any Monday this month for a free appetizer of your choice." },
  { id: "mon-3", category: "monday", text: "Monday nights just got better. Show this message next Monday for a Buy-One-Get-One-Free entree." },
  { id: "mon-4", category: "monday", text: "Let us try again. 25% off your entire bill next time you visit us on a Monday." },
  { id: "mon-5", category: "monday", text: "Start your week right. Free dessert on the house if you visit us next Monday." },
  { id: "mon-6", category: "monday", text: "We dropped the ball. Here is a $15 credit towards your next Monday dinner." },
  { id: "mon-7", category: "monday", text: "Mondays are for second chances. Let us host you next Monday and we'll cover your appetizers and desserts." },

  // TUESDAY (Focus: Taco Tuesday vibes, casual dining, driving mid-week volume)
  { id: "tue-1", category: "tuesday", text: "We are sorry about your experience. Come back any Tuesday and enjoy 50% off your second main course." },
  { id: "tue-2", category: "tuesday", text: "Give us another shot. Show this text next Tuesday for a complimentary signature cocktail or mocktail." },
  { id: "tue-3", category: "tuesday", text: "Tuesday special: Let us replace that meal. Your exact order is on us next Tuesday." },
  { id: "tue-4", category: "tuesday", text: "We know we can do better. Join us next Tuesday for a free starter platter to share." },
  { id: "tue-5", category: "tuesday", text: "Tuesday redemption! 20% off your total check next week." },
  { id: "tue-6", category: "tuesday", text: "Let us treat you. Any Tuesday this month, your non-alcoholic beverages are bottomless and free." },
  { id: "tue-7", category: "tuesday", text: "We'd love to see you again. Next Tuesday, we'll upgrade your meal size or add premium toppings at no charge." },
  { id: "tue-8", category: "tuesday", text: "A Tuesday treat: Free side dish of your choice with any entree purchase." },

  // WEDNESDAY (Focus: Hump day, wine down, getting people over the mid-week slump)
  { id: "wed-1", category: "wednesday", text: "We want to make it right. Here is a code for 20% off your entire bill, valid any Wednesday or Thursday this month." },
  { id: "wed-2", category: "wednesday", text: "Wine-down Wednesday! Show this for a complimentary glass of house wine or draft beer on your next Wednesday visit." },
  { id: "wed-3", category: "wednesday", text: "Half-way through the week, let us make your day. Free dessert with any Wednesday meal." },
  { id: "wed-4", category: "wednesday", text: "Wednesday redemption: Bring a friend and their meal is 50% off." },
  { id: "wed-5", category: "wednesday", text: "We slipped up. Next Wednesday, your table gets a free chef's special tasting plate." },
  { id: "wed-6", category: "wednesday", text: "Let us make it up to you. $10 off your total bill next Wednesday evening." },
  { id: "wed-7", category: "wednesday", text: "Hump day special: Show this message next Wednesday for free premium coffee/tea and a pastry." },

  // THURSDAY (Focus: Early weekend prep, driving larger groups)
  { id: "thu-1", category: "thursday", text: "Let's kick off the weekend early. Come back next Thursday and the appetizers for your table are on us." },
  { id: "thu-2", category: "thursday", text: "We value your feedback. Next Thursday, enjoy a Buy-One-Get-One half off deal on all entrees." },
  { id: "thu-3", category: "thursday", text: "Thursday night redo: Show this text to your server next Thursday for a free premium dessert." },
  { id: "thu-4", category: "thursday", text: "We promise a better experience. Your first round of drinks next Thursday is 100% covered." },
  { id: "thu-5", category: "thursday", text: "Thursday special: 15% off your entire party's check." },
  { id: "thu-6", category: "thursday", text: "Give us another chance this Thursday. We'll add a complimentary signature side dish to your order." },
  { id: "thu-7", category: "thursday", text: "We are so sorry. Please be our guest next Thursday and take $20 off any bill over $50." },

  // FRIDAY (Focus: Busy nights. VIP treatment, priority seating, NO heavy discounts that hurt margins)
  { id: "fri-1", category: "friday", text: "We dropped the ball. Next time you come in on a Friday, reply to this text and I will personally bump you to the front of the waitlist." },
  { id: "fri-2", category: "friday", text: "Friday night VIP: Next time you join us, show this for a complimentary Champagne toast or signature mocktail on arrival." },
  { id: "fri-3", category: "friday", text: "We want you back. Next Friday, you get priority patio/window seating. Just mention this text when booking." },
  { id: "fri-4", category: "friday", text: "Let us roll out the red carpet. Next Friday, the Chef will send a complimentary tasting directly to your table." },
  { id: "fri-5", category: "friday", text: "Friday redemption. We can't discount our busy nights, but we WILL comp your dessert menu entirely." },
  { id: "fri-6", category: "friday", text: "Skip the Friday wait! Text this number 30 minutes before arrival and we'll have your table ready." },
  { id: "fri-7", category: "friday", text: "Friday night VIP treatment: Complimentary valet parking (or cover charge) and a free appetizer on your next visit." },

  // SATURDAY (Focus: Peak hours. Exclusivity, fast-tracking, high-perceived-value/low-cost freebies)
  { id: "sat-1", category: "saturday", text: "Saturday night is crazy, and we failed you. Next Saturday, bypass the host stand and ask for the manager. We have a surprise for you." },
  { id: "sat-2", category: "saturday", text: "Give us a second chance on our busiest night. Next Saturday, your table's first round of drinks is instantly comped." },
  { id: "sat-3", category: "saturday", text: "Saturday VIP Pass: Show this text next weekend to skip the line entirely." },
  { id: "sat-4", category: "saturday", text: "We are so sorry about your Saturday visit. Come back next week and let us treat your table to our signature dessert platter." },
  { id: "sat-5", category: "saturday", text: "Next Saturday, let us host you properly. Priority reservation access and a free appetizer." },
  { id: "sat-6", category: "saturday", text: "Saturday redemption: We'll waive any corkage or cake fees, plus send over a free starter." },
  { id: "sat-7", category: "saturday", text: "We know Saturday was rough. Reply to this when you're outside next Saturday and I'll walk you right to a table." },

  // SUNDAY (Focus: Brunch, family day, end of week relaxation)
  { id: "sun-1", category: "sunday", text: "Sundays are for family. Come back next Sunday and Kids Eat Free on us." },
  { id: "sun-2", category: "sunday", text: "Let us fix our mistake. Next Sunday brunch, your Mimosas or premium coffees are bottomless and on the house." },
  { id: "sun-3", category: "sunday", text: "Sunday reset: We'll take 20% off your entire Sunday lunch bill next week." },
  { id: "sun-4", category: "sunday", text: "We want to see you smile. Join us next Sunday evening for a Buy-One-Get-One Free main course." },
  { id: "sun-5", category: "sunday", text: "Sunday special: Complimentary shareable appetizer for the whole table." },
  { id: "sun-6", category: "sunday", text: "End your weekend right. Show this next Sunday for a free dessert with every entree purchased." },
  { id: "sun-7", category: "sunday", text: "We value you. Next Sunday, let us cover 50% of your total food bill." }
];

export function getRandomOfferForDay(dateStr: string | Date): WinBackOffer {
  const date = new Date(dateStr);
  const days: DayCategory[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = days[date.getDay()];
  
  const eligibleOffers = RETENTION_OFFERS.filter(offer => offer.category === dayName);
  
  if (eligibleOffers.length === 0) {
    return RETENTION_OFFERS[0]; // Fallback
  }
  
  // Pick a random offer from the eligible ones
  const randomIndex = Math.floor(Math.random() * eligibleOffers.length);
  return eligibleOffers[randomIndex];
}
