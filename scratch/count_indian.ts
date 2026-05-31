import { GLOBAL_DISH_LIBRARY } from "../src/lib/global-dish-library.js";

const indianDishes = GLOBAL_DISH_LIBRARY.filter(d => d.cuisines.includes("indian"));
console.log(`Found ${indianDishes.length} indian dishes.`);
indianDishes.slice(0, 10).forEach(d => console.log(d.name));
