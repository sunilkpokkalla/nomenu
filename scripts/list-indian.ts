import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

const isIndian = (dish: any) => dish.cuisines && dish.cuisines.some((c: string) => c.toLowerCase().includes('indian') || c.toLowerCase().includes('street food'));

const falAiDishes = GLOBAL_DISH_LIBRARY.filter(isIndian).map(d => d.name);

console.log(falAiDishes.join('\n'));
