export interface LibraryDish {
  name: string;
  category: string;
  cuisines: string[];
  description: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  suggestedCookingTime?: number;
  imageUrl?: string; // Optional image fetched from open source APIs
}

export const GLOBAL_DISH_LIBRARY: LibraryDish[] = [
  {
    name: "Soupe à l'Oignon Gratinée",
    category: "Starters",
    cuisines: ["french", "bistro"],
    description:
      "Classic French onion soup topped with a toasted baguette slice and melted Gruyère cheese.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Escargots de Bourgogne",
    category: "Starters",
    cuisines: ["french", "bistro", "fine dining"],
    description:
      "Snail delicacy baked in its shell with a rich, fragrant garlic and parsley butter.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Pâté de Campagne",
    category: "Starters",
    cuisines: ["french", "bistro"],
    description:
      "Rustic pork and liver pâté served with cornichons, Dijon mustard, and toasted sourdough.",
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Gougères",
    category: "Starters",
    cuisines: ["french"],
    description:
      "Warm, savory choux pastry puffs baked with aged Comté cheese.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Tartare de Bœuf",
    category: "Starters",
    cuisines: ["french", "bistro"],
    description:
      "Hand-chopped raw beef tenderloin seasoned with capers, shallots, egg yolk, and Dijon mustard.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Foie Gras Poêlé",
    category: "Starters",
    cuisines: ["french", "fine dining"],
    description:
      "Seared duck liver served with a sweet fig compote and toasted brioche.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Salade Lyonnaise",
    category: "Starters",
    cuisines: ["french", "bistro"],
    description:
      "Frisée lettuce tossed with warm bacon lardons, croutons, and topped with a poached egg.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Bisque de Homard",
    category: "Starters",
    cuisines: ["french", "fine dining"],
    description:
      "A velvety, rich lobster soup infused with cognac and fresh cream.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Camembert Rôti",
    category: "Starters",
    cuisines: ["french", "bistro"],
    description:
      "Whole roasted Camembert cheese infused with garlic and rosemary, served with crusty bread.",
    isVegetarian: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Quiche Lorraine",
    category: "Starters",
    cuisines: ["french", "bistro", "cafe"],
    description:
      "Classic savory tart filled with a rich egg custard, smoked bacon, and Gruyère cheese.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Coq au Vin",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "Tender chicken braised slowly in red Burgundy wine with mushrooms, pearl onions, and bacon.",
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Bœuf Bourguignon",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "Classic beef stew simmered in red wine with carrots, onions, garlic, and a bouquet garni.",
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Canard à l'Orange",
    category: "Main Courses",
    cuisines: ["french", "fine dining"],
    description:
      "Crispy roasted duck breast dressed in a sweet and savory bitter-orange glaze.",
    suggestedCookingTime: 35,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Bouillabaisse",
    category: "Main Courses",
    cuisines: ["french", "seafood"],
    description:
      "Traditional Provençal fish stew heavily infused with saffron, fennel, and orange zest, served with rouille.",
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Steak Frites",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "Pan-seared ribeye steak slathered in herb butter, served with a mountain of crispy golden frites.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Ratatouille Niçoise",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "A vibrant, slow-stewed medley of eggplant, zucchini, bell peppers, tomatoes, and Herbes de Provence.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Cassoulet",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "Rich, slow-cooked casserole from the South of France featuring white beans, duck confit, and garlic sausage.",
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Confit de Canard",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "Duck legs slow-cooked in their own fat until meltingly tender, then roasted until crisp.",
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Blanquette de Veau",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "A classic, comforting veal ragout cooked in a rich, velvety white sauce with button mushrooms.",
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Sole Meunière",
    category: "Main Courses",
    cuisines: ["french", "fine dining"],
    description:
      "Delicate whole Dover sole pan-fried in brown butter, lemon, and fresh parsley.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Poulet Rôti",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "Half a chicken beautifully roasted with lemon, garlic, and thyme, served with buttered green beans.",
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Magret de Canard",
    category: "Main Courses",
    cuisines: ["french", "fine dining"],
    description:
      "Pan-seared duck breast served pink, paired with a rich cherry reduction.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Châteaubriand",
    category: "Main Courses",
    cuisines: ["french", "fine dining"],
    description:
      "A thick, center-cut beef tenderloin roasted to perfection, served with Béarnaise sauce.",
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Moules Marinières",
    category: "Main Courses",
    cuisines: ["french", "bistro", "seafood"],
    description:
      "Fresh mussels steamed in white wine, garlic, shallots, and parsley, served with crusty baguette.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Hachis Parmentier",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "The elegant French cousin to Shepherd's Pie, made with slow-braised beef topped with creamy mashed potatoes.",
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Filet Mignon au Poivre",
    category: "Main Courses",
    cuisines: ["french", "fine dining"],
    description:
      "Tender beef filet encrusted with cracked black peppercorns and bathed in a creamy cognac sauce.",
    isSpicy: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Navarin d'Agneau",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "A delicate spring lamb stew simmered with baby turnips, carrots, and peas.",
    suggestedCookingTime: 50,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Gratin Dauphinois",
    category: "Main Courses",
    cuisines: ["french", "bistro"],
    description:
      "Thinly sliced potatoes slow-baked in heavy cream, garlic, and nutmeg.",
    isVegetarian: true,
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Salade Niçoise",
    category: "Main Courses",
    cuisines: ["french", "cafe"],
    description:
      "Composed salad with seared tuna, green beans, hard-boiled eggs, tomatoes, olives, and anchovies.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Croque Monsieur",
    category: "Main Courses",
    cuisines: ["french", "cafe", "bistro"],
    description:
      "The ultimate toasted ham and Gruyère cheese sandwich, smothered in rich Béchamel sauce.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/sandwich.png",
  },
  {
    name: "Pommes Purée",
    category: "Sides",
    cuisines: ["french"],
    description:
      "Incredibly smooth and rich mashed potatoes made with an obscene amount of butter.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Haricots Verts Amandine",
    category: "Sides",
    cuisines: ["french"],
    description:
      "Crisp-tender French green beans sautéed in butter with toasted almonds.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Pommes Frites",
    category: "Sides",
    cuisines: ["french", "bistro"],
    description:
      "Classic double-fried potatoes, crispy on the outside and fluffy inside, served with aioli.",
    isVegetarian: true,
    isVegan: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Gratin de Macaronis",
    category: "Sides",
    cuisines: ["french", "bistro"],
    description:
      "French-style baked macaroni with Gruyère, Emmental, and a touch of nutmeg.",
    isVegetarian: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Champignons Sauvages",
    category: "Sides",
    cuisines: ["french", "fine dining"],
    description:
      "Wild mushrooms pan-roasted with garlic, shallots, and fresh herbs.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Asperges Sauce Hollandaise",
    category: "Sides",
    cuisines: ["french", "fine dining"],
    description:
      "Steamed white asparagus spears draped in a rich, buttery hollandaise sauce.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Pommes Anna",
    category: "Sides",
    cuisines: ["french", "fine dining"],
    description:
      "Thinly sliced potatoes baked in clarified butter until crisp and golden.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Petits Pois à la Française",
    category: "Sides",
    cuisines: ["french"],
    description:
      "Spring peas gently braised with pearl onions, lettuce, and butter.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Salade Verte",
    category: "Sides",
    cuisines: ["french", "bistro"],
    description:
      "Simple mixed green salad dressed perfectly with a classic Dijon vinaigrette.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Tomates à la Provençale",
    category: "Sides",
    cuisines: ["french"],
    description:
      "Halved tomatoes roasted with a crust of garlic, parsley, and breadcrumbs.",
    isVegetarian: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Crème Brûlée",
    category: "Desserts",
    cuisines: ["french", "bistro"],
    description:
      "Rich vanilla bean custard topped with a contrasting layer of hard, caramelized sugar.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Tarte Tatin",
    category: "Desserts",
    cuisines: ["french", "bistro", "bakery"],
    description:
      "Classic upside-down apple tart with deep caramel notes, served warm with crème fraîche.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Mousse au Chocolat",
    category: "Desserts",
    cuisines: ["french", "bistro"],
    description:
      "Incredibly airy and intense dark chocolate mousse topped with cocoa shavings.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Profiteroles",
    category: "Desserts",
    cuisines: ["french", "bistro"],
    description:
      "Choux pastry puffs filled with vanilla ice cream and drenched in warm chocolate sauce.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Île Flottante",
    category: "Desserts",
    cuisines: ["french", "fine dining"],
    description:
      "A light poached meringue 'island' floating on a sea of vanilla crème anglaise, topped with spun caramel.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Soufflé au Grand Marnier",
    category: "Desserts",
    cuisines: ["french", "fine dining"],
    description:
      "A towering, delicate soufflé infused with orange liqueur, served immediately upon baking.",
    isVegetarian: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Mille-Feuille",
    category: "Desserts",
    cuisines: ["french", "bakery"],
    description:
      "Three layers of crisp puff pastry alternating with rich vanilla pastry cream.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Macarons Assortis",
    category: "Desserts",
    cuisines: ["french", "bakery"],
    description:
      "A selection of delicate almond meringue cookies with diverse buttercream and ganache fillings.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Tarte au Citron Meringuée",
    category: "Desserts",
    cuisines: ["french", "bistro", "bakery"],
    description:
      "A sharp, tangy lemon curd tart crowned with fluffy, toasted meringue.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Éclair au Chocolat",
    category: "Desserts",
    cuisines: ["french", "bakery"],
    description:
      "Oblong choux pastry filled with chocolate custard and topped with glossy chocolate icing.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Bruschetta al Pomodoro",
    category: "Starters",
    cuisines: ["italian", "bistro"],
    description:
      "Grilled rustic bread rubbed with garlic and topped with fresh tomatoes, basil, and extra virgin olive oil.",
    isVegan: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Burrata e Prosciutto",
    category: "Starters",
    cuisines: ["italian", "fine dining"],
    description:
      "Creamy heart burrata served with thinly sliced Prosciutto di Parma and a balsamic glaze.",
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Arancini al Ragù",
    category: "Starters",
    cuisines: ["italian", "street food"],
    description:
      "Crispy, golden-fried risotto balls stuffed with a rich beef ragù and mozzarella center.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Calamari Fritti",
    category: "Starters",
    cuisines: ["italian", "seafood"],
    description:
      "Lightly dusted, crispy fried squid rings served with a side of zesty marinara sauce and lemon.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Carpaccio di Manzo",
    category: "Starters",
    cuisines: ["italian", "fine dining"],
    description:
      "Paper-thin slices of raw beef tenderloin drizzled with olive oil, lemon, and shaved Parmesan.",
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Insalata Caprese",
    category: "Starters",
    cuisines: ["italian", "bistro"],
    description:
      "Fresh buffalo mozzarella, ripe vine tomatoes, and basil leaves dressed with premium olive oil.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Polpette della Nonna",
    category: "Starters",
    cuisines: ["italian", "bistro"],
    description:
      "Classic Italian meatballs simmered in a slow-cooked tomato sauce, served with toasted focaccia.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Fritto Misto",
    category: "Starters",
    cuisines: ["italian", "seafood"],
    description:
      "A crispy mix of lightly fried seafood and vegetables, perfectly seasoned with sea salt.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Melanzane alla Parmigiana",
    category: "Starters",
    cuisines: ["italian", "bistro"],
    description:
      "Baked layers of thinly sliced eggplant, mozzarella, parmesan, and rich tomato sauce.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Zuppa Toscana",
    category: "Starters",
    cuisines: ["italian"],
    description:
      "Hearty Tuscan soup loaded with spicy Italian sausage, kale, and potatoes in a creamy broth.",
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Spaghetti Carbonara",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Authentic Roman pasta dish with guanciale, pecorino romano, egg yolks, and heavy black pepper.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Lasagna al Forno",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Oven-baked layers of fresh pasta, rich Bolognese ragù, velvety béchamel, and parmesan.",
    suggestedCookingTime: 35,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Risotto ai Funghi Porcini",
    category: "Main Courses",
    cuisines: ["italian", "fine dining"],
    description:
      "Creamy Arborio rice slowly simmered with earthy porcini mushrooms, white wine, and parmesan.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Ossobuco alla Milanese",
    category: "Main Courses",
    cuisines: ["italian", "fine dining"],
    description:
      "Slow-braised veal shanks with vegetables, white wine, and broth, finished with vibrant gremolata.",
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Pizza Margherita",
    category: "Main Courses",
    cuisines: ["italian", "pizza"],
    description:
      "Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala, and basil.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/pizza.png",
  },
  {
    name: "Tagliatelle al Ragù Bolognese",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Ribbons of egg pasta tossed in a slow-cooked, rich meat sauce from Bologna.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Cacio e Pepe",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "A minimalist Roman masterpiece: spaghetti coated in a creamy emulsion of Pecorino Romano and toasted black pepper.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Saltimbocca alla Romana",
    category: "Main Courses",
    cuisines: ["italian", "fine dining"],
    description:
      "Pan-fried veal medallions wrapped in prosciutto and sage, glazed with a white wine sauce.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Bistecca alla Fiorentina",
    category: "Main Courses",
    cuisines: ["italian", "fine dining"],
    description:
      "Massive, thick-cut T-bone steak grilled rare over wood fire, simply dressed with olive oil and coarse salt.",
    isGlutenFree: true,
    suggestedCookingTime: 35,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Linguine alle Vongole",
    category: "Main Courses",
    cuisines: ["italian", "seafood"],
    description:
      "Linguine tossed with fresh clams, white wine, garlic, parsley, and a touch of chili flakes.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Ravioli Ricotta e Spinaci",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Handmade pasta parcels filled with ricotta and spinach, served in a sage-infused brown butter sauce.",
    isVegetarian: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Pizza Diavola",
    category: "Main Courses",
    cuisines: ["italian", "pizza"],
    description:
      "Wood-fired pizza topped with tomato sauce, mozzarella, and spicy Calabrian salami.",
    isSpicy: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/pizza.png",
  },
  {
    name: "Gnocchi al Pesto Genovese",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Pillowy potato dumplings coated in a vibrant, fresh basil and pine nut pesto.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Pappardelle al Cinghiale",
    category: "Main Courses",
    cuisines: ["italian", "fine dining"],
    description:
      "Wide pasta ribbons served with a robust, slow-braised wild boar ragù.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Pollo alla Cacciatora",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Rustic 'hunter-style' chicken braised with tomatoes, onions, herbs, and red wine.",
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Spaghetti all'Amatriciana",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Pasta tossed in a zesty tomato sauce fortified with crispy guanciale and chili flakes.",
    isSpicy: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Fritto Misto di Pesce",
    category: "Main Courses",
    cuisines: ["italian", "seafood"],
    description:
      "A generous platter of assorted Mediterranean seafood, lightly battered and fried.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Orecchiette con Cime di Rapa",
    category: "Main Courses",
    cuisines: ["italian", "bistro"],
    description:
      "Little 'ear-shaped' pasta tossed with bitter broccoli rabe, garlic, and anchovies.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Risotto alla Milanese",
    category: "Main Courses",
    cuisines: ["italian", "fine dining"],
    description:
      "Golden, luxurious saffron-infused risotto, traditionally served alongside Ossobuco.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Pizza Quattro Formaggi",
    category: "Main Courses",
    cuisines: ["italian", "pizza"],
    description:
      "White pizza featuring a rich blend of Mozzarella, Gorgonzola, Fontina, and Parmigiano-Reggiano.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/pizza.png",
  },
  {
    name: "Focaccia al Rosmarino",
    category: "Sides",
    cuisines: ["italian", "bakery"],
    description:
      "Oven-baked flatbread infused with olive oil, sea salt, and fresh rosemary sprigs.",
    isVegan: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Broccoletti Saltati",
    category: "Sides",
    cuisines: ["italian"],
    description:
      "Sautéed broccoli rabe with garlic, olive oil, and a pinch of red chili flakes.",
    isVegan: true,
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Patate Arrosto",
    category: "Sides",
    cuisines: ["italian"],
    description: "Crispy roasted potatoes tossed with garlic and rosemary.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Polenta Morbida",
    category: "Sides",
    cuisines: ["italian"],
    description:
      "Creamy, slow-cooked cornmeal enriched with butter and parmesan cheese.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Insalata Mista",
    category: "Sides",
    cuisines: ["italian", "bistro"],
    description:
      "A simple mixed green salad dressed lightly with balsamic vinaigrette.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Carciofi alla Romana",
    category: "Sides",
    cuisines: ["italian"],
    description:
      "Tender artichokes slowly braised with garlic, mint, and parsley.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Verdure Grigliate",
    category: "Sides",
    cuisines: ["italian"],
    description:
      "A colorful medley of grilled zucchini, eggplant, and bell peppers drizzled with balsamic glaze.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Pane all'Aglio",
    category: "Sides",
    cuisines: ["italian"],
    description:
      "Warm, crusty Italian bread generously slathered in garlic herb butter.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Spinaci al Limone",
    category: "Sides",
    cuisines: ["italian"],
    description:
      "Fresh spinach wilted in olive oil and finished with a squeeze of fresh lemon.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Caponata Siciliana",
    category: "Sides",
    cuisines: ["italian"],
    description:
      "A sweet and sour Sicilian eggplant relish with capers, celery, and pine nuts.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Tiramisù",
    category: "Desserts",
    cuisines: ["italian", "bistro"],
    description:
      "Classic layered dessert of espresso-soaked ladyfingers, velvety mascarpone cream, and cocoa powder.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Panna Cotta",
    category: "Desserts",
    cuisines: ["italian", "fine dining"],
    description:
      "Silky vanilla cream gelatin set and served with a vibrant mixed berry compote.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Cannoli Siciliani",
    category: "Desserts",
    cuisines: ["italian", "bakery"],
    description:
      "Crispy pastry tubes filled with sweet, creamy ricotta and chocolate chips.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Gelato Artigianale",
    category: "Desserts",
    cuisines: ["italian", "cafe"],
    description:
      "A selection of authentic, slow-churned Italian ice cream (ask for today's flavors).",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Affogato al Caffè",
    category: "Desserts",
    cuisines: ["italian", "cafe"],
    description:
      "A scoop of rich vanilla gelato 'drowned' in a shot of hot, fresh espresso.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Zabaione",
    category: "Desserts",
    cuisines: ["italian", "fine dining"],
    description:
      "A warm, frothy custard made from egg yolks, sugar, and Marsala wine.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Torta della Nonna",
    category: "Desserts",
    cuisines: ["italian", "bakery"],
    description:
      "Grandmother's tart: a shortcrust pastry filled with lemon custard and topped with pine nuts.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Biscotti Cantuccini",
    category: "Desserts",
    cuisines: ["italian", "bakery"],
    description:
      "Twice-baked, crunchy almond biscuits, traditionally served with sweet Vin Santo wine.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Profiteroles al Cioccolato",
    category: "Desserts",
    cuisines: ["italian", "bistro"],
    description:
      "Choux pastry puffs generously filled with chantilly cream and smothered in dark chocolate.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Zeppole",
    category: "Desserts",
    cuisines: ["italian", "bakery", "street food"],
    description:
      "Deep-fried dough balls generously dusted with powdered sugar, crispy outside, fluffy inside.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Loaded Potato Skins",
    category: "Starters",
    cuisines: ["american diner", "pub"],
    description:
      "Crispy potato skins loaded with melted cheddar, bacon bits, sour cream, and green onions.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Buffalo Chicken Wings",
    category: "Starters",
    cuisines: ["american diner", "pub"],
    description:
      "Classic upstate NY wings tossed in spicy buffalo sauce, served with celery and blue cheese dip.",
    isSpicy: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Mozzarella Sticks",
    category: "Starters",
    cuisines: ["american diner", "fast food"],
    description:
      "Golden-fried cheese sticks served with a side of warm marinara sauce for dipping.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Spinach Artichoke Dip",
    category: "Starters",
    cuisines: ["american diner"],
    description:
      "A creamy, bubbling hot dip of spinach, artichoke hearts, and parmesan, served with tortilla chips.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Fried Pickles",
    category: "Starters",
    cuisines: ["american diner", "southern"],
    description:
      "Tangy dill pickle slices breaded and deep-fried, served with ranch dressing.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Onion Rings",
    category: "Starters",
    cuisines: ["american diner", "fast food"],
    description:
      "Thick-cut, beer-battered onion rings fried to a perfect golden crunch.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Clam Chowder",
    category: "Starters",
    cuisines: ["american diner", "seafood"],
    description:
      "Rich, creamy New England soup packed with tender clams, potatoes, and bacon.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Jalapeño Poppers",
    category: "Starters",
    cuisines: ["american diner", "tex-mex"],
    description:
      "Fresh jalapeños stuffed with cream cheese, breaded, and fried until golden brown.",
    isVegetarian: true,
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Mini Sliders",
    category: "Starters",
    cuisines: ["american diner", "pub"],
    description:
      "Three bite-sized beef burgers topped with American cheese, pickles, and ketchup.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Deviled Eggs",
    category: "Starters",
    cuisines: ["american diner", "southern"],
    description:
      "Hard-boiled egg halves filled with a creamy, mustard-spiked yolk mixture and dusted with paprika.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Classic Cheeseburger",
    category: "Main Courses",
    cuisines: ["american diner", "fast food"],
    description:
      "A juicy beef patty topped with melted American cheese, lettuce, tomato, onion, and signature sauce on a toasted bun.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/burger.png",
  },
  {
    name: "BBQ Pork Ribs",
    category: "Main Courses",
    cuisines: ["american diner", "bbq"],
    description:
      "A half rack of slow-smoked pork ribs slathered in a sweet and tangy hickory barbecue sauce.",
    isGlutenFree: true,
    suggestedCookingTime: 180,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Fried Chicken",
    category: "Main Courses",
    cuisines: ["american diner", "southern"],
    description:
      "Crispy, buttermilk-marinated fried chicken served with a side of creamy coleslaw and a biscuit.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Philly Cheesesteak",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "Thinly sliced ribeye steak grilled with onions and topped with melted provolone on a hoagie roll.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Macaroni and Cheese",
    category: "Main Courses",
    cuisines: ["american diner", "southern"],
    description:
      "A massive bowl of elbow macaroni baked in a rich, velvety sharp cheddar cheese sauce with a crispy breadcrumb topping.",
    isVegetarian: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/pasta.png",
  },
  {
    name: "Meatloaf",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "Homestyle baked beef meatloaf topped with a sweet tomato glaze, served alongside mashed potatoes.",
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Chicken Fried Steak",
    category: "Main Courses",
    cuisines: ["american diner", "southern"],
    description:
      "Tenderized beef steak, breaded and fried like chicken, smothered in rich country pepper gravy.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Pulled Pork Sandwich",
    category: "Main Courses",
    cuisines: ["american diner", "bbq"],
    description:
      "Slow-smoked pork shoulder piled high on a brioche bun, topped with tangy slaw and BBQ sauce.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/sandwich.png",
  },
  {
    name: "Grilled Cheese & Tomato Soup",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "A buttery, gooey grilled cheddar cheese sandwich served with a comforting bowl of creamy tomato soup.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/soup.png",
  },
  {
    name: "BLT Sandwich",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "Crispy thick-cut bacon, fresh iceberg lettuce, and ripe tomatoes with mayo on toasted sourdough.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/sandwich.png",
  },
  {
    name: "New York Strip Steak",
    category: "Main Courses",
    cuisines: ["american diner", "steakhouse"],
    description:
      "A prime 12oz NY Strip steak grilled to order, served with garlic herb butter.",
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Cobb Salad",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "A hearty salad composed of chopped greens, grilled chicken, bacon, hard-boiled egg, avocado, and blue cheese.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Hot Dog with Chili",
    category: "Main Courses",
    cuisines: ["american diner", "fast food"],
    description:
      "An all-beef frankfurter topped with hearty beef chili, diced onions, and yellow mustard.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Jambalaya",
    category: "Main Courses",
    cuisines: ["american diner", "cajun"],
    description:
      "A spicy Louisiana rice dish packed with shrimp, chicken, and Andouille sausage.",
    isSpicy: true,
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Shrimp and Grits",
    category: "Main Courses",
    cuisines: ["american diner", "southern"],
    description:
      "Plump sautéed shrimp served over creamy, cheesy stone-ground grits with bacon and scallions.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Club Sandwich",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "A triple-decker sandwich stacked with roasted turkey, ham, bacon, lettuce, tomato, and mayo.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/sandwich.png",
  },
  {
    name: "Beef Brisket",
    category: "Main Courses",
    cuisines: ["american diner", "bbq"],
    description:
      "Slow-smoked Texas-style beef brisket, sliced thick and served with pickles and onions.",
    isGlutenFree: true,
    suggestedCookingTime: 720,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Lobster Roll",
    category: "Main Courses",
    cuisines: ["american diner", "seafood"],
    description:
      "Chilled, sweet Maine lobster meat lightly dressed with mayo, served in a butter-toasted split-top bun.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Chicken Pot Pie",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "A comforting, creamy stew of chicken and vegetables baked under a flaky, golden pastry crust.",
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Bacon Cheeseburger",
    category: "Main Courses",
    cuisines: ["american diner"],
    description:
      "Our classic cheeseburger elevated with two slices of thick-cut, crispy smoked bacon.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/burger.png",
  },
  {
    name: "French Fries",
    category: "Sides",
    cuisines: ["american diner", "fast food"],
    description:
      "Classic shoestring potatoes fried until crispy and tossed with sea salt.",
    isVegetarian: true,
    isVegan: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Coleslaw",
    category: "Sides",
    cuisines: ["american diner", "bbq"],
    description:
      "Shredded cabbage and carrots in a creamy, tangy, sweet mayonnaise dressing.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Baked Potato",
    category: "Sides",
    cuisines: ["american diner", "steakhouse"],
    description:
      "A large Idaho potato baked until tender, served with butter, sour cream, and chives.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Corn on the Cob",
    category: "Sides",
    cuisines: ["american diner", "bbq"],
    description: "Sweet corn boiled and slathered with melted butter.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Hush Puppies",
    category: "Sides",
    cuisines: ["american diner", "southern"],
    description: "Deep-fried, savory cornbread balls.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Tater Tots",
    category: "Sides",
    cuisines: ["american diner", "fast food"],
    description:
      "Crispy, golden, bite-sized potato cylinders, a diner classic.",
    isVegetarian: true,
    isVegan: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Mashed Potatoes & Gravy",
    category: "Sides",
    cuisines: ["american diner", "southern"],
    description: "Creamy mashed potatoes topped with rich brown beef gravy.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Baked Beans",
    category: "Sides",
    cuisines: ["american diner", "bbq"],
    description:
      "Sweet and savory navy beans slow-baked with molasses and bacon.",
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Sweet Potato Fries",
    category: "Sides",
    cuisines: ["american diner"],
    description:
      "Crispy fried sweet potato strips served with a side of honey mustard.",
    isVegetarian: true,
    isVegan: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Buttermilk Biscuits",
    category: "Sides",
    cuisines: ["american diner", "southern"],
    description:
      "Two warm, flaky, freshly baked buttermilk biscuits served with honey butter.",
    isVegetarian: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "New York Cheesecake",
    category: "Desserts",
    cuisines: ["american diner", "bakery"],
    description:
      "A dense, rich, and creamy cheese filling baked on a graham cracker crust.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Apple Pie",
    category: "Desserts",
    cuisines: ["american diner", "bakery"],
    description:
      "Classic double-crust pie filled with spiced, tender apples, served warm.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Chocolate Brownie Sundae",
    category: "Desserts",
    cuisines: ["american diner"],
    description:
      "A warm, fudgy chocolate brownie topped with vanilla ice cream, hot fudge, and a cherry.",
    isVegetarian: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Pecan Pie",
    category: "Desserts",
    cuisines: ["american diner", "southern"],
    description:
      "A sweet, gooey caramel filling loaded with toasted pecans in a flaky crust.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Key Lime Pie",
    category: "Desserts",
    cuisines: ["american diner", "seafood"],
    description:
      "Tart and sweet key lime custard baked in a graham cracker crust, topped with whipped cream.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Banana Split",
    category: "Desserts",
    cuisines: ["american diner", "cafe"],
    description:
      "A classic ice cream parlor treat featuring vanilla, chocolate, and strawberry scoops over a split banana.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Milkshake",
    category: "Desserts",
    cuisines: ["american diner", "fast food"],
    description:
      "A thick, old-fashioned hand-spun milkshake (choice of Vanilla, Chocolate, or Strawberry).",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Chocolate Chip Cookies",
    category: "Desserts",
    cuisines: ["american diner", "bakery"],
    description:
      "Three oversized, warm, gooey chocolate chip cookies served fresh from the oven.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Red Velvet Cake",
    category: "Desserts",
    cuisines: ["american diner", "southern"],
    description:
      "A slice of moist crimson cocoa cake layered with tangy cream cheese frosting.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "S'mores",
    category: "Desserts",
    cuisines: ["american diner"],
    description:
      "A campfire classic made indoors: toasted marshmallows and melted chocolate sandwiched between graham crackers.",
    isVegetarian: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Guacamole & Chips",
    category: "Starters",
    cuisines: ["mexican", "taqueria"],
    description:
      "Freshly mashed avocados mixed with lime, cilantro, jalapeño, and onions. Served with warm tortilla chips.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Queso Fundido",
    category: "Starters",
    cuisines: ["mexican"],
    description:
      "A bubbling cast-iron skillet of melted Oaxaca cheese topped with spicy chorizo, served with warm flour tortillas.",
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Pico de Gallo",
    category: "Starters",
    cuisines: ["mexican", "taqueria"],
    description:
      "A refreshing, chunky salsa of fresh tomatoes, onions, cilantro, and serrano peppers.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Ceviche de Camarón",
    category: "Starters",
    cuisines: ["mexican", "seafood"],
    description:
      "Shrimp cured in fresh lime juice with tomatoes, onions, cilantro, and avocado.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Nachos Supremos",
    category: "Starters",
    cuisines: ["mexican", "tex-mex"],
    description:
      "A mountain of tortilla chips smothered in melted cheese, beans, jalapeños, sour cream, and pico de gallo.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Elote",
    category: "Starters",
    cuisines: ["mexican", "street food"],
    description:
      "Mexican street corn on the cob, slathered in mayo, cotija cheese, chili powder, and lime.",
    isVegetarian: true,
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Taquitos Dorados",
    category: "Starters",
    cuisines: ["mexican"],
    description:
      "Crispy rolled corn tortillas filled with shredded chicken, topped with lettuce, crema, and salsa verde.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Sopa de Tortilla",
    category: "Starters",
    cuisines: ["mexican"],
    description:
      "A rich tomato-chili broth poured over crispy tortilla strips, topped with avocado and queso fresco.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Tostada de Tinga",
    category: "Starters",
    cuisines: ["mexican"],
    description:
      "A crisp, flat tortilla topped with refried beans and shredded chicken in a smoky chipotle sauce.",
    isSpicy: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Chiles Toreados",
    category: "Starters",
    cuisines: ["mexican", "taqueria"],
    description:
      "Blister-fried jalapeño and serrano peppers seasoned with soy sauce and lime.",
    isVegan: true,
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Tacos al Pastor",
    category: "Main Courses",
    cuisines: ["mexican", "taqueria"],
    description:
      "Three corn tortillas filled with spit-roasted marinated pork, pineapple, cilantro, and onions.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/taco.png",
  },
  {
    name: "Enchiladas Verdes",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "Corn tortillas rolled with shredded chicken, baked in a tangy tomatillo salsa and topped with melted cheese.",
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/taco.png",
  },
  {
    name: "Fajitas de Pollo",
    category: "Main Courses",
    cuisines: ["mexican", "tex-mex"],
    description:
      "Sizzling strips of grilled chicken breast with bell peppers and onions, served with tortillas and guacamole.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Carne Asada",
    category: "Main Courses",
    cuisines: ["mexican", "taqueria"],
    description:
      "Thinly sliced, citrus-marinated skirt steak grilled over an open flame, served with rice and beans.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Mole Poblano",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "A complex, rich, and dark sauce made of chilies and chocolate, poured over tender chicken pieces.",
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Burrito de Asada",
    category: "Main Courses",
    cuisines: ["mexican", "tex-mex", "taqueria"],
    description:
      "A massive flour tortilla stuffed with grilled steak, rice, beans, cheese, and pico de gallo.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/taco.png",
  },
  {
    name: "Quesadilla de Huitlacoche",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "A blue corn tortilla folded over melted Oaxaca cheese and earthy Mexican corn truffle.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Chiles Rellenos",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "Poblano peppers roasted, stuffed with cheese, battered, fried, and smothered in tomato sauce.",
    isVegetarian: true,
    suggestedCookingTime: 35,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Pozole Rojo",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "A hearty traditional soup made with hominy corn, slow-cooked pork, and a rich red chili broth.",
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Tacos de Carnitas",
    category: "Main Courses",
    cuisines: ["mexican", "taqueria"],
    description:
      "Slow-cooked, tender pulled pork crisp-fried in its own fat, served on corn tortillas with salsa verde.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/taco.png",
  },
  {
    name: "Camarones al la Diabla",
    category: "Main Courses",
    cuisines: ["mexican", "seafood"],
    description:
      "Plump shrimp sautéed in an intensely fiery, bright red chili sauce, served with rice.",
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Chimichanga",
    category: "Main Courses",
    cuisines: ["mexican", "tex-mex"],
    description:
      "A large burrito filled with shredded beef and cheese, deep-fried until golden and crispy.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Tacos de Pescado",
    category: "Main Courses",
    cuisines: ["mexican", "seafood"],
    description:
      "Baja-style crispy battered fish served in tortillas with shredded cabbage and a creamy white sauce.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/taco.png",
  },
  {
    name: "Tamales de Puerco",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "Corn dough filled with spicy red chili pork, wrapped in a corn husk and steamed.",
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Sopes con Chorizo",
    category: "Main Courses",
    cuisines: ["mexican", "street food"],
    description:
      "Thick corn masa boats topped with refried beans, spicy crumbled chorizo, lettuce, and crema.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Barbacoa de Res",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "Beef cheek slow-steamed until incredibly tender, served with tortillas, cilantro, and onions.",
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Tlayuda",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "Oaxacan 'pizza'—a massive crispy tortilla topped with refried beans, Oaxaca cheese, and sliced meats.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Enchiladas Suizas",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "Chicken enchiladas baked in a creamy, mild green tomatillo sauce topped with melted Swiss cheese.",
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/taco.png",
  },
  {
    name: "Cochinita Pibil",
    category: "Main Courses",
    cuisines: ["mexican"],
    description:
      "Yucatan-style slow-roasted pork marinated in achiote and citrus, wrapped in banana leaves.",
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Fajitas Vegetarianas",
    category: "Main Courses",
    cuisines: ["mexican", "tex-mex"],
    description:
      "A sizzling platter of grilled bell peppers, onions, zucchini, and mushrooms with tortillas.",
    isVegetarian: true,
    isVegan: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Arroz Mexicano",
    category: "Sides",
    cuisines: ["mexican"],
    description:
      "Fluffy, savory rice cooked in a tomato and chicken broth with peas and carrots.",
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Frijoles Refritos",
    category: "Sides",
    cuisines: ["mexican"],
    description:
      "Pinto beans cooked until tender and mashed with a hint of onion and garlic.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Frijoles Charros",
    category: "Sides",
    cuisines: ["mexican"],
    description:
      "A flavorful, soupy bowl of pinto beans stewed with bacon, chorizo, jalapeños, and tomatoes.",
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Tortillas de Maíz Hechas a Mano",
    category: "Sides",
    cuisines: ["mexican", "taqueria"],
    description: "A stack of warm, fresh, handmade corn tortillas.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Cebollitas Asadas",
    category: "Sides",
    cuisines: ["mexican", "taqueria"],
    description:
      "Grilled knob onions charred over an open flame with lime and salt.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Nopales en Ensalada",
    category: "Sides",
    cuisines: ["mexican"],
    description:
      "A refreshing salad made of tender cactus paddles, tomatoes, onions, cilantro, and lime.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Plátanos Fritos",
    category: "Sides",
    cuisines: ["mexican"],
    description:
      "Sweet plantains fried until caramelized, often served with a drizzle of crema.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Salsa Roja y Verde",
    category: "Sides",
    cuisines: ["mexican", "taqueria"],
    description:
      "A side serving of our house-made spicy red and tangy green salsas.",
    isVegan: true,
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Chicharrón",
    category: "Sides",
    cuisines: ["mexican", "street food"],
    description:
      "Crispy, puffy fried pork rinds, perfect for dipping in salsa or guacamole.",
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Calabacitas con Elote",
    category: "Sides",
    cuisines: ["mexican"],
    description:
      "Zucchini sautéed with sweet corn kernels, tomatoes, and onions.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Churros con Chocolate",
    category: "Desserts",
    cuisines: ["mexican", "street food", "bakery"],
    description:
      "Crispy, star-shaped dough piped and fried, dusted in cinnamon sugar, served with a rich chocolate dip.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Flan de Vainilla",
    category: "Desserts",
    cuisines: ["mexican"],
    description:
      "A rich, silky vanilla custard baked with a layer of clear caramel sauce.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Tres Leches Cake",
    category: "Desserts",
    cuisines: ["mexican", "bakery"],
    description:
      "A light sponge cake soaked in three kinds of milk, topped with fluffy whipped cream.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Arroz con Leche",
    category: "Desserts",
    cuisines: ["mexican"],
    description:
      "Comforting Mexican rice pudding spiced with cinnamon and sweetened with condensed milk.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Sopapillas",
    category: "Desserts",
    cuisines: ["mexican", "tex-mex"],
    description:
      "Puffy, deep-fried pastry pillows drizzled with warm honey and powdered sugar.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Nieve de Garrafa",
    category: "Desserts",
    cuisines: ["mexican"],
    description:
      "Traditional artisanal Mexican water-based ice cream (sorbet), ask for today's fruit flavors.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Carlota de Limón",
    category: "Desserts",
    cuisines: ["mexican"],
    description:
      "An icebox cake made with layers of Maria cookies and a creamy, tart lime filling.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Paletas",
    category: "Desserts",
    cuisines: ["mexican", "street food"],
    description:
      "Fresh fruit popsicles made in-house with natural ingredients.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Empanadas Dulces",
    category: "Desserts",
    cuisines: ["mexican", "bakery"],
    description:
      "Baked pastry turnovers filled with sweet cajeta (caramel) or fruit preserves.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Capirotada",
    category: "Desserts",
    cuisines: ["mexican"],
    description:
      "Mexican bread pudding layered with nuts, cheese, raisins, and a spiced piloncillo syrup.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Edamame",
    category: "Starters",
    cuisines: ["japanese", "sushi", "izakaya"],
    description:
      "Lightly boiled young soybeans served in the pod and dusted with coarse sea salt.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Gyoza",
    category: "Starters",
    cuisines: ["japanese", "ramen", "izakaya"],
    description:
      "Six pan-fried dumplings filled with seasoned pork and cabbage, served with a soy-vinegar dip.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Agedashi Tofu",
    category: "Starters",
    cuisines: ["japanese", "izakaya"],
    description:
      "Lightly deep-fried silken tofu served in a hot, savory dashi broth with grated daikon and scallions.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Miso Soup",
    category: "Starters",
    cuisines: ["japanese", "sushi", "teishoku"],
    description:
      "Traditional soup made with fermented soybean paste, dashi, tofu cubes, and wakame seaweed.",
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Takoyaki",
    category: "Starters",
    cuisines: ["japanese", "street food", "izakaya"],
    description:
      "Golden, savory battered octopus balls drizzled with sweet sauce, mayo, and bonito flakes.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Wakame Salad",
    category: "Starters",
    cuisines: ["japanese", "sushi"],
    description:
      "A bright green seaweed salad dressed with a sweet sesame and soy vinaigrette.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Yakitori",
    category: "Starters",
    cuisines: ["japanese", "izakaya", "street food"],
    description:
      "Three skewers of charcoal-grilled chicken thigh glazed with a sweet and savory tare sauce.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Tuna Tataki",
    category: "Starters",
    cuisines: ["japanese", "sushi", "izakaya"],
    description:
      "Lightly seared, rare tuna slices served with a citrusy ponzu sauce and sliced scallions.",
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Karaage",
    category: "Starters",
    cuisines: ["japanese", "izakaya"],
    description:
      "Japanese-style bite-sized fried chicken, marinated in soy sauce, ginger, and garlic, served with lemon.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Chawanmushi",
    category: "Starters",
    cuisines: ["japanese", "fine dining"],
    description:
      "A delicate, savory steamed egg custard served in a cup, containing shrimp, chicken, and shiitake mushrooms.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Tonkotsu Ramen",
    category: "Main Courses",
    cuisines: ["japanese", "ramen"],
    description:
      "Hakata-style ramen featuring a rich, milky pork bone broth, thin noodles, chashu pork, and a soft-boiled egg.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Sushi Nigiri Platter",
    category: "Main Courses",
    cuisines: ["japanese", "sushi"],
    description:
      "Chef's selection of 10 premium pieces of raw fish over seasoned vinegared rice.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Sashimi Moriawase",
    category: "Main Courses",
    cuisines: ["japanese", "sushi"],
    description:
      "A stunning assortment of the day's freshest raw fish, elegantly sliced and plated.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Katsudon",
    category: "Main Courses",
    cuisines: ["japanese", "teishoku"],
    description:
      "A comforting bowl of rice topped with a breaded, deep-fried pork cutlet, egg, and onions simmered in sweet soy broth.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Chicken Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese", "teishoku"],
    description:
      "Grilled chicken breast glazed in a sweet, sticky soy-based sauce, served with steamed rice and vegetables.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Tempura Udon",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Thick, chewy wheat noodles in a hot dashi broth, served with light, crispy shrimp and vegetable tempura.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Unadon (Eel Bowl)",
    category: "Main Courses",
    cuisines: ["japanese", "fine dining"],
    description:
      "Grilled freshwater eel glazed with a sweet soy-based sauce, served over a bed of steamed white rice.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Shoyu Ramen",
    category: "Main Courses",
    cuisines: ["japanese", "ramen"],
    description:
      "Tokyo-style ramen with a clear, soy-sauce flavored broth, curly noodles, bamboo shoots, and roasted pork.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Okonomiyaki",
    category: "Main Courses",
    cuisines: ["japanese", "street food"],
    description:
      "A savory Japanese cabbage pancake mixed with pork belly and seafood, topped with mayo, sweet sauce, and bonito.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Spicy Tuna Roll",
    category: "Main Courses",
    cuisines: ["japanese", "sushi"],
    description:
      "Sushi roll filled with minced tuna mixed with spicy mayo, wrapped in nori and rice.",
    isSpicy: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Sukiyaki",
    category: "Main Courses",
    cuisines: ["japanese", "fine dining"],
    description:
      "Thinly sliced beef, tofu, and vegetables simmered right at your table in a sweet soy and mirin broth.",
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Yakisoba",
    category: "Main Courses",
    cuisines: ["japanese", "street food", "izakaya"],
    description:
      "Stir-fried wheat noodles with pork, cabbage, and carrots in a sweet and savory sauce.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Salmon Teriyaki Bento",
    category: "Main Courses",
    cuisines: ["japanese", "teishoku"],
    description:
      "A complete meal box featuring glazed salmon, rice, miso soup, salad, and a small side dish.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Gyudon (Beef Bowl)",
    category: "Main Courses",
    cuisines: ["japanese", "teishoku"],
    description:
      "Thinly sliced beef and onions simmered in a mildly sweet broth flavored with dashi, soy sauce, and mirin, over rice.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Miso Black Cod",
    category: "Main Courses",
    cuisines: ["japanese", "fine dining"],
    description:
      "A buttery fillet of black cod marinated for 48 hours in sweet saikyo miso, then broiled to perfection.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Dragon Roll",
    category: "Main Courses",
    cuisines: ["japanese", "sushi"],
    description:
      "An inside-out sushi roll featuring shrimp tempura and cucumber, draped with thinly sliced avocado.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Zaru Soba",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Chilled buckwheat noodles served on a bamboo tray with a soy-based dipping sauce, perfect for warm weather.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Omurice",
    category: "Main Courses",
    cuisines: ["japanese", "cafe"],
    description:
      "A fluffy, western-influenced Japanese omelette draped over ketchup-flavored chicken fried rice.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Shabu Shabu",
    category: "Main Courses",
    cuisines: ["japanese", "fine dining"],
    description:
      "A Japanese hot pot where diners swish paper-thin beef slices in a hot kombu broth, served with ponzu and sesame dips.",
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Katsu Curry",
    category: "Main Courses",
    cuisines: ["japanese", "teishoku"],
    description:
      "A crispy breaded pork cutlet served with a rich, slightly sweet Japanese curry sauce over rice.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/soup.png",
  },
  {
    name: "Gohan (Steamed Rice)",
    category: "Sides",
    cuisines: ["japanese", "sushi", "teishoku"],
    description: "A bowl of premium short-grain Japanese white rice.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Tsukemono (Pickles)",
    category: "Sides",
    cuisines: ["japanese", "teishoku"],
    description:
      "An assortment of traditional Japanese pickled vegetables, including daikon, plum, and cucumber.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Tamagoyaki",
    category: "Sides",
    cuisines: ["japanese", "sushi", "izakaya"],
    description:
      "A slightly sweet, layered rolled omelette, cooked in a rectangular pan.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Natto",
    category: "Sides",
    cuisines: ["japanese", "breakfast"],
    description:
      "Fermented soybeans with a distinct, strong flavor and sticky texture, served with mustard and soy sauce.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Onigiri",
    category: "Sides",
    cuisines: ["japanese", "street food"],
    description:
      "A triangular rice ball wrapped in seaweed, filled with salted salmon or pickled plum.",
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Kinoko Butter Yaki",
    category: "Sides",
    cuisines: ["japanese", "izakaya"],
    description:
      "A mix of Japanese mushrooms (shiitake, enoki, shimeji) sautéed in butter and soy sauce.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Korokke",
    category: "Sides",
    cuisines: ["japanese", "street food"],
    description:
      "A Japanese potato croquette, breaded with panko and deep-fried, served with sweet tonkatsu sauce.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Daikon Salad",
    category: "Sides",
    cuisines: ["japanese", "izakaya"],
    description:
      "Crisp, julienned white radish salad with a light plum or sesame dressing.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Nasu Dengaku",
    category: "Sides",
    cuisines: ["japanese", "izakaya"],
    description:
      "Broiled eggplant halves glazed with a sweet and savory caramelized miso paste.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Kinpira Gobo",
    category: "Sides",
    cuisines: ["japanese", "teishoku"],
    description:
      "Julienned burdock root and carrots stir-fried and simmered in soy sauce, mirin, and sesame oil.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Matcha Ice Cream",
    category: "Desserts",
    cuisines: ["japanese", "cafe"],
    description:
      "Rich, creamy ice cream flavored with premium bitter-sweet green tea powder.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Mochi Ice Cream",
    category: "Desserts",
    cuisines: ["japanese"],
    description:
      "Bite-sized balls of ice cream enveloped in a soft, chewy, sweet rice dough.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Dorayaki",
    category: "Desserts",
    cuisines: ["japanese", "street food", "bakery"],
    description:
      "A sweet red bean paste sandwich made of two fluffy, pancake-like patties.",
    isVegetarian: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Taiyaki",
    category: "Desserts",
    cuisines: ["japanese", "street food", "bakery"],
    description:
      "A warm, fish-shaped cake filled with sweet azuki bean paste or vanilla custard.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Daifuku",
    category: "Desserts",
    cuisines: ["japanese", "bakery"],
    description:
      "A soft, traditional glutinous rice confection stuffed with sweet red bean paste.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Purin",
    category: "Desserts",
    cuisines: ["japanese", "cafe"],
    description: "A firm, smooth Japanese caramel custard pudding.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Mitarashi Dango",
    category: "Desserts",
    cuisines: ["japanese", "street food"],
    description:
      "Chewy rice dumplings served on a skewer and glazed with a sweet soy syrup.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Yuzu Sorbet",
    category: "Desserts",
    cuisines: ["japanese", "fine dining"],
    description:
      "A highly refreshing and tart palate cleanser made from the Japanese citrus fruit, yuzu.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Anmitsu",
    category: "Desserts",
    cuisines: ["japanese", "cafe"],
    description:
      "A classic dessert bowl of agar jelly cubes, sweet red bean paste, fresh fruits, and black syrup.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Castella Cake",
    category: "Desserts",
    cuisines: ["japanese", "bakery"],
    description:
      "A very fine, moist, and spongy honey cake originally from Nagasaki.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Samosa",
    category: "Starters",
    cuisines: ["indian", "street food"],
    description:
      "Crispy, golden pastry pyramids stuffed with spiced potatoes and peas.",
    isVegetarian: true,
    isVegan: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Onion Bhaji",
    category: "Starters",
    cuisines: ["indian", "street food"],
    description:
      "Finely sliced onions spiced, coated in chickpea flour, and deep-fried to a crisp.",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Chicken Tikka",
    category: "Starters",
    cuisines: ["indian", "tandoori"],
    description:
      "Tender chicken chunks marinated in yogurt and spices, grilled in a tandoor oven.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Paneer Tikka",
    category: "Starters",
    cuisines: ["indian", "tandoori"],
    description:
      "Cubes of fresh Indian cottage cheese marinated in spices and grilled with bell peppers.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Aloo Tikki",
    category: "Starters",
    cuisines: ["indian", "street food"],
    description:
      "Spiced, crisp potato patties served with tangy tamarind and green mint chutneys.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Pani Puri",
    category: "Starters",
    cuisines: ["indian", "street food"],
    description:
      "Hollow, crispy puri shells filled with a mixture of flavored water, tamarind chutney, chili, chaat masala, potato, and chickpeas.",
    isVegetarian: true,
    isVegan: true,
    isSpicy: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Seekh Kebab",
    category: "Starters",
    cuisines: ["indian", "tandoori"],
    description:
      "Minced lamb mixed with fresh herbs and spices, skewered and roasted in the tandoor.",
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Gobi Manchurian",
    category: "Starters",
    cuisines: ["indian", "street food"],
    description:
      "Crispy cauliflower florets tossed in a sweet, spicy, and tangy Indo-Chinese sauce.",
    isVegetarian: true,
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Papdi Chaat",
    category: "Starters",
    cuisines: ["indian", "street food"],
    description:
      "Crisp fried dough wafers topped with potatoes, chickpeas, yogurt, chutneys, and spices.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Fish Amritsari",
    category: "Starters",
    cuisines: ["indian", "seafood"],
    description:
      "North Indian style deep-fried fish coated in a spicy gram flour batter.",
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Butter Chicken (Murgh Makhani)",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Tandoori chicken simmered in a mildly spiced, velvety tomato and butter gravy.",
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Chicken Tikka Masala",
    category: "Main Courses",
    cuisines: ["indian", "bistro"],
    description:
      "Roasted chunks of chicken in a vibrant, spiced, creamy orange curry sauce.",
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Lamb Rogan Josh",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "A robust, aromatic Kashmiri curry featuring tender pieces of lamb braised in a gravy flavored with garlic, ginger, and aromatic spices.",
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Palak Paneer",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Cubes of soft cottage cheese simmered in a smooth, vibrant spinach pureé spiced with garlic and garam masala.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/soup.png",
  },
  {
    name: "Chana Masala",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Hearty chickpeas slow-cooked in a tangy, spiced tomato and onion gravy.",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Biryani (Chicken or Lamb)",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "A royal dish of fragrant basmati rice slow-cooked with meat, saffron, and a rich blend of spices.",
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Dal Makhani",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Whole black lentils and kidney beans slow-cooked for hours with butter and cream for a rich, smoky flavor.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "/images/templates/soup.png",
  },
  {
    name: "Aloo Gobi",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "A classic dry curry of potatoes and cauliflower florets spiced with turmeric and cumin.",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Vindaloo",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "A notoriously fiery, tangy Goan curry made with pork or chicken, vinegar, and heavy chili.",
    isSpicy: true,
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/soup.png",
  },
  {
    name: "Saag Gosht",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Tender chunks of lamb slow-cooked in a vibrant, mildly spiced spinach gravy.",
    isGlutenFree: true,
    suggestedCookingTime: 50,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Baingan Bharta",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Smoky fire-roasted eggplant mashed and cooked with onions, tomatoes, and spices.",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1314",
  },
  {
    name: "Malai Kofta",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Melt-in-your-mouth potato and paneer dumplings served in a rich, creamy cashew-based sauce.",
    isVegetarian: true,
    suggestedCookingTime: 35,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Tandoori Chicken (Half/Full)",
    category: "Main Courses",
    cuisines: ["indian", "tandoori"],
    description:
      "Bone-in chicken marinated in yogurt and a fiery red spice blend, roasted in a clay oven.",
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Korma",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "A rich, mild, and highly aromatic curry thickened with almonds, coconut, or cashews.",
    isGlutenFree: true,
    suggestedCookingTime: 35,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Fish Curry (Goan Style)",
    category: "Main Courses",
    cuisines: ["indian", "seafood"],
    description:
      "Fresh fish simmered in a bright, tangy, coconut-milk based curry infused with tamarind and chili.",
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Bhindi Masala",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Fresh okra stir-fried with onions, tomatoes, and a dry spice blend.",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Madras Curry",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "A fairly hot curry with a deep red, thick sauce made with heavy chili powder and tamarind.",
    isSpicy: true,
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/soup.png",
  },
  {
    name: "Prawn Balchão",
    category: "Main Courses",
    cuisines: ["indian", "seafood"],
    description:
      "A fiery, pickled Goan prawn dish cooked in a spicy, tangy, dark red sauce.",
    isSpicy: true,
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Matar Paneer",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "A classic North Indian curry of green peas and cottage cheese in a tomato-based sauce.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/soup.png",
  },
  {
    name: "Keema Mutter",
    category: "Main Courses",
    cuisines: ["indian"],
    description:
      "Minced lamb slow-cooked with green peas, onions, tomatoes, and aromatic spices.",
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Garlic Naan",
    category: "Sides",
    cuisines: ["indian", "bakery"],
    description:
      "Soft, pillowy Indian flatbread baked in a tandoor and brushed heavily with garlic butter.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Basmati Rice",
    category: "Sides",
    cuisines: ["indian"],
    description: "Long-grain, incredibly fragrant steamed white rice.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Roti / Chapati",
    category: "Sides",
    cuisines: ["indian", "bakery"],
    description:
      "Simple, unleavened whole wheat flatbread cooked on a hot griddle.",
    isVegan: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Cucumber Raita",
    category: "Sides",
    cuisines: ["indian"],
    description:
      "Cooling, lightly spiced yogurt mixed with grated cucumber and roasted cumin.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Peshawari Naan",
    category: "Sides",
    cuisines: ["indian", "bakery"],
    description:
      "Sweet flatbread stuffed with a blend of dried fruits, coconut, and nuts.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Mango Chutney",
    category: "Sides",
    cuisines: ["indian"],
    description:
      "A sweet, tangy, and slightly spicy condiment made from ripe mangoes.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Jeera Rice",
    category: "Sides",
    cuisines: ["indian"],
    description: "Basmati rice pan-fried with ghee and toasted cumin seeds.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Pappadum",
    category: "Sides",
    cuisines: ["indian", "street food"],
    description: "Thin, crisp, disc-shaped crackers made from lentil flour.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Kachumber Salad",
    category: "Sides",
    cuisines: ["indian"],
    description:
      "A fresh chopped salad of cucumbers, onions, and tomatoes tossed with lemon juice and chaat masala.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Lacha Paratha",
    category: "Sides",
    cuisines: ["indian", "bakery"],
    description:
      "A multi-layered, crispy, flaky whole wheat flatbread pan-fried with ghee.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Gulab Jamun",
    category: "Desserts",
    cuisines: ["indian"],
    description:
      "Soft, melt-in-the-mouth milk-solid dumplings soaked in a warm, rose-scented sugar syrup.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Rasgulla",
    category: "Desserts",
    cuisines: ["indian"],
    description:
      "Spongy, light cottage cheese balls cooked in a light sugar syrup.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Mango Lassi",
    category: "Desserts",
    cuisines: ["indian", "cafe"],
    description:
      "A thick, creamy, refreshing yogurt-based drink blended with sweet Alphonso mangoes.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Gajar Ka Halwa",
    category: "Desserts",
    cuisines: ["indian"],
    description:
      "A rich, slow-cooked pudding made with grated carrots, milk, sugar, ghee, and nuts.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Kheer",
    category: "Desserts",
    cuisines: ["indian"],
    description:
      "Traditional Indian rice pudding flavored with cardamom, saffron, and nuts.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Rasmalai",
    category: "Desserts",
    cuisines: ["indian"],
    description:
      "Soft paneer discs soaked in chilled, creamy, cardamom-flavored milk.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Jalebi",
    category: "Desserts",
    cuisines: ["indian", "street food"],
    description:
      "Crispy, deep-fried, spiral-shaped batter soaked in saffron sugar syrup.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Kulfi",
    category: "Desserts",
    cuisines: ["indian"],
    description:
      "Traditional Indian ice cream—denser and creamier than Western ice cream, flavored with pistachio or mango.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Mysore Pak",
    category: "Desserts",
    cuisines: ["indian"],
    description:
      "A rich, crumbly, melt-in-the-mouth sweet made generously with ghee, sugar, and gram flour.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Falooda",
    category: "Desserts",
    cuisines: ["indian", "street food"],
    description:
      "A cold, layered dessert beverage with rose syrup, vermicelli, sweet basil seeds, and ice cream.",
    isVegetarian: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Patatas Bravas",
    category: "Starters",
    cuisines: ["spanish", "tapas"],
    description:
      "Crispy, fried potato cubes served with a spicy, smoky tomato bravas sauce and creamy aioli.",
    isVegetarian: true,
    isGlutenFree: true,
    isSpicy: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Gambas al Ajillo",
    category: "Starters",
    cuisines: ["spanish", "tapas", "seafood"],
    description:
      "Sizzling shrimp cooked in extra virgin olive oil heavily infused with garlic and dried chili.",
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Pan con Tomate",
    category: "Starters",
    cuisines: ["spanish", "tapas"],
    description:
      "Toasted rustic bread rubbed with raw garlic and ripe tomatoes, drizzled with olive oil and sea salt.",
    isVegan: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Croquetas de Jamón",
    category: "Starters",
    cuisines: ["spanish", "tapas"],
    description:
      "Crispy fried croquettes with an impossibly creamy, rich béchamel and cured ham filling.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/appetizer.png",
  },
  {
    name: "Jamón Ibérico de Bellota",
    category: "Starters",
    cuisines: ["spanish", "tapas", "fine dining"],
    description:
      "Premium acorn-fed Iberian ham, sliced paper-thin, served at room temperature.",
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1470",
  },
  {
    name: "Tortilla Española",
    category: "Starters",
    cuisines: ["spanish", "tapas"],
    description:
      "A thick, classic Spanish omelette made simply with eggs, potatoes, and onions slowly cooked in olive oil.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1825",
  },
  {
    name: "Pimientos de Padrón",
    category: "Starters",
    cuisines: ["spanish", "tapas"],
    description:
      "Small green peppers blistered in olive oil and finished with coarse sea salt. Mostly mild, but some are spicy!",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1961",
  },
  {
    name: "Boquerones en Vinagre",
    category: "Starters",
    cuisines: ["spanish", "tapas", "seafood"],
    description:
      "Fresh white anchovy fillets marinated in vinegar, olive oil, garlic, and parsley.",
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1050",
  },
  {
    name: "Chorizo a la Sidra",
    category: "Starters",
    cuisines: ["spanish", "tapas"],
    description:
      "Spanish chorizo sausage slowly braised in hard apple cider until tender.",
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1631",
  },
  {
    name: "Pulpo a la Gallega",
    category: "Starters",
    cuisines: ["spanish", "tapas", "seafood"],
    description:
      "Tender octopus slices dusted with smoked paprika and coarse sea salt, served over boiled potatoes.",
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1611",
  },
  {
    name: "Paella Valenciana",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "The authentic paella from Valencia, cooked with rabbit, chicken, butter beans, green beans, and saffron-infused rice.",
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1633",
  },
  {
    name: "Paella de Marisco",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "A stunning seafood paella packed with shrimp, mussels, clams, and calamari in a saffron broth.",
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1574",
  },
  {
    name: "Cochinillo Asado",
    category: "Main Courses",
    cuisines: ["spanish", "fine dining"],
    description:
      "Segovian-style whole roasted suckling pig with incredibly crispy skin and tender, melt-in-the-mouth meat.",
    isGlutenFree: true,
    suggestedCookingTime: 180,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1548",
  },
  {
    name: "Rabo de Toro",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "A rich, slow-braised oxtail stew simmered in red wine and vegetables until the meat falls off the bone.",
    isGlutenFree: true,
    suggestedCookingTime: 180,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1073",
  },
  {
    name: "Fabada Asturiana",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "A hearty, warming white bean stew from Asturias, cooked with chorizo, morcilla (blood sausage), and pork belly.",
    isGlutenFree: true,
    suggestedCookingTime: 60,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1527",
  },
  {
    name: "Fideuà",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "A paella-like dish from Catalonia made with short noodles instead of rice, packed with seafood.",
    suggestedCookingTime: 35,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1717",
  },
  {
    name: "Pollo al Ajillo",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "Rustic, flavor-packed chicken braised with copious amounts of garlic, white wine, and bay leaves.",
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1390",
  },
  {
    name: "Bacalao a la Vizcaína",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "Salt cod simmered in a rich, slightly sweet Basque sauce made from red choricero peppers, onions, and tomatoes.",
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1026",
  },
  {
    name: "Secreto Ibérico",
    category: "Main Courses",
    cuisines: ["spanish", "fine dining"],
    description:
      "A highly marbled, incredibly flavorful cut of Iberian pork grilled rapidly to preserve its juiciness.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1590",
  },
  {
    name: "Arroz Negro",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "A dramatic paella variation colored pitch black with squid ink, featuring cuttlefish and served with garlic aioli.",
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1065",
  },
  {
    name: "Merluza a la Vasca",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "Hake fish served in a Basque-style green sauce made with parsley, garlic, clams, and white wine.",
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1628",
  },
  {
    name: "Caldereta de Langosta",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "A luxurious lobster stew from Menorca, cooked with a tomato, pepper, and garlic sofrito.",
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1991",
  },
  {
    name: "Chuletón de Vaca Vieja",
    category: "Main Courses",
    cuisines: ["spanish", "fine dining"],
    description:
      "A massive, dry-aged, bone-in ribeye steak from mature cows, grilled rare and sliced to share.",
    isGlutenFree: true,
    suggestedCookingTime: 30,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1137",
  },
  {
    name: "Callos a la Madrileña",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "A traditional, gelatinous Madrid stew made with beef tripe, chorizo, and morcilla.",
    isGlutenFree: true,
    suggestedCookingTime: 120,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1044",
  },
  {
    name: "Zarzuela de Mariscos",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "A complex, tomato-based Catalan seafood stew heavily scented with almonds and saffron.",
    isGlutenFree: true,
    suggestedCookingTime: 50,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1944",
  },
  {
    name: "Pisto Manchego",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "Spain's answer to ratatouille: a slow-cooked vegetable medley of tomatoes, peppers, zucchini, topped with a fried egg.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 35,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Marmitako",
    category: "Main Courses",
    cuisines: ["spanish", "seafood"],
    description:
      "A hearty Basque tuna and potato stew flavored with sweet choricero peppers.",
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Cordero Asado",
    category: "Main Courses",
    cuisines: ["spanish", "fine dining"],
    description:
      "Slow-roasted baby lamb leg, cooked simply with water, salt, and garlic until falling apart.",
    isGlutenFree: true,
    suggestedCookingTime: 120,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Lomo de Orza",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "Pork loin preserved in olive oil and spices, served sliced with rustic bread.",
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Paella de Verduras",
    category: "Main Courses",
    cuisines: ["spanish"],
    description:
      "A vibrant vegan paella utilizing the freshest seasonal vegetables, artichokes, and saffron.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 40,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Alioli",
    category: "Sides",
    cuisines: ["spanish", "tapas"],
    description: "A fiercely strong, emulsion of pure garlic and olive oil.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Aceitunas Aliñadas",
    category: "Sides",
    cuisines: ["spanish", "tapas"],
    description:
      "House-marinated Spanish olives with citrus peel, fennel, and garlic.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Ensalada Mixta",
    category: "Sides",
    cuisines: ["spanish"],
    description:
      "A large salad of lettuce, tomatoes, onions, hard-boiled eggs, and high-quality canned tuna.",
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Patatas a lo Pobre",
    category: "Sides",
    cuisines: ["spanish"],
    description:
      "'Poor man's potatoes' slow-fried with green peppers, onions, and garlic.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 25,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Escalivada",
    category: "Sides",
    cuisines: ["spanish"],
    description:
      "Catalan roasted vegetables (eggplant, red peppers, onions) peeled, torn into strips, and dressed with olive oil.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 45,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Pan Rústico",
    category: "Sides",
    cuisines: ["spanish", "bakery"],
    description:
      "A basket of crusty, rustic sourdough bread, perfect for mopping up sauces.",
    isVegan: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Queso Manchego",
    category: "Sides",
    cuisines: ["spanish", "tapas"],
    description: "A wedge of aged sheep's milk cheese from La Mancha.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Garbanzos Fritos",
    category: "Sides",
    cuisines: ["spanish", "tapas"],
    description:
      "Crispy fried chickpeas dusted with smoked paprika and sea salt.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Champiñones al Ajillo",
    category: "Sides",
    cuisines: ["spanish", "tapas"],
    description:
      "Button mushrooms sautéed aggressively with garlic, parsley, and dry sherry.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Espinacas con Garbanzos",
    category: "Sides",
    cuisines: ["spanish", "tapas"],
    description:
      "A Moorish-influenced Sevillian dish of spinach and chickpeas cooked with cumin and smoked paprika.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/salad.png",
  },
  {
    name: "Crema Catalana",
    category: "Desserts",
    cuisines: ["spanish", "bistro"],
    description:
      "Spain's version of crème brûlée, flavored with cinnamon and lemon zest.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Churros con Chocolate",
    category: "Desserts",
    cuisines: ["spanish", "street food", "cafe"],
    description:
      "Crispy fried dough loops served alongside a cup of thick, dark, pudding-like hot chocolate.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1040",
  },
  {
    name: "Tarta de Santiago",
    category: "Desserts",
    cuisines: ["spanish", "bakery"],
    description:
      "A traditional Galician almond cake lightly scented with lemon and dusted with powdered sugar.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Flan de Huevo",
    category: "Desserts",
    cuisines: ["spanish"],
    description:
      "The classic, dense Spanish egg custard baked with a pool of clear caramel.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Basque Cheesecake (Tarta de Queso)",
    category: "Desserts",
    cuisines: ["spanish", "fine dining", "bakery"],
    description:
      "A crustless cheesecake baked at a high temperature to create a burnt exterior and a gooey, molten center.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Torrijas",
    category: "Desserts",
    cuisines: ["spanish", "bakery"],
    description:
      "Spanish-style French toast, soaked in honey or milk, fried in olive oil, and dusted with cinnamon.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Polvorones",
    category: "Desserts",
    cuisines: ["spanish", "bakery"],
    description:
      "Incredibly crumbly, rich shortbread cookies made with almonds and toasted flour.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Leche Frita",
    category: "Desserts",
    cuisines: ["spanish", "cafe"],
    description:
      "'Fried milk'—a firm milk pudding that is breaded, fried crisp, and rolled in cinnamon sugar.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Ensaimada",
    category: "Desserts",
    cuisines: ["spanish", "bakery"],
    description:
      "A sweet, spiral pastry from Mallorca, dusted heavily with powdered sugar.",
    isVegetarian: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Turrón",
    category: "Desserts",
    cuisines: ["spanish"],
    description:
      "Slices of premium Spanish nougat made from almonds and honey (hard or soft varieties available).",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/dessert.png",
  },
  {
    name: "Avocado Toast",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "Thick-cut artisanal sourdough topped with smashed avocado, chili flakes, and a squeeze of lemon.",
    isVegan: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Eggs Benedict",
    category: "Breakfast",
    cuisines: ["breakfast", "bistro"],
    description:
      "Two poached eggs and Canadian bacon on toasted English muffins, draped in rich hollandaise sauce.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Buttermilk Pancakes",
    category: "Breakfast",
    cuisines: ["breakfast", "diner"],
    description:
      "A stack of three fluffy pancakes served with whipped butter and pure maple syrup.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "French Toast",
    category: "Breakfast",
    cuisines: ["breakfast", "bistro"],
    description:
      "Thick slices of brioche dipped in vanilla-cinnamon custard and griddled golden brown.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Full English Breakfast",
    category: "Breakfast",
    cuisines: ["breakfast", "pub"],
    description:
      "A hearty plate of eggs, bacon, sausage, baked beans, grilled tomatoes, mushrooms, and toast.",
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Breakfast Burrito",
    category: "Breakfast",
    cuisines: ["breakfast", "mexican"],
    description:
      "A large flour tortilla wrapped around scrambled eggs, chorizo, potatoes, and cheddar cheese.",
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/taco.png",
  },
  {
    name: "Açaí Bowl",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "Blended açaí berries topped with granola, fresh strawberries, bananas, coconut flakes, and chia seeds.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Smoked Salmon Bagel",
    category: "Breakfast",
    cuisines: ["breakfast", "bakery"],
    description:
      "A toasted everything bagel smeared with cream cheese, topped with lox, capers, red onions, and dill.",
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Oatmeal with Fresh Berries",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "Steel-cut oats cooked to perfection, topped with mixed berries, honey, and toasted almonds.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Breakfast Sandwich",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "A fried egg, melted cheddar, and crispy bacon served on a freshly baked brioche bun.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/sandwich.png",
  },
  {
    name: "Shakshuka",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "Eggs gently poached in a simmering, spiced sauce of tomatoes, bell peppers, and onions.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 20,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Croissant Sandwich",
    category: "Breakfast",
    cuisines: ["breakfast", "bakery"],
    description:
      "A buttery, flaky croissant filled with thinly sliced ham and melted Gruyère cheese.",
    suggestedCookingTime: 10,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1799",
  },
  {
    name: "Belgian Waffle",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "A deep-pocketed, crispy waffle served with a dusting of powdered sugar and fresh strawberries.",
    isVegetarian: true,
    suggestedCookingTime: 15,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1319",
  },
  {
    name: "Huevos Rancheros",
    category: "Breakfast",
    cuisines: ["breakfast", "mexican"],
    description:
      "Fried eggs served on lightly fried corn tortillas, smothered in a warm tomato-chili salsa.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1599",
  },
  {
    name: "Greek Yogurt Parfait",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "Layers of thick Greek yogurt, mixed berry compote, and crunchy honey-oat granola.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1919",
  },
  {
    name: "Steak and Eggs",
    category: "Breakfast",
    cuisines: ["breakfast", "diner"],
    description:
      "A tender 8oz sirloin steak cooked to order, served with two eggs any style and hash browns.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1265",
  },
  {
    name: "Corned Beef Hash",
    category: "Breakfast",
    cuisines: ["breakfast", "diner"],
    description:
      "Crispy pan-fried potatoes mixed with savory corned beef and onions, topped with two poached eggs.",
    suggestedCookingTime: 15,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1425",
  },
  {
    name: "Mushroom & Swiss Omelette",
    category: "Breakfast",
    cuisines: ["breakfast", "diner"],
    description:
      "A fluffy three-egg omelette filled with sautéed mushrooms and melted Swiss cheese.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 10,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1360",
  },
  {
    name: "Chilaquiles",
    category: "Breakfast",
    cuisines: ["breakfast", "mexican"],
    description:
      "Crispy corn tortillas simmered in salsa verde, topped with a fried egg, crema, and queso fresco.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1140",
  },
  {
    name: "Chia Seed Pudding",
    category: "Breakfast",
    cuisines: ["breakfast", "cafe"],
    description:
      "Chia seeds soaked overnight in almond milk, topped with mango puree and coconut flakes.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1537",
  },
  {
    name: "Classic Margarita",
    category: "Beverages",
    cuisines: ["drinks", "mexican", "bar"],
    description:
      "Tequila blanco, fresh lime juice, and Cointreau, served over ice with a salted rim.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1658",
  },
  {
    name: "Old Fashioned",
    category: "Beverages",
    cuisines: ["drinks", "bar"],
    description:
      "Bourbon whiskey stirred gently with sugar, Angostura bitters, and an orange twist.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1232",
  },
  {
    name: "Mojito",
    category: "Beverages",
    cuisines: ["drinks", "bar"],
    description:
      "A refreshing blend of white rum, fresh mint leaves, lime juice, sugar, and a splash of soda water.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1626",
  },
  {
    name: "Aperol Spritz",
    category: "Beverages",
    cuisines: ["drinks", "italian", "bar"],
    description:
      "Aperol, Prosecco, and a splash of soda, garnished with an orange slice. The perfect summer aperitif.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1295",
  },
  {
    name: "Espresso Martini",
    category: "Beverages",
    cuisines: ["drinks", "bar", "cafe"],
    description:
      "A sophisticated, caffeinated cocktail made with vodka, coffee liqueur, and a shot of fresh espresso.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1608",
  },
  {
    name: "Fresh Squeezed Orange Juice",
    category: "Beverages",
    cuisines: ["drinks", "breakfast"],
    description: "100% pure, cold-pressed Valencia oranges.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1538",
  },
  {
    name: "Cappuccino",
    category: "Beverages",
    cuisines: ["drinks", "cafe", "breakfast"],
    description:
      "A single shot of espresso topped with equal parts steamed milk and dense milk foam.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1029",
  },
  {
    name: "Iced Latte",
    category: "Beverages",
    cuisines: ["drinks", "cafe"],
    description: "Espresso and chilled milk poured over ice.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1911",
  },
  {
    name: "Matcha Latte",
    category: "Beverages",
    cuisines: ["drinks", "cafe", "japanese"],
    description: "Premium stone-ground green tea whisked with steamed milk.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1128",
  },
  {
    name: "Strawberry Banana Smoothie",
    category: "Beverages",
    cuisines: ["drinks", "cafe"],
    description:
      "Fresh strawberries, banana, and a splash of apple juice blended with ice.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "https://loremflickr.com/800/600/food,dish?lock=1558",
  },
  {
    name: "Craft IPA",
    category: "Beverages",
    cuisines: ["drinks", "bar"],
    description: "A pint of locally brewed, intensely hoppy India Pale Ale.",
    isVegan: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Pino Grigio (Glass)",
    category: "Beverages",
    cuisines: ["drinks", "bar"],
    description:
      "A crisp, dry white wine with notes of green apple and citrus.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Cabernet Sauvignon (Glass)",
    category: "Beverages",
    cuisines: ["drinks", "bar"],
    description:
      "A full-bodied red wine with dark fruit flavors and a hint of oak.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Sangria Tinto",
    category: "Beverages",
    cuisines: ["drinks", "spanish"],
    description:
      "A traditional Spanish punch made with red wine, chopped fruit, brandy, and a splash of orange juice.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Diet Cola",
    category: "Beverages",
    cuisines: ["drinks", "fast food"],
    description: "Classic zero-calorie cola served over ice.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Sparkling Water",
    category: "Beverages",
    cuisines: ["drinks"],
    description: "Premium carbonated mineral water, served with a lime wedge.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Moscow Mule",
    category: "Beverages",
    cuisines: ["drinks", "bar"],
    description:
      "Vodka, spicy ginger beer, and lime juice served in a traditional copper mug.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Lemonade",
    category: "Beverages",
    cuisines: ["drinks", "diner"],
    description: "Tart, sweet, and freshly squeezed lemonade.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Iced Tea",
    category: "Beverages",
    cuisines: ["drinks", "diner"],
    description:
      "Unsweetened black tea brewed fresh daily, served over ice with lemon.",
    isVegan: true,
    isGlutenFree: true,
    suggestedCookingTime: 0,
    imageUrl:
      "/images/templates/coffee.png",
  },
  {
    name: "Piña Colada",
    category: "Beverages",
    cuisines: ["drinks", "bar"],
    description:
      "A frozen, tropical blend of rum, coconut cream, and pineapple juice.",
    isVegetarian: true,
    isGlutenFree: true,
    suggestedCookingTime: 5,
    imageUrl:
      "/images/templates/cocktail.png",
  },
  {
    name: "Kids Chicken Nuggets",
    category: "Kids",
    cuisines: ["kids", "fast food"],
    description:
      "Six crispy, all-white-meat chicken nuggets served with french fries and ketchup.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Kids Mac & Cheese",
    category: "Kids",
    cuisines: ["kids"],
    description: "A smaller portion of our creamy, gooey macaroni and cheese.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Kids Cheese Pizza",
    category: "Kids",
    cuisines: ["kids", "italian"],
    description:
      "A personal 8-inch pizza topped with mild tomato sauce and mozzarella cheese.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/pizza.png",
  },
  {
    name: "Kids Mini Burger",
    category: "Kids",
    cuisines: ["kids", "american diner"],
    description:
      "A plain beef slider with American cheese on a soft bun, served with fries.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/burger.png",
  },
  {
    name: "Kids Grilled Cheese",
    category: "Kids",
    cuisines: ["kids"],
    description:
      "Melted American cheese between two slices of white bread, grilled until golden.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Kids Buttered Noodles",
    category: "Kids",
    cuisines: ["kids", "italian"],
    description:
      "Simple elbow pasta tossed with sweet butter and a sprinkle of parmesan.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Kids Hot Dog",
    category: "Kids",
    cuisines: ["kids"],
    description:
      "A classic all-beef hot dog on a soft bun, served with a side of apple slices.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Kids Fish Sticks",
    category: "Kids",
    cuisines: ["kids"],
    description:
      "Crispy breaded fish sticks served with tartar sauce and a side of steamed peas.",
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/seafood.png",
  },
  {
    name: "Kids Quesadilla",
    category: "Kids",
    cuisines: ["kids", "mexican"],
    description:
      "A simple flour tortilla folded with melted cheddar and mozzarella cheese.",
    isVegetarian: true,
    suggestedCookingTime: 10,
    imageUrl:
      "/images/templates/steak.png",
  },
  {
    name: "Kids Chicken & Rice",
    category: "Kids",
    cuisines: ["kids"],
    description:
      "Plain grilled chicken breast strips served with a side of white rice.",
    isGlutenFree: true,
    suggestedCookingTime: 15,
    imageUrl:
      "/images/templates/chicken.png",
  },
  {
    name: "Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1001",
  },
  {
    name: "Ghee Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ghee Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1002",
  },
  {
    name: "Ghee Karam Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ghee Karam Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1003",
  },
  {
    name: "Sambar Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Sambar Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1004",
  },
  {
    name: "Mini Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Mini Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1005",
  },
  {
    name: "Ghee Mini Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ghee Mini Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1006",
  },
  {
    name: "Ghee Karam Mini Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ghee Karam Mini Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1007",
  },
  {
    name: "Sambar Mini Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Sambar Mini Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1008",
  },
  {
    name: "Thatte Idly",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Thatte Idly, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1009",
  },
  {
    name: "Plain Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Plain Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1010",
  },
  {
    name: "Masala Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Masala Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1011",
  },
  {
    name: "DD Special Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Contains chef curated sauce along with potato masala and topped with some grated paneer",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1012",
  },
  {
    name: "Ghee Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ghee Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1013",
  },
  {
    name: "Ghee Karam Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ghee Karam Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1014",
  },
  {
    name: "Ghee Karam Masala Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ghee Karam Masala Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1015",
  },
  {
    name: "Double Egg Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Double Egg Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1016",
  },
  {
    name: "Double Egg Karam Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Double Egg Karam Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1017",
  },
  {
    name: "Paneer Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Paneer Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1018",
  },
  {
    name: "Chicken Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chicken Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1019",
  },
  {
    name: "Onion Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Onion Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1020",
  },
  {
    name: "Onion Masala Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Onion Masala Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1021",
  },
  {
    name: "Andhra Karam Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Andhra Karam Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1022",
  },
  {
    name: "Mysore Masala Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Mysore Masala Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1023",
  },
  {
    name: "Kids Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Kids Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1024",
  },
  {
    name: "Chocolate Dosa",
    category: "All-day Breakfast",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chocolate Dosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1025",
  },
  {
    name: "Punugulu",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Punugulu, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1026",
  },
  {
    name: "Mysore Bonda",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Mysore Bonda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1027",
  },
  {
    name: "Tawa Bonda",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Tawa Bonda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1028",
  },
  {
    name: "Mirchi Bajji",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Mirchi Bajji, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1029",
  },
  {
    name: "Stuffed Mirchi Bajji",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Stuffed Mirchi Bajji, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1030",
  },
  {
    name: "Onion Pakodi",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Onion Pakodi, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1031",
  },
  {
    name: "Aloo Samosa",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Aloo Samosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1032",
  },
  {
    name: "Onion Samosa",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Onion Samosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1033",
  },
  {
    name: "Corn Samosa",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Corn Samosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1034",
  },
  {
    name: "Chicken Samosa",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chicken Samosa, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1035",
  },
  {
    name: "Egg Bonda",
    category: "Snacks",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Egg Bonda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1036",
  },
  {
    name: "Gobi Manchuria",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Gobi Manchuria, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1037",
  },
  {
    name: "Veg Manchuria",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Veg Manchuria, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1038",
  },
  {
    name: "Paneer 65",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Paneer 65, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1039",
  },
  {
    name: "Chilli Paneer",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chilli Paneer, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1040",
  },
  {
    name: "Dragon Chicken",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Prepared with a special sauce, that gives it a sweeter taste with little spice",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1041",
  },
  {
    name: "Chilli Chicken",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chilli Chicken, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1042",
  },
  {
    name: "Chicken 65",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chicken 65, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1043",
  },
  {
    name: "Chicken Pepper Fry",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chicken Pepper Fry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1044",
  },
  {
    name: "Nellore Kodi Vepudu",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Nellore Kodi Vepudu, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1045",
  },
  {
    name: "Chicken Pakoda",
    category: "Appetizers",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chicken Pakoda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1046",
  },
  {
    name: "Street Style Veg Noodles",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Veg Noodles, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1047",
  },
  {
    name: "Street Style Veg Manchurian Noodles",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Veg Manchurian Noodles, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1048",
  },
  {
    name: "Street Style Gobi Manchurian Noodles",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Gobi Manchurian Noodles, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1049",
  },
  {
    name: "Street Style Double Egg Noodles",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Double Egg Noodles, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1050",
  },
  {
    name: "Street Style Double-Egg Chicken Noodles",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Double-Egg Chicken Noodles, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1051",
  },
  {
    name: "Street Style Veg Fried Rice",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Veg Fried Rice, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1052",
  },
  {
    name: "Street Style Veg Manchurian Fried Rice",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Veg Manchurian Fried Rice, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1053",
  },
  {
    name: "Street Style Gobi Manchurian Fried Rice",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Gobi Manchurian Fried Rice, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1054",
  },
  {
    name: "Street Style Double Egg Fried Rice",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Double Egg Fried Rice, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1055",
  },
  {
    name: "Street Style Double-Egg Chicken Fried Rice",
    category: "Indo-Chinese",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Street Style Double-Egg Chicken Fried Rice, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1056",
  },
  {
    name: "DD Special Chicken Shawarma",
    category: "Main Course",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian DD Special Chicken Shawarma, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1057",
  },
  {
    name: "DD Special Paneer Shawarma",
    category: "Main Course",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian DD Special Paneer Shawarma, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1058",
  },
  {
    name: "DD Special Chicken Shawarma Combo",
    category: "Main Course",
    cuisines: ["indian", "street food"],
    description: "Complement the fresh Shawarma with a free soda",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1059",
  },
  {
    name: "Raju Gari Kodi Pulao",
    category: "Main Course",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Raju Gari Kodi Pulao, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1060",
  },
  {
    name: "Nawaab Gari Mutton Pulao",
    category: "Main Course",
    cuisines: ["indian", "street food"],
    description: "Pulao rice with a side of mutton curry",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1061",
  },
  {
    name: "Paneer Pulao",
    category: "Main Course",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Paneer Pulao, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1062",
  },
  {
    name: "style Parotta w/ Chole",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian style Parotta w/ Chole, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1063",
  },
  {
    name: "style Parotta w/ Kadai Paneer",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian style Parotta w/ Kadai Paneer, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1064",
  },
  {
    name: "style Parotta w/ Paneer Butter Masala",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian style Parotta w/ Paneer Butter Masala, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1065",
  },
  {
    name: "style Parotta w/ Butter Chicken",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian style Parotta w/ Butter Chicken, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1066",
  },
  {
    name: "style Parotta w/ Chicken Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian style Parotta w/ Chicken Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1067",
  },
  {
    name: "style Parotta w/ Mutton Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian style Parotta w/ Mutton Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1068",
  },
  {
    name: "Rumali Roti w/ Chole",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Rumali Roti w/ Chole, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1069",
  },
  {
    name: "Rumali Roti w/ Paneer Butter Masala",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Rumali Roti w/ Paneer Butter Masala, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1070",
  },
  {
    name: "Rumali Roti w/ Kadai Paneer",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Rumali Roti w/ Kadai Paneer, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1071",
  },
  {
    name: "Rumali Roti w/ Chicken Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Rumali Roti w/ Chicken Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1072",
  },
  {
    name: "Rumali Roti w/ Butter Chicken",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Rumali Roti w/ Butter Chicken, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1073",
  },
  {
    name: "Rumali Roti w/ Mutton Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Rumali Roti w/ Mutton Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1074",
  },
  {
    name: "Poori w/ Potato Masala",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Poori w/ Potato Masala, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1075",
  },
  {
    name: "Poori w/ Chole",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Poori w/ Chole, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1076",
  },
  {
    name: "Poori w/ Kadai Paneer",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Poori w/ Kadai Paneer, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1077",
  },
  {
    name: "Poori w/ Chicken Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Poori w/ Chicken Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1078",
  },
  {
    name: "Poori w/ Mutton Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Poori w/ Mutton Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1079",
  },
  {
    name: "Chapathi w/ Chole",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chapathi w/ Chole, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1080",
  },
  {
    name: "Chapathi w/ Kadai Paneer",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chapathi w/ Kadai Paneer, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1081",
  },
  {
    name: "Chapathi w/ Paneer Butter Masala",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chapathi w/ Paneer Butter Masala, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1082",
  },
  {
    name: "Chapathi w/ Chicken Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chapathi w/ Chicken Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1083",
  },
  {
    name: "Chapathi w/ Butter Chicken",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chapathi w/ Butter Chicken, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1084",
  },
  {
    name: "Chapathi w/ Mutton Curry",
    category: "Breads & Curries",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chapathi w/ Mutton Curry, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1085",
  },
  {
    name: "Sev Puri",
    category: "Chaat",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Sev Puri, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1086",
  },
  {
    name: "Dahi Puri",
    category: "Chaat",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Dahi Puri, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1087",
  },
  {
    name: "Masala Puri",
    category: "Chaat",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Masala Puri, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1088",
  },
  {
    name: "Bhel Puri",
    category: "Chaat",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Bhel Puri, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1089",
  },
  {
    name: "Samosa Chaat",
    category: "Chaat",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Samosa Chaat, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1090",
  },
  {
    name: "Pav Bhaji",
    category: "Chaat",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Pav Bhaji, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1091",
  },
  {
    name: "Hyderabadi Spl Haleem - 8 oz",
    category: "Weekend Specials",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Hyderabadi Spl Haleem - 8 oz, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1092",
  },
  {
    name: "Veg Dum Biryani",
    category: "Weekend Specials",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Veg Dum Biryani, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1093",
  },
  {
    name: "Thalapakattu Mutton Biryani",
    category: "Weekend Specials",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Thalapakattu Mutton Biryani, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1094",
  },
  {
    name: "Chicken Dum Biryani",
    category: "Weekend Specials",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chicken Dum Biryani, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1095",
  },
  {
    name: "Pachimirchi Kodi Pulao",
    category: "Weekend Specials",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Pachimirchi Kodi Pulao, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1096",
  },
  {
    name: "Royal Falooda",
    category: "Faloodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Royal Falooda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1097",
  },
  {
    name: "Butterscotch Falooda",
    category: "Faloodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Butterscotch Falooda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1098",
  },
  {
    name: "Malai Falooda",
    category: "Faloodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Malai Falooda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1099",
  },
  {
    name: "Tutti Fruity Falooda",
    category: "Faloodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Tutti Fruity Falooda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1100",
  },
  {
    name: "Kesar Pista Falooda",
    category: "Faloodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Kesar Pista Falooda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1101",
  },
  {
    name: "Mango Falooda",
    category: "Faloodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Mango Falooda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1102",
  },
  {
    name: "Kitkat Milkshake",
    category: "Milkshakes",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Kitkat Milkshake, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1103",
  },
  {
    name: "Oreo Milkshake",
    category: "Milkshakes",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Oreo Milkshake, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1104",
  },
  {
    name: "Cookies & Cream Milkshake",
    category: "Milkshakes",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Cookies & Cream Milkshake, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1105",
  },
  {
    name: "Ferrero Milkshake",
    category: "Milkshakes",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Ferrero Milkshake, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1106",
  },
  {
    name: "DD Spl Chocolate Milkshake",
    category: "Milkshakes",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian DD Spl Chocolate Milkshake, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1107",
  },
  {
    name: "Chikoo Shake",
    category: "Shakes",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Chikoo Shake, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1108",
  },
  {
    name: "Seethaphal Shake",
    category: "Shakes",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Seethaphal Shake, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1109",
  },
  {
    name: "Masala Soda",
    category: "Sodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Masala Soda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1110",
  },
  {
    name: "Lime Soda",
    category: "Sodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Lime Soda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1111",
  },
  {
    name: "Sweet & Salt Lime Soda",
    category: "Sodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Sweet & Salt Lime Soda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1112",
  },
  {
    name: "Sugandhi Soda",
    category: "Sodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Sugandhi Soda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1113",
  },
  {
    name: "Kala Katta Soda",
    category: "Sodas",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Kala Katta Soda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1114",
  },
  {
    name: "Coke",
    category: "Beverages",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Coke, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1115",
  },
  {
    name: "Pepsi",
    category: "Beverages",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Pepsi, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1116",
  },
  {
    name: "Thums Up",
    category: "Beverages",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Thums Up, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1117",
  },
  {
    name: "Sprite",
    category: "Beverages",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Sprite, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1118",
  },
  {
    name: "Goli Soda",
    category: "Beverages",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Goli Soda, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1119",
  },
  {
    name: "Water",
    category: "Beverages",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Water, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1120",
  },
  {
    name: "Tea",
    category: "Beverages",
    cuisines: ["indian", "street food"],
    description:
      "Authentic Indian Tea, prepared with traditional spices and fresh ingredients.",
    suggestedCookingTime: 15,
    imageUrl: "https://loremflickr.com/800/600/indian,food,dish?lock=1121",
  },
  {
    name: "Edamame",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Steamed soybeans lightly salted with sea salt.",
    imageUrl: "/images/templates/appetizer.png",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },
  {
    name: "Harumaki",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Crispy Japanese vegetable spring rolls.",
    imageUrl: "/images/templates/appetizer.png",
    isVegetarian: true,
    isVegan: true,
  },
  {
    name: "Crab Puff",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Crispy wontons stuffed with cream cheese and crab meat.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Shumai",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Steamed or fried shrimp dumplings.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Gyoza",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Pan-fried pork and vegetable dumplings.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Yakitori",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Grilled chicken skewers glazed with a sweet and savory teriyaki sauce.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Takoyaki",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Fried octopus balls topped with mayo, takoyaki sauce, and bonito flakes.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Sesame Seed Ball",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Crispy, chewy pastry balls filled with sweet red bean paste and coated in sesame seeds.",
    imageUrl: "/images/templates/appetizer.png",
    isVegetarian: true,
  },
  {
    name: "Chicken & Veg Tempura",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Lightly battered and crispy fried chicken and assorted vegetables.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Shrimp & Veg Tempura",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Lightly battered and crispy fried shrimp and assorted vegetables.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Crunchy Spider",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Deep-fried crispy soft shell crab with eel sauce.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Fried Calamari",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Crispy battered calamari rings served with a dipping sauce.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Rock Shrimp",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Lightly battered, deep-fried shrimp tossed in a creamy, spicy mayo.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Tuna Tataki",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Seared tuna thinly sliced and served with ponzu sauce.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Pepper Tuna",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Seared tuna with a black pepper crust, thinly sliced.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Lemon Pepper Tuna",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Seared tuna with a lemon pepper crust, thinly sliced.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Yellowtail Jalapenos",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Thinly sliced yellowtail topped with fresh jalapeño and ponzu sauce.",
    imageUrl: "/images/templates/appetizer.png",
    isSpicy: true,
  },
  {
    name: "Mango Salmon",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Fresh salmon wrapped around mango, finished with a sweet citrus sauce.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Salmon Tartar",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Diced fresh salmon mixed with delicate seasonings.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Tuna Tartar",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Diced fresh tuna mixed with delicate seasonings.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Ahi Tower",
    category: "Appetizers",
    cuisines: ["japanese","sushi"],
    description:
      "Layers of spicy tuna, crab salad, avocado, and rice, shaped into a tower.",
    imageUrl: "/images/templates/appetizer.png",
  },
  {
    name: "Chicken Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Grilled chicken topped with a sweet and savory teriyaki glaze, served with vegetables.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Steak Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Grilled steak topped with a sweet and savory teriyaki glaze, served with vegetables.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Shrimp Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Grilled shrimp topped with a sweet and savory teriyaki glaze, served with vegetables.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Salmon Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Grilled salmon topped with a sweet and savory teriyaki glaze, served with vegetables.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Seafood Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Assorted grilled seafood topped with a sweet and savory teriyaki glaze, served with vegetables.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Vegetable Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Assorted grilled vegetables topped with a sweet and savory teriyaki glaze.",
    imageUrl: "/images/templates/steak.png",
    isVegetarian: true,
    isVegan: true,
  },
  {
    name: "Red Snapper Teriyaki",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Grilled red snapper topped with a sweet and savory teriyaki glaze, served with vegetables.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Chicken Katsu",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Panko-breaded and deep-fried chicken cutlet served with katsu sauce.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Vegetable Tempura",
    category: "Main Courses",
    cuisines: ["japanese"],
    description:
      "Assorted vegetables lightly battered and deep-fried to a delicate crisp.",
    imageUrl: "/images/templates/steak.png",
    isVegetarian: true,
  },
  {
    name: "Hibachi Vegetable",
    category: "Main Courses",
    cuisines: ["japanese","hibachi"],
    description:
      "Fresh vegetables grilled on a teppanyaki iron griddle with soy sauce and butter.",
    imageUrl: "/images/templates/steak.png",
    isVegetarian: true,
  },
  {
    name: "Hibachi Chicken",
    category: "Main Courses",
    cuisines: ["japanese","hibachi"],
    description:
      "Tender chicken grilled on a teppanyaki iron griddle with soy sauce and butter.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Hibachi Salmon",
    category: "Main Courses",
    cuisines: ["japanese","hibachi"],
    description:
      "Fresh salmon grilled on a teppanyaki iron griddle with soy sauce and butter.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Hibachi Shrimp",
    category: "Main Courses",
    cuisines: ["japanese","hibachi"],
    description:
      "Juicy shrimp grilled on a teppanyaki iron griddle with soy sauce and butter.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Hibachi Steak",
    category: "Main Courses",
    cuisines: ["japanese","hibachi"],
    description:
      "Juicy steak grilled on a teppanyaki iron griddle with soy sauce and butter.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Hibachi Scallop",
    category: "Main Courses",
    cuisines: ["japanese","hibachi"],
    description:
      "Tender scallops grilled on a teppanyaki iron griddle with soy sauce and butter.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Hibachi Lobster Tail",
    category: "Main Courses",
    cuisines: ["japanese","hibachi"],
    description:
      "Premium lobster tail grilled on a teppanyaki iron griddle with soy sauce and butter.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Rainbow Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "California roll topped with assorted raw fish and avocado.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Dragon Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Eel and cucumber roll topped with thinly sliced avocado and eel sauce.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Spider Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Fried soft shell crab, avocado, cucumber, and eel sauce.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Godzilla Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Deep-fried roll with spicy tuna, avocado, and cream cheese.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Volcano Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "California roll topped with baked spicy seafood mix.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Shaggy Dog Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Shrimp tempura and avocado topped with shredded crab and spicy mayo.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Super Crunchy Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Crispy shrimp tempura roll topped with tempura flakes and eel sauce.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Cowboy Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Steak and avocado roll topped with eel sauce.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Rock And Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Shrimp tempura, eel, avocado, and cucumber wrapped in soy paper.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Fire Island Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Spicy tuna and jalapeño topped with spicy crab.",
    imageUrl: "/images/templates/sushi.png",
    isSpicy: true,
  },
  {
    name: "Caterpillar Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Eel and cucumber roll topped with layers of avocado, resembling a caterpillar.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Angry Dragon Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Shrimp tempura, spicy tuna, and papaya topped with spicy crab and rutabaga wrapper.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Firecracker Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Spicy tuna roll topped with spicy yellowtail and jalapeño.",
    imageUrl: "/images/templates/sushi.png",
    isSpicy: true,
  },
  {
    name: "Hawaii Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Shrimp tempura and mango topped with spicy tuna and coconut flakes.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Monster Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Massive tempura roll filled with mixed fish, cream cheese, and avocado.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "TNT Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Spicy tuna roll topped with seared tuna and spicy mayo.",
    imageUrl: "/images/templates/sushi.png",
    isSpicy: true,
  },
  {
    name: "Alaska Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Fresh salmon, avocado, and cucumber roll.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Salmon Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Classic sushi roll filled with fresh raw salmon.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Salmon Avocado Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Sushi roll filled with fresh salmon and creamy avocado.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Spicy Salmon Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Sushi roll filled with chopped salmon mixed with spicy mayo.",
    imageUrl: "/images/templates/sushi.png",
    isSpicy: true,
  },
  {
    name: "Tuna Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Classic sushi roll filled with fresh raw tuna.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Tuna Avocado Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Sushi roll filled with fresh tuna and creamy avocado.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Spicy Tuna Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Sushi roll filled with chopped tuna mixed with spicy mayo.",
    imageUrl: "/images/templates/sushi.png",
    isSpicy: true,
  },
  {
    name: "Yellowtail Scallion Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Classic sushi roll filled with fresh yellowtail and scallions.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Spicy Yellowtail Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Sushi roll filled with chopped yellowtail mixed with spicy mayo.",
    imageUrl: "/images/templates/sushi.png",
    isSpicy: true,
  },
  {
    name: "Philadelphia Roll",
    category: "Sushi Rolls",
    cuisines: ["japanese","sushi"],
    description:
      "Smoked salmon, cream cheese, and cucumber roll.",
    imageUrl: "/images/templates/sushi.png",
  },
  {
    name: "Enchiladas A la Gloria",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Signature enchiladas filled with a blend of cheeses and topped with special sauce.",
    imageUrl: "/images/templates/taco.png",
  },
  {
    name: "Sour Cream Chicken Enchiladas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Shredded chicken enchiladas smothered in a rich and tangy sour cream sauce.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Enchiladas Verdes",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Enchiladas topped with a tangy and slightly spicy green tomatillo sauce.",
    imageUrl: "/images/templates/taco.png",
  },
  {
    name: "Beef Enchiladas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Savory ground beef enchiladas topped with traditional red chili sauce.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Shrimp Enchiladas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Enchiladas filled with seasoned shrimp, topped with a creamy sauce.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Spinach & Chicken Quesadilla",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Grilled flour tortilla stuffed with melted cheese, fresh spinach, and chicken.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Shrimp Quesadilla",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Grilled flour tortilla stuffed with melted cheese and seasoned shrimp.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Skirt Steak Fajita Quesadilla",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Grilled flour tortilla stuffed with melted cheese and marinated skirt steak fajitas.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Crispy Taco Dinner",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Three classic crispy shell tacos filled with ground beef or chicken, lettuce, tomato, and cheese.",
    imageUrl: "/images/templates/taco.png",
  },
  {
    name: "Chicken Flautas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Corn tortillas rolled with chicken and deep-fried until golden crisp, served with guacamole and sour cream.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Combination Plate",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "A generous platter featuring an enchilada, a taco, and a tamale, served with rice and beans.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Shredded Chicken Burrito",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Large flour tortilla wrapped around shredded chicken, beans, cheese, and rice.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Ground Beef Burrito",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Large flour tortilla wrapped around seasoned ground beef, beans, cheese, and rice.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Chicken Fajita Burrito",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Large flour tortilla wrapped around grilled chicken fajitas, beans, cheese, and rice.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Beef Fajita Burrito",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Large flour tortilla wrapped around grilled beef fajitas, beans, cheese, and rice.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Ground Beef Chile Relleno",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Poblano pepper stuffed with ground beef and cheese, battered and fried.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Beef Fajita Chile Relleno",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Poblano pepper stuffed with beef fajitas and cheese, battered and fried.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Chicken Fajita Chile Relleno",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Poblano pepper stuffed with chicken fajitas and cheese, battered and fried.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Shrimp Chile Relleno",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Poblano pepper stuffed with shrimp and cheese, battered and fried.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Chicken Fajitas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Sizzling marinated chicken strips grilled with onions and bell peppers, served with tortillas.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Skirt Steak Fajitas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Sizzling marinated skirt steak grilled with onions and bell peppers, served with tortillas.",
    imageUrl: "/images/templates/steak.png",
  },
  {
    name: "Veggie Fajitas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Sizzling assorted grilled vegetables served with tortillas.",
    imageUrl: "/images/templates/steak.png",
    isVegetarian: true,
  },
  {
    name: "Shrimp Fajitas",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Sizzling marinated shrimp grilled with onions and bell peppers, served with tortillas.",
    imageUrl: "/images/templates/seafood.png",
  },
  {
    name: "Tacos Al Carbón",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Grilled marinated beef or chicken folded in warm flour tortillas.",
    imageUrl: "/images/templates/taco.png",
  },
  {
    name: "Brisket Tacos",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Slow-roasted, tender beef brisket served in tortillas with onions and cilantro.",
    imageUrl: "/images/templates/taco.png",
  },
  {
    name: "Tacos de Pollo",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Classic chicken tacos garnished with fresh cilantro and diced onions.",
    imageUrl: "/images/templates/chicken.png",
  },
  {
    name: "Red Snapper Tacos",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Grilled or fried red snapper in tortillas, topped with slaw and a zesty sauce.",
    imageUrl: "/images/templates/taco.png",
  },
  {
    name: "Shrimp Tacos",
    category: "Main Courses",
    cuisines: ["tex-mex","mexican"],
    description:
      "Succulent shrimp served in tortillas, topped with fresh slaw and a creamy sauce.",
    imageUrl: "/images/templates/seafood.png",
  },
];
