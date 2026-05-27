export type DayCategory = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface LoyaltyIdea {
  id: string;
  category: DayCategory;
  text: string;
}

export const LOYALTY_IDEAS: LoyaltyIdea[] = [
  // MONDAY (14 Ideas - Focus: Beating Monday blues, exclusive tasting invites, start of week perks)
  { id: "L-mon-1", category: "monday", text: "We love 5-star customers! Stop by next Monday and we'll let you taste-test a secret menu item not available to the public." },
  { id: "L-mon-2", category: "monday", text: "Beat the Monday blues. Your next Monday coffee or mocktail is on the house!" },
  { id: "L-mon-3", category: "monday", text: "Thanks for the amazing review! Bring a coworker next Monday and their lunch is 50% off." },
  { id: "L-mon-4", category: "monday", text: "You made our day. Next Monday evening, we'll send a complimentary chef's tasting board to your table." },
  { id: "L-mon-5", category: "monday", text: "Start your week right! Reply 'VIP' and we'll reserve our best table for you next Monday." },
  { id: "L-mon-6", category: "monday", text: "Thanks for the 5 stars! Next Monday, you get double loyalty points on every dollar spent." },
  { id: "L-mon-7", category: "monday", text: "We appreciate you! Join us next Monday and we'll upgrade your entree to a premium cut or size." },
  { id: "L-mon-8", category: "monday", text: "Monday VIP perk: Let us treat you to a free signature dessert next time you visit on a Monday." },
  { id: "L-mon-9", category: "monday", text: "Your review was awesome. Stop by next Monday and ask for the Manager—we have a small gift bag for you." },
  { id: "L-mon-10", category: "monday", text: "We're testing new flavors next Monday. Show this text to get a free side of our experimental dish!" },
  { id: "L-mon-11", category: "monday", text: "Thanks for the love! Next Monday, your entire party gets a free round of non-alcoholic specialty drinks." },
  { id: "L-mon-12", category: "monday", text: "You rock! Next Monday, buy any entree and get a second one completely free to share." },
  { id: "L-mon-13", category: "monday", text: "We noticed your 5-star review! Next time you visit on a Monday, we'll waive all premium add-on fees for your meal." },
  { id: "L-mon-14", category: "monday", text: "Monday motivation: Show this text next week for a free premium appetizer." },

  // TUESDAY (14 Ideas - Focus: Mid-week momentum, bringing friends, casual upgrades)
  { id: "L-tue-1", category: "tuesday", text: "Thanks for the 5 stars! Next Tuesday, your first round of craft tacos (or sliders) is on us." },
  { id: "L-tue-2", category: "tuesday", text: "You are the best. Bring up to 3 friends next Tuesday and we will send a massive free appetizer platter to share." },
  { id: "L-tue-3", category: "tuesday", text: "We appreciate your review! Reply to this text to lock in a guaranteed patio seat next Tuesday." },
  { id: "L-tue-4", category: "tuesday", text: "Tuesday VIP treat: Show this text for a complimentary glass of our house wine or draft beer." },
  { id: "L-tue-5", category: "tuesday", text: "You made us smile today. Next Tuesday, any dessert you order is completely free." },
  { id: "L-tue-6", category: "tuesday", text: "Thanks for the stellar review! We are hosting a mini-tasting next Tuesday, show this to get free samples." },
  { id: "L-tue-7", category: "tuesday", text: "Tuesday perk: Get a free branded glass or mug when you dine with us next Tuesday." },
  { id: "L-tue-8", category: "tuesday", text: "We love our regulars. Bring your family next Tuesday and we'll cover the kids' meals." },
  { id: "L-tue-9", category: "tuesday", text: "Thanks for the amazing feedback! Next Tuesday, your check will automatically have 15% taken off as a thank you." },
  { id: "L-tue-10", category: "tuesday", text: "You're a VIP! Next Tuesday, we'll have a custom-made mocktail waiting for you." },
  { id: "L-tue-11", category: "tuesday", text: "Thanks for loving our food! Next Tuesday, we'll let you build-your-own combo off the menu for a flat price." },
  { id: "L-tue-12", category: "tuesday", text: "We appreciate you. Next Tuesday, we're giving you a 'Skip the Line' pass. Walk right in!" },
  { id: "L-tue-13", category: "tuesday", text: "Tuesday surprise: We'll send a complimentary chef's special side dish to your table." },
  { id: "L-tue-14", category: "tuesday", text: "Thanks for the 5 stars! Next Tuesday, grab a free premium coffee and pastry on your way out." },

  // WEDNESDAY (14 Ideas - Focus: Hump day, wine pairings, exclusive mid-week events)
  { id: "L-wed-1", category: "wednesday", text: "Happy Hump Day! Thanks for the 5 stars. Next Wednesday, we'll pair your meal with a free wine tasting." },
  { id: "L-wed-2", category: "wednesday", text: "You're amazing. Next Wednesday, we're hosting a 'Meet the Chef' kitchen tour for VIPs. Show this text to join." },
  { id: "L-wed-3", category: "wednesday", text: "Thanks for the great review! Next Wednesday, any bottle of wine for your table is half-price." },
  { id: "L-wed-4", category: "wednesday", text: "Wednesday perk: Let us cover your appetizers next week to get you through the mid-week slump." },
  { id: "L-wed-5", category: "wednesday", text: "We appreciate you! Next Wednesday, we'll seat you at the 'Chef's Table' for an exclusive view." },
  { id: "L-wed-6", category: "wednesday", text: "Thanks for the 5 stars! Bring your team from work next Wednesday and we'll send over two free sharing platters." },
  { id: "L-wed-7", category: "wednesday", text: "Wednesday surprise: Order any main course and we will completely comp your dessert." },
  { id: "L-wed-8", category: "wednesday", text: "You rock! Next Wednesday, reply 'Reserve' and we will hold our best booth just for you." },
  { id: "L-wed-9", category: "wednesday", text: "Thanks for the love! Next Wednesday, we'll add a complimentary specialty topping or side to your meal." },
  { id: "L-wed-10", category: "wednesday", text: "Wednesday VIP treatment: We'll bring a complimentary amuse-bouche (bite-sized appetizer) to your table before you order." },
  { id: "L-wed-11", category: "wednesday", text: "We love our 5-star customers. Next Wednesday, take home a free bottle of our house-made sauce/dressing." },
  { id: "L-wed-12", category: "wednesday", text: "Thanks for the stellar feedback! Next Wednesday, enjoy an automatic VIP 20% discount on your entire bill." },
  { id: "L-wed-13", category: "wednesday", text: "Wednesday treat: Free premium non-alcoholic beverages for your entire table." },
  { id: "L-wed-14", category: "wednesday", text: "You made our day. Next Wednesday, the chef will personally come out and say thank you with a special treat." },

  // THURSDAY (15 Ideas - Focus: Thursday night football/sports, early weekend kickoff, groups)
  { id: "L-thu-1", category: "thursday", text: "Kick off the weekend early! Next Thursday, your first round of drafts or cocktails is on the house." },
  { id: "L-thu-2", category: "thursday", text: "Thanks for the 5 stars! Next Thursday, bring a group of 4+ and we will send out a giant free nacho/appetizer board." },
  { id: "L-thu-3", category: "thursday", text: "You are the best. Next Thursday night, we're giving you priority seating right in front of the big screens." },
  { id: "L-thu-4", category: "thursday", text: "Thursday VIP: We'll waive the corkage fee if you want to bring your own special bottle next Thursday." },
  { id: "L-thu-5", category: "thursday", text: "Thanks for the amazing review! Next Thursday, we'll upgrade your meal to the 'Jumbo' size for free." },
  { id: "L-thu-6", category: "thursday", text: "Early weekend treat: Show this text next Thursday for a complimentary slice of our famous cake." },
  { id: "L-thu-7", category: "thursday", text: "We appreciate you! Next Thursday, you get early access to our weekend specials menu." },
  { id: "L-thu-8", category: "thursday", text: "Thursday surprise: Free bottomless chips/bread and dips for your entire table next week." },
  { id: "L-thu-9", category: "thursday", text: "Thanks for the 5 stars! Next Thursday, reply to this text to skip the waitlist entirely." },
  { id: "L-thu-10", category: "thursday", text: "You rock! Next Thursday, we'll give you a VIP 'Buy One Get One' on any menu item." },
  { id: "L-thu-11", category: "thursday", text: "Thursday VIP treatment: We'll send a complimentary sampler of our 3 best appetizers to your table." },
  { id: "L-thu-12", category: "thursday", text: "We love our regulars. Next Thursday, ask for the manager and get a $15 gift card for a future visit." },
  { id: "L-thu-13", category: "thursday", text: "Thanks for the love! Next Thursday, any premium sides or add-ons are completely free for your table." },
  { id: "L-thu-14", category: "thursday", text: "Thursday special: Bring a date and we will cover both of your desserts." },
  { id: "L-thu-15", category: "thursday", text: "You made our day. Next Thursday, we'll give you a free branded t-shirt or hat when you dine with us!" },

  // FRIDAY (15 Ideas - Focus: Extremely busy night. Pure VIP treatment, skip the line, fast-tracking)
  { id: "L-fri-1", category: "friday", text: "Friday nights are crazy, but you're a VIP. Text us 30 mins before you arrive next Friday and you will SKIP the entire waitlist." },
  { id: "fri-2", category: "friday", text: "Thanks for the 5 stars! Next Friday, we will have a complimentary glass of champagne waiting for you when you sit down." },
  { id: "fri-3", category: "friday", text: "You're amazing. Next Friday, we'll upgrade your reservation to our best private/window table." },
  { id: "fri-4", category: "friday", text: "Friday VIP perk: We'll cover your valet parking or cover charge next time you visit on a weekend." },
  { id: "fri-5", category: "friday", text: "Thanks for the stellar review! Next Friday, the Chef will send a VIP tasting plate directly to your table." },
  { id: "fri-6", category: "friday", text: "We appreciate you! Next Friday, show this text to bypass the host stand and walk straight to the bar for priority service." },
  { id: "fri-7", category: "friday", text: "Friday surprise: We'll waive any cake or corkage fees for your table next weekend." },
  { id: "fri-8", category: "friday", text: "You rock! Next Friday, we're giving you a 'Fast Track' pass for your takeout/delivery order so it's made first." },
  { id: "fri-9", category: "friday", text: "Thanks for the love! Next Friday, your table will get a complimentary VIP dessert tower to finish the night." },
  { id: "fri-10", category: "friday", text: "Friday VIP treatment: The manager will personally greet your table with a complimentary round of shots/mocktails." },
  { id: "fri-11", category: "friday", text: "We love our 5-star customers. Next Friday, you'll get exclusive access to our 'Reserve' wine list at normal prices." },
  { id: "fri-12", category: "friday", text: "Thanks for the amazing feedback! Next Friday, we'll comp all non-alcoholic drinks and coffees for your entire party." },
  { id: "fri-13", category: "friday", text: "Friday perk: Show this text next weekend for a free premium appetizer." },
  { id: "fri-14", category: "friday", text: "You made our day. Next Friday, we'll give you a 'Golden Ticket' for 20% off your NEXT visit." },
  { id: "fri-15", category: "friday", text: "Friday night VIP: Let us set up a special customized menu with your name on it for your next Friday date night." },

  // SATURDAY (14 Ideas - Focus: Date nights, celebrations, high perceived value freebies)
  { id: "L-sat-1", category: "saturday", text: "Saturday night VIP: Thanks for the 5 stars! Next Saturday, text us and we will bump you to the front of the line." },
  { id: "L-sat-2", category: "saturday", text: "You are the best. Celebrating something next Saturday? Let us know and we'll send a complimentary sparkler dessert." },
  { id: "L-sat-3", category: "saturday", text: "Thanks for the amazing review! Next Saturday, we'll set up your table with complimentary bread, dips, and a welcome drink." },
  { id: "L-sat-4", category: "saturday", text: "Saturday perk: Show this text to get access to our 'Secret Menu' that only regulars know about." },
  { id: "L-sat-5", category: "saturday", text: "We appreciate you! Next Saturday, the Chef will personally prepare an off-menu appetizer just for you." },
  { id: "L-sat-6", category: "saturday", text: "Thanks for the 5 stars! Next Saturday, we'll give you priority access to our outdoor/rooftop seating." },
  { id: "L-sat-7", category: "saturday", text: "Saturday surprise: Your first round of signature cocktails is entirely on us next weekend." },
  { id: "L-sat-8", category: "saturday", text: "You rock! Next Saturday, buy any premium steak/seafood and we will cover the cost of all sides." },
  { id: "L-sat-9", category: "saturday", text: "Thanks for the love! Next Saturday, we'll give you a complimentary VIP tasting flight of our craft beers/wines." },
  { id: "L-sat-10", category: "saturday", text: "Saturday VIP treatment: We'll cover your coat check and valet parking next weekend." },
  { id: "L-sat-11", category: "saturday", text: "We love our regulars. Next Saturday, we'll send you home with a free dessert to enjoy later." },
  { id: "L-sat-12", category: "saturday", text: "Thanks for the stellar feedback! Next Saturday, any appetizers you order are 50% off." },
  { id: "L-sat-13", category: "saturday", text: "Saturday perk: Bring a date and we'll give you a complimentary appetizer to share." },
  { id: "L-sat-14", category: "saturday", text: "You made our day. Next Saturday, we'll upgrade your wine glass to a premium pour at no extra charge." },

  // SUNDAY (14 Ideas - Focus: Family days, brunch, toys for kids, relaxing end-of-week)
  { id: "L-sun-1", category: "sunday", text: "We love 5-star reviews! Next Sunday you come in with the family, ask for the 'Treasure Chest'—we have a free toy waiting for your kids." },
  { id: "L-sun-2", category: "sunday", text: "Thanks for the amazing review! Next Sunday brunch, your Mimosas or premium coffees are bottomless and free." },
  { id: "L-sun-3", category: "sunday", text: "You are the best. Next Sunday, the kids' meals are completely on the house." },
  { id: "L-sun-4", category: "sunday", text: "Sunday VIP perk: Show this text next weekend for a complimentary family-style dessert platter." },
  { id: "L-sun-5", category: "sunday", text: "We appreciate you! Next Sunday, we're giving you a 'Skip the Line' pass for our busy brunch rush." },
  { id: "L-sun-6", category: "sunday", text: "Thanks for the 5 stars! Next Sunday, we'll let the kids build their own ice cream sundae in the kitchen!" },
  { id: "L-sun-7", category: "sunday", text: "Sunday surprise: Take 20% off your entire family's food bill next weekend." },
  { id: "L-sun-8", category: "sunday", text: "You rock! Next Sunday, we'll send over a free basket of fresh-baked pastries or bread to start your meal." },
  { id: "L-sun-9", category: "sunday", text: "Thanks for the love! Next Sunday, bring the grandparents and we'll comp their meals entirely." },
  { id: "L-sun-10", category: "sunday", text: "Sunday VIP treatment: We'll reserve our best, most comfortable oversized booth just for your family." },
  { id: "L-sun-11", category: "sunday", text: "We love our regulars. Next Sunday, your first round of fresh-pressed juices or smoothies is on us." },
  { id: "L-sun-12", category: "sunday", text: "Thanks for the stellar feedback! Next Sunday, we'll give you a free branded coloring book and crayons for the kids." },
  { id: "L-sun-13", category: "sunday", text: "Sunday perk: We'll waive any sharing/split-plate fees for your family next weekend." },
  { id: "L-sun-14", category: "sunday", text: "You made our day. Next Sunday, ask for the Chef and they'll come out to personally thank your family with a treat." }
];

export function getRandomLoyaltyIdeaForDay(dateStr: string | Date): LoyaltyIdea {
  const date = new Date(dateStr);
  const days: DayCategory[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = days[date.getDay()];
  
  const eligibleIdeas = LOYALTY_IDEAS.filter(idea => idea.category === dayName);
  
  if (eligibleIdeas.length === 0) {
    return LOYALTY_IDEAS[0]; // Fallback
  }
  
  // Pick a random idea from the eligible ones
  const randomIndex = Math.floor(Math.random() * eligibleIdeas.length);
  return eligibleIdeas[randomIndex];
}
