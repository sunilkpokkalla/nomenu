const fs = require('fs');
const templatesFile = 'src/lib/templates.ts';
let content = fs.readFileSync(templatesFile, 'utf8');

// I will just add an array of templates and inject it before the ending bracket.
// I will extract the current templates.ts, remove the closing bracket of MENU_TEMPLATES, 
// append new templates, and close it.

const newTemplates = `
  {
    id: "fine-dining",
    name: "Fine Dining Tasting Menu",
    description: "An elegant, multi-course fine dining curation.",
    categories: [
      {
        name: "Amuse-Bouche",
        items: [
          { name: "Oyster with Mignonette", description: "Kumamoto oyster, champagne vinegar, shallots, cracked pepper.", price: 6.00 },
          { name: "Truffle Arancini", description: "Crispy risotto ball infused with black truffle and parmesan.", price: 8.00 },
          { name: "Caviar Tartlet", description: "Osetra caviar, crème fraîche, chives, delicate pastry shell.", price: 18.00 },
          { name: "Foie Gras Macaron", description: "Savory macaron filled with whipped duck liver mousse.", price: 12.00 },
          { name: "Gougère", description: "Warm Gruyère cheese puff with a hint of nutmeg.", price: 5.00 }
        ]
      },
      {
        name: "First Course",
        items: [
          { name: "Wagyu Beef Tartare", description: "Hand-cut wagyu, cured egg yolk, capers, crostini.", price: 28.00 },
          { name: "Hokkaido Scallop Crudo", description: "Thinly sliced raw scallop, yuzu kosho, finger lime, olive oil.", price: 26.00 },
          { name: "Heirloom Tomato Consommé", description: "Clarified tomato broth, basil oil, micro-greens.", price: 18.00 },
          { name: "Lobster Bisque", description: "Rich lobster stock, cognac cream, tarragon.", price: 24.00 },
          { name: "Roasted Bone Marrow", description: "Parsley salad, pickled shallots, grilled sourdough.", price: 22.00 }
        ]
      },
      {
        name: "Main Course",
        items: [
          { name: "Duck Magret", description: "Pan-seared duck breast, cherry reduction, parsnip purée.", price: 45.00 },
          { name: "Halibut Meunière", description: "Wild-caught halibut, brown butter, capers, lemon, parsley.", price: 42.00 },
          { name: "A5 Japanese Wagyu Ribeye", description: "4oz A5 Miyazaki wagyu, black garlic jus, maitake mushrooms.", price: 110.00 },
          { name: "Rack of Lamb", description: "Herb-crusted lamb, mint chimichurri, fondant potatoes.", price: 52.00 },
          { name: "Black Truffle Risotto", description: "Acquerello rice, Parmigiano-Reggiano, freshly shaved black truffle.", price: 48.00 }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Vanilla Bean Panna Cotta", description: "Madagascar vanilla, berry compote, micro-basil.", price: 16.00 },
          { name: "Chocolate Soufflé", description: "Valrhona dark chocolate, Grand Marnier crème anglaise.", price: 20.00 },
          { name: "Lemon Tart", description: "Meyer lemon curd, toasted meringue, shortbread crust.", price: 15.00 },
          { name: "Artisanal Cheese Board", description: "Chef's selection of 3 cheeses, honeycomb, marcona almonds.", price: 24.00 },
          { name: "Mille-Feuille", description: "Layers of puff pastry and vanilla pastry cream, caramelized sugar.", price: 18.00 }
        ]
      }
    ]
  },
  {
    id: "pub",
    name: "Gastropub Classics",
    description: "Elevated bar food, burgers, and hearty ales.",
    categories: [
      {
        name: "Bar Snacks",
        items: [
          { name: "Scotch Egg", description: "Soft-boiled egg wrapped in sausage meat, breaded and fried.", price: 9.00 },
          { name: "Pork Scratchings", description: "Crispy pork rind with smoked apple sauce.", price: 6.00 },
          { name: "Welsh Rarebit", description: "Melted cheddar and ale on toasted thick sourdough.", price: 10.00 },
          { name: "Spicy Sausage Roll", description: "Spiced pork filling in flaky puff pastry, mustard dip.", price: 8.00 },
          { name: "Pickled Egg & Onions", description: "House-pickled free-range egg and silver skin onions.", price: 5.00 },
          { name: "Loaded Fries", description: "Chips topped with pulled pork, cheese sauce, and jalapeños.", price: 12.00 }
        ]
      },
      {
        name: "Mains",
        items: [
          { name: "Bangers and Mash", description: "Cumberland sausages, buttery mashed potatoes, onion gravy.", price: 18.00 },
          { name: "Steak and Ale Pie", description: "Slow-cooked beef in ale gravy, shortcrust pastry, peas.", price: 22.00 },
          { name: "Beer Battered Fish & Chips", description: "Fresh cod, triple-cooked chips, mushy peas, tartare sauce.", price: 20.00 },
          { name: "The Pub Burger", description: "Double beef patty, bacon, cheddar, burger sauce, brioche bun.", price: 19.00 },
          { name: "Ploughman's Lunch", description: "Cheddar, ham, pork pie, crusty bread, pickles, apple.", price: 16.00 },
          { name: "Chicken Tikka Masala", description: "British-Indian classic, served with basmati rice and naan.", price: 21.00 }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Sticky Toffee Pudding", description: "Warm date sponge, butterscotch sauce, vanilla ice cream.", price: 10.00 },
          { name: "Eton Mess", description: "Crushed meringue, whipped cream, mixed berries.", price: 9.00 },
          { name: "Apple Crumble", description: "Spiced baked apples, oat crumble topping, hot custard.", price: 10.00 },
          { name: "Spotted Dick", description: "Traditional suet pudding with dried fruit and custard.", price: 9.00 }
        ]
      }
    ]
  },
  {
    id: "cafe",
    name: "Cafe & Bakery",
    description: "Coffee, pastries, sandwiches, and all-day breakfast.",
    categories: [
      {
        name: "Coffee & Espresso",
        items: [
          { name: "Espresso", description: "Double shot of house blend.", price: 3.50 },
          { name: "Cappuccino", description: "Equal parts espresso, steamed milk, and foam.", price: 4.50 },
          { name: "Latte", description: "Espresso with steamed milk and a light layer of foam.", price: 5.00 },
          { name: "Flat White", description: "Espresso with micro-foamed milk.", price: 4.75 },
          { name: "Mocha", description: "Espresso, steamed milk, dark chocolate syrup.", price: 5.50 },
          { name: "Cold Brew", description: "Slow-steeped iced coffee, served black.", price: 4.50 }
        ]
      },
      {
        name: "Pastries",
        items: [
          { name: "Butter Croissant", description: "Classic flaky, buttery French pastry.", price: 4.00 },
          { name: "Pain au Chocolat", description: "Croissant dough wrapped around dark chocolate batons.", price: 4.50 },
          { name: "Blueberry Muffin", description: "Streusel-topped muffin loaded with fresh blueberries.", price: 3.75 },
          { name: "Cinnamon Roll", description: "Soft dough, cinnamon sugar swirl, cream cheese icing.", price: 5.00 },
          { name: "Almond Croissant", description: "Twice-baked croissant filled with almond frangipane.", price: 5.50 }
        ]
      },
      {
        name: "Breakfast & Sandwiches",
        items: [
          { name: "Avocado Toast", description: "Smashed avocado, chili flakes, sea salt on sourdough.", price: 12.00 },
          { name: "Bacon Egg & Cheese", description: "Fried egg, crispy bacon, cheddar on a brioche bun.", price: 9.00 },
          { name: "Smoked Salmon Bagel", description: "Everything bagel, cream cheese, lox, capers, red onion.", price: 14.00 },
          { name: "Turkey Club Panini", description: "Sliced turkey, bacon, provolone, pesto mayo on ciabatta.", price: 13.00 },
          { name: "Caprese Sandwich", description: "Fresh mozzarella, tomato, basil, balsamic on baguette.", price: 11.00 },
          { name: "Granola Bowl", description: "House-made granola, Greek yogurt, fresh berries, honey.", price: 10.00 }
        ]
      }
    ]
  },
  {
    id: "seafood",
    name: "Coastal Seafood",
    description: "Fresh catches, oysters, crab, and coastal favorites.",
    categories: [
      {
        name: "Raw Bar",
        items: [
          { name: "Half Dozen Oysters", description: "Chef's selection of East or West Coast oysters, mignonette.", price: 21.00 },
          { name: "Shrimp Cocktail", description: "Jumbo poached shrimp, spicy cocktail sauce.", price: 18.00 },
          { name: "Tuna Poke", description: "Ahi tuna, soy-sesame dressing, avocado, macadamia nuts.", price: 22.00 },
          { name: "Seafood Tower", description: "Oysters, clams, shrimp, lobster tail, crab claws.", price: 85.00 },
          { name: "Scallop Ceviche", description: "Bay scallops, lime juice, jalapeño, cilantro, red onion.", price: 19.00 }
        ]
      },
      {
        name: "Starters",
        items: [
          { name: "Crab Cakes", description: "Maryland-style lump crab cakes, remoulade sauce.", price: 24.00 },
          { name: "Fried Calamari", description: "Crispy squid rings and tentacles, marinara, lemon.", price: 16.00 },
          { name: "Clam Chowder", description: "Creamy New England style with potatoes and bacon.", price: 10.00 },
          { name: "Steamed Mussels", description: "PEI mussels, white wine, garlic, butter, toasted baguette.", price: 18.00 },
          { name: "Lobster Bisque", description: "Rich, creamy lobster soup finished with sherry.", price: 14.00 }
        ]
      },
      {
        name: "Mains",
        items: [
          { name: "Grilled Swordfish", description: "Center-cut steak, lemon-caper butter, asparagus.", price: 34.00 },
          { name: "Lobster Roll", description: "Chunks of fresh lobster meat, light mayo, celery, buttered roll.", price: 32.00 },
          { name: "Seared Scallops", description: "Jumbo sea scallops, sweet corn purée, bacon lardons.", price: 38.00 },
          { name: "Whole Branzino", description: "Mediterranean sea bass, blistered tomatoes, olives, herbs.", price: 42.00 },
          { name: "Seafood Pasta", description: "Linguine, shrimp, clams, mussels, spicy tomato sauce.", price: 30.00 },
          { name: "Fish Tacos", description: "Blackened mahi-mahi, cabbage slaw, pico de gallo, crema.", price: 22.00 }
        ]
      }
    ]
  },
  {
    id: "indian",
    name: "Indian Cuisine",
    description: "Curries, tandoori specialties, and fresh naan.",
    categories: [
      {
        name: "Appetizers",
        items: [
          { name: "Vegetable Samosa", description: "Crispy pastry filled with spiced potatoes and peas.", price: 7.00 },
          { name: "Onion Bhaji", description: "Crispy onion fritters seasoned with mild spices.", price: 8.00 },
          { name: "Paneer Tikka", description: "Marinated cottage cheese cubes grilled in tandoor.", price: 12.00 },
          { name: "Chicken 65", description: "Spicy, deep-fried chicken bites flavored with curry leaves.", price: 14.00 },
          { name: "Aloo Tikki", description: "Spiced potato patties served with mint and tamarind chutney.", price: 8.00 }
        ]
      },
      {
        name: "Curries & Mains",
        items: [
          { name: "Chicken Tikka Masala", description: "Roasted marinated chicken chunks in a spiced curry sauce.", price: 20.00 },
          { name: "Butter Chicken", description: "Mild, creamy tomato-based curry with tender chicken.", price: 21.00 },
          { name: "Lamb Rogan Josh", description: "Aromatic braised lamb chunks in a gravy of browned onions and spices.", price: 24.00 },
          { name: "Palak Paneer", description: "Fresh spinach purée cooked with chunks of Indian cottage cheese.", price: 18.00 },
          { name: "Chana Masala", description: "Chickpeas simmered in a spiced tomato and onion gravy.", price: 16.00 },
          { name: "Biryani (Chicken/Lamb/Veg)", description: "Fragrant basmati rice layered with spices and your choice of protein.", price: 22.00 }
        ]
      },
      {
        name: "Breads & Sides",
        items: [
          { name: "Garlic Naan", description: "Leavened flatbread baked in tandoor with minced garlic.", price: 4.50 },
          { name: "Plain Naan", description: "Classic soft leavened flatbread.", price: 3.50 },
          { name: "Roti", description: "Whole wheat unleavened flatbread.", price: 3.00 },
          { name: "Basmati Rice", description: "Steamed aromatic long-grain rice.", price: 5.00 },
          { name: "Raita", description: "Cooling yogurt dip with cucumber and cumin.", price: 4.00 }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Gulab Jamun", description: "Fried milk dumplings soaked in cardamom-rose syrup.", price: 6.00 },
          { name: "Rasmalai", description: "Soft cheese patties in sweet, thickened milk flavored with saffron.", price: 7.00 },
          { name: "Mango Lassi", description: "Sweet and creamy yogurt drink blended with mango pulp.", price: 5.50 }
        ]
      }
    ]
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Greek and Levantine dips, kebabs, and mezze.",
    categories: [
      {
        name: "Mezze (Small Plates)",
        items: [
          { name: "Hummus", description: "Creamy chickpea purée, tahini, lemon, olive oil, warm pita.", price: 9.00 },
          { name: "Baba Ganoush", description: "Smoky roasted eggplant dip, tahini, garlic.", price: 10.00 },
          { name: "Tzatziki", description: "Greek yogurt, cucumber, dill, garlic dip.", price: 8.00 },
          { name: "Falafel", description: "Crispy fried chickpea herb patties, tahini sauce.", price: 11.00 },
          { name: "Dolmades", description: "Grape leaves stuffed with rice, herbs, and lemon.", price: 9.00 },
          { name: "Spanakopita", description: "Flaky phyllo pastry filled with spinach and feta cheese.", price: 12.00 },
          { name: "Feta & Olives", description: "Marinated Kalamata olives and sheep's milk feta.", price: 10.00 }
        ]
      },
      {
        name: "Salads & Soups",
        items: [
          { name: "Greek Salad", description: "Tomatoes, cucumbers, red onions, Kalamata olives, feta block.", price: 14.00 },
          { name: "Fattoush", description: "Mixed greens, radishes, tomatoes, crispy pita chips, sumac vinaigrette.", price: 13.00 },
          { name: "Tabbouleh", description: "Parsley, mint, bulgur, tomatoes, lemon juice.", price: 11.00 },
          { name: "Lentil Soup", description: "Red lentils, cumin, onions, lemon wedge.", price: 8.00 }
        ]
      },
      {
        name: "Mains & Grills",
        items: [
          { name: "Chicken Souvlaki", description: "Marinated chicken skewers, rice pilaf, tzatziki, pita.", price: 21.00 },
          { name: "Lamb Gyro Plate", description: "Shaved lamb/beef mix, fries, Greek salad, pita.", price: 22.00 },
          { name: "Beef Kofta", description: "Spiced ground beef skewers, grilled vegetables, hummus.", price: 23.00 },
          { name: "Moussaka", description: "Layered eggplant, potatoes, ground beef, béchamel sauce.", price: 24.00 },
          { name: "Grilled Branzino", description: "Whole Mediterranean sea bass, olive oil, lemon, herbs.", price: 32.00 }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Baklava", description: "Layers of phyllo dough, chopped nuts, honey syrup.", price: 7.00 },
          { name: "Knafeh", description: "Warm sweet cheese pastry, shredded phyllo, pistachio.", price: 10.00 },
          { name: "Greek Yogurt", description: "Served with local honey and walnuts.", price: 8.00 }
        ]
      }
    ]
  }
];
`;

content = content.replace(/];$/, '');
content += newTemplates;

fs.writeFileSync(templatesFile, content, 'utf8');
console.log('Appended templates');
