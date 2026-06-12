export interface TemplateItem {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface TemplateCategory {
  name: string;
  items: TemplateItem[];
}

export interface MenuTemplate {
  id: string;
  name: string;
  description: string;
  categories: TemplateCategory[];
}

// High-quality AI-generated template images
const IMAGES = {
  burger: "/images/templates/burger.png",
  steak: "/images/templates/steak.png",
  salad: "/images/templates/salad.png",
  cocktail: "/images/templates/cocktail.png",
  dessert: "/images/templates/dessert.png",
  pizza: "/images/templates/pizza.png",
  pasta: "/images/templates/pasta.png",
  sushi: "/images/templates/sushi.png",
  coffee: "/images/templates/coffee.png",
  taco: "/images/templates/taco.png",
  soup: "/images/templates/soup.png",
  sandwich: "/images/templates/sandwich.png",
  seafood: "/images/templates/seafood.png",
  chicken: "/images/templates/chicken.png",
  beer: "/images/templates/beer.png",
  appetizer: "/images/templates/appetizer.png",
  pastry: "/images/templates/pastry.png",
};

export const MENU_TEMPLATES: MenuTemplate[] = [
  {
    id: "standard",
    name: "Standard Dining",
    description: "A complete, production-ready American dining menu.",
    categories: [
      {
        name: "Starters & Shareables",
        items: [
          { name: "Spinach Artichoke Dip", description: "Creamy blend of cheeses, spinach, and artichoke hearts. Served with warm tortilla chips.", price: 14.00, imageUrl: IMAGES.appetizer },
          { name: "Crispy Calamari", description: "Lightly breaded and fried golden brown, served with house marinara.", price: 16.50, imageUrl: IMAGES.seafood },
          { name: "Loaded Potato Skins", description: "Crispy skins loaded with cheddar, bacon, scallions, and sour cream.", price: 12.00, imageUrl: IMAGES.appetizer },
          { name: "Buffalo Wings (10)", description: "Jumbo wings tossed in classic buffalo sauce. Served with blue cheese and celery.", price: 16.00, imageUrl: IMAGES.chicken },
          { name: "Bruschetta", description: "Toasted baguette topped with diced tomatoes, garlic, basil, and balsamic glaze.", price: 11.00, imageUrl: IMAGES.appetizer },
          { name: "Onion Rings", description: "Thick-cut, beer-battered onion rings with spicy ranch.", price: 10.00, imageUrl: IMAGES.appetizer },
          { name: "Mozzarella Sticks", description: "Six crispy fried cheese sticks with marinara dipping sauce.", price: 11.00, imageUrl: IMAGES.appetizer },
          { name: "Shrimp Cocktail", description: "Five jumbo shrimp chilled, served with fiery cocktail sauce and lemon.", price: 18.00, imageUrl: IMAGES.seafood }
        ]
      },
      {
        name: "Soups & Salads",
        items: [
          { name: "French Onion Soup", description: "Rich beef broth, caramelized onions, topped with a crostini and melted gruyere.", price: 9.00, imageUrl: IMAGES.soup },
          { name: "New England Clam Chowder", description: "Creamy traditional chowder loaded with sea clams and potatoes.", price: 10.00, imageUrl: IMAGES.soup },
          { name: "Classic Caesar Salad", description: "Crisp romaine, shaved parmesan, garlic croutons, and house caesar dressing.", price: 13.00, imageUrl: IMAGES.salad },
          { name: "Cobb Salad", description: "Mixed greens, grilled chicken, bacon, hard-boiled egg, avocado, tomatoes, blue cheese.", price: 18.00, imageUrl: IMAGES.salad },
          { name: "House Salad", description: "Mixed greens, cherry tomatoes, cucumbers, red onions, croutons. Choice of dressing.", price: 10.00, imageUrl: IMAGES.salad },
          { name: "Caprese Salad", description: "Fresh mozzarella, vine-ripe tomatoes, basil, olive oil, and balsamic reduction.", price: 14.00, imageUrl: IMAGES.salad }
        ]
      },
      {
        name: "Burgers & Sandwiches",
        items: [
          { name: "Classic Cheeseburger", description: "Half-pound Angus patty, cheddar, lettuce, tomato, onion, pickle on a brioche bun. Served with fries.", price: 16.00, imageUrl: IMAGES.burger },
          { name: "Bacon BBQ Burger", description: "Angus patty, crispy bacon, onion rings, cheddar, and house BBQ sauce.", price: 18.00, imageUrl: IMAGES.burger },
          { name: "Mushroom Swiss Burger", description: "Sautéed mushrooms, melted swiss cheese, truffle mayo.", price: 17.00, imageUrl: IMAGES.burger },
          { name: "Grilled Chicken Sandwich", description: "Marinated chicken breast, provolone, lettuce, tomato, garlic aioli.", price: 15.00, imageUrl: IMAGES.sandwich },
          { name: "Spicy Fried Chicken Sandwich", description: "Buttermilk fried chicken tossed in hot honey, house slaw, pickles.", price: 16.00, imageUrl: IMAGES.sandwich },
          { name: "Philly Cheesesteak", description: "Shaved ribeye, caramelized onions, peppers, provolone on a hoagie roll.", price: 17.00, imageUrl: IMAGES.sandwich },
          { name: "Club Sandwich", description: "Turkey, ham, bacon, cheddar, lettuce, tomato, mayo on toasted sourdough.", price: 15.00, imageUrl: IMAGES.sandwich }
        ]
      },
      {
        name: "Main Courses",
        items: [
          { name: "New York Strip (12oz)", description: "USDA Prime strip steak, grilled to order. Served with garlic mashed potatoes and asparagus.", price: 38.00, imageUrl: IMAGES.steak },
          { name: "Filet Mignon (8oz)", description: "Tender center-cut filet, red wine demi-glace, roasted potatoes.", price: 42.00, imageUrl: IMAGES.steak },
          { name: "Grilled Atlantic Salmon", description: "Fresh salmon filet, lemon-dill butter, wild rice, seasonal vegetables.", price: 28.00, imageUrl: IMAGES.seafood },
          { name: "Fish and Chips", description: "Beer-battered cod, thick-cut fries, house coleslaw, tartar sauce.", price: 22.00, imageUrl: IMAGES.seafood },
          { name: "Chicken Parmesan", description: "Breaded chicken breast, marinara, melted mozzarella, over linguine.", price: 24.00, imageUrl: IMAGES.chicken },
          { name: "Penne alla Vodka", description: "Penne pasta tossed in a creamy tomato vodka sauce with pancetta.", price: 20.00, imageUrl: IMAGES.pasta },
          { name: "BBQ Baby Back Ribs", description: "Slow-cooked, fall-off-the-bone ribs, fries, coleslaw. Half rack.", price: 26.00, imageUrl: IMAGES.steak },
          { name: "Roasted Vegetable Quinoa Bowl", description: "Seasonal roasted vegetables, quinoa, avocado, tahini-lemon dressing.", price: 18.00, imageUrl: IMAGES.salad }
        ]
      },
      {
        name: "Sides",
        items: [
          { name: "Truffle Fries", description: "Crispy fries tossed in truffle oil, parmesan, and parsley.", price: 8.00, imageUrl: IMAGES.appetizer },
          { name: "Garlic Mashed Potatoes", description: "Creamy potatoes whipped with roasted garlic and butter.", price: 7.00, imageUrl: IMAGES.appetizer },
          { name: "Steamed Asparagus", description: "Fresh asparagus tossed in olive oil and lemon.", price: 8.00, imageUrl: IMAGES.salad },
          { name: "Mac & Cheese", description: "Four-cheese blend baked with a crispy breadcrumb topping.", price: 9.00, imageUrl: IMAGES.pasta },
          { name: "Sweet Potato Fries", description: "Served with maple-cinnamon aioli.", price: 8.00, imageUrl: IMAGES.appetizer },
          { name: "Coleslaw", description: "House-made creamy cabbage slaw.", price: 5.00, imageUrl: IMAGES.salad }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "New York Cheesecake", description: "Classic creamy cheesecake with a graham cracker crust and strawberry sauce.", price: 9.00, imageUrl: IMAGES.dessert },
          { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center. Served with vanilla ice cream.", price: 11.00, imageUrl: IMAGES.dessert },
          { name: "Crème Brûlée", description: "Rich vanilla custard with a caramelized sugar crust.", price: 10.00, imageUrl: IMAGES.dessert },
          { name: "Apple Cobbler", description: "Warm baked apples, cinnamon streusel topping, vanilla ice cream.", price: 9.00, imageUrl: IMAGES.dessert },
          { name: "Key Lime Pie", description: "Tart and creamy key lime filling, graham crust, whipped cream.", price: 9.00, imageUrl: IMAGES.dessert },
          { name: "Brownie Sundae", description: "Warm fudge brownie, two scoops vanilla ice cream, hot fudge, nuts, cherry.", price: 10.00, imageUrl: IMAGES.dessert }
        ]
      },
      {
        name: "Beverages & Cocktails",
        items: [
          { name: "Old Fashioned", description: "Bourbon, simple syrup, angostura bitters, orange peel.", price: 14.00, imageUrl: IMAGES.cocktail },
          { name: "Margarita", description: "Blanco tequila, fresh lime juice, agave nectar, salt rim.", price: 12.00, imageUrl: IMAGES.cocktail },
          { name: "Moscow Mule", description: "Vodka, ginger beer, fresh lime, served in a copper mug.", price: 12.00, imageUrl: IMAGES.cocktail },
          { name: "Draft IPA", description: "Rotating selection of local craft IPA. 16oz.", price: 8.00, imageUrl: IMAGES.beer },
          { name: "Pilsner", description: "Crisp, refreshing light lager. 16oz.", price: 7.00, imageUrl: IMAGES.beer },
          { name: "Cabernet Sauvignon", description: "Rich, full-bodied red wine. Glass.", price: 12.00, imageUrl: IMAGES.cocktail },
          { name: "Chardonnay", description: "Oaky, buttery white wine. Glass.", price: 11.00, imageUrl: IMAGES.cocktail },
          { name: "Fountain Soda", description: "Coke, Diet Coke, Sprite, Ginger Ale.", price: 3.50, imageUrl: IMAGES.coffee }
        ]
      }
    ]
  },
  {
    id: "italian",
    name: "Italian & Pasta",
    description: "A complete Italian dining experience featuring antipasti, fresh pasta, and pizza.",
    categories: [
      {
        name: "Antipasti (Appetizers)",
        items: [
          { name: "Bruschetta al Pomodoro", description: "Toasted rustic bread, marinated heirloom tomatoes, garlic, basil, EVOO.", price: 12.00, imageUrl: IMAGES.appetizer },
          { name: "Calamari Fritti", description: "Crispy fried squid rings, lemon wedge, spicy marinara.", price: 16.00, imageUrl: IMAGES.seafood },
          { name: "Burrata & Prosciutto", description: "Fresh burrata cheese, 24-month aged Prosciutto di Parma, hot honey.", price: 19.00, imageUrl: IMAGES.appetizer },
          { name: "Arancini", description: "Crispy risotto balls stuffed with mozzarella and peas, served with ragu.", price: 14.00, imageUrl: IMAGES.appetizer },
          { name: "Carpaccio di Manzo", description: "Thinly sliced raw beef, arugula, shaved parmesan, truffle oil, capers.", price: 18.00, imageUrl: IMAGES.steak },
          { name: "Polpette (Meatballs)", description: "Three house-made beef and pork meatballs in San Marzano tomato sauce.", price: 15.00, imageUrl: IMAGES.appetizer }
        ]
      },
      {
        name: "Insalate & Zuppe (Salads & Soups)",
        items: [
          { name: "Minestrone", description: "Classic Italian vegetable soup with beans and ditalini pasta.", price: 9.00, imageUrl: IMAGES.soup },
          { name: "Insalata Mista", description: "Mixed greens, cherry tomatoes, cucumbers, balsamic vinaigrette.", price: 11.00, imageUrl: IMAGES.salad },
          { name: "Insalata Caprese", description: "Slices of fresh mozzarella, tomatoes, basil, drizzled with balsamic reduction.", price: 14.00, imageUrl: IMAGES.salad },
          { name: "Insalata di Cesare", description: "Romaine hearts, classic caesar dressing, garlic croutons, parmigiano-reggiano.", price: 13.00, imageUrl: IMAGES.salad },
          { name: "Arugula & Fennel", description: "Baby arugula, shaved fennel, orange segments, citrus vinaigrette.", price: 14.00, imageUrl: IMAGES.salad }
        ]
      },
      {
        name: "Pizze (Wood-Fired Pizza)",
        items: [
          { name: "Margherita", description: "San Marzano tomato sauce, fresh mozzarella, basil, extra virgin olive oil.", price: 18.00, imageUrl: IMAGES.pizza },
          { name: "Diavola", description: "Tomato sauce, mozzarella, spicy Calabrian salami, chili flakes.", price: 21.00, imageUrl: IMAGES.pizza },
          { name: "Quattro Formaggi", description: "White pizza with mozzarella, gorgonzola, fontina, and parmigiano.", price: 22.00, imageUrl: IMAGES.pizza },
          { name: "Funghi Tartufo", description: "Wild mushrooms, mozzarella, truffle oil, roasted garlic.", price: 23.00, imageUrl: IMAGES.pizza },
          { name: "Prosciutto e Rucola", description: "Tomato sauce, mozzarella, topped with fresh arugula, prosciutto, shaved parmesan.", price: 24.00, imageUrl: IMAGES.pizza },
          { name: "Salsiccia", description: "Tomato sauce, mozzarella, Italian sausage, roasted red peppers, onions.", price: 21.00, imageUrl: IMAGES.pizza }
        ]
      },
      {
        name: "Primi (Fresh Pasta)",
        items: [
          { name: "Spaghetti Carbonara", description: "Pancetta, egg yolk, pecorino romano, cracked black pepper.", price: 22.00, imageUrl: IMAGES.pasta },
          { name: "Tagliatelle al Ragù", description: "Ribbon pasta with traditional slow-cooked beef and pork bolognese sauce.", price: 24.00, imageUrl: IMAGES.pasta },
          { name: "Cacio e Pepe", description: "Tonnarelli pasta, pecorino romano, toasted black pepper.", price: 20.00, imageUrl: IMAGES.pasta },
          { name: "Penne all'Arrabbiata", description: "Short pasta in a spicy garlic and tomato sauce.", price: 19.00, imageUrl: IMAGES.pasta },
          { name: "Linguine alle Vongole", description: "Linguine with fresh clams, garlic, white wine, chili flakes, parsley.", price: 26.00, imageUrl: IMAGES.pasta },
          { name: "Ravioli di Ricotta", description: "House-made ravioli stuffed with ricotta and spinach, in a butter sage sauce.", price: 23.00, imageUrl: IMAGES.pasta },
          { name: "Gnocchi al Pesto", description: "Potato dumplings tossed in basil pesto with toasted pine nuts.", price: 22.00, imageUrl: IMAGES.pasta },
          { name: "Lasagna al Forno", description: "Baked layers of pasta, bolognese, bechamel, and parmesan.", price: 25.00, imageUrl: IMAGES.pasta }
        ]
      },
      {
        name: "Secondi (Main Courses)",
        items: [
          { name: "Pollo Parmigiana", description: "Breaded chicken breast, marinara, melted mozzarella. Served with spaghetti.", price: 26.00, imageUrl: IMAGES.chicken },
          { name: "Vitello Marsala", description: "Veal medallions sautéed with mushrooms in a sweet Marsala wine sauce.", price: 32.00, imageUrl: IMAGES.steak },
          { name: "Bistecca alla Fiorentina", description: "32oz Porterhouse steak, grilled with olive oil and rosemary (Serves 2).", price: 85.00, imageUrl: IMAGES.steak },
          { name: "Salmone Arrosto", description: "Wood-roasted salmon, lemon-caper sauce, sautéed spinach.", price: 30.00, imageUrl: IMAGES.seafood },
          { name: "Osso Buco", description: "Braised veal shank in a white wine tomato broth, served over saffron risotto.", price: 42.00, imageUrl: IMAGES.steak }
        ]
      },
      {
        name: "Contorni (Sides)",
        items: [
          { name: "Broccolini", description: "Sautéed with garlic, olive oil, and chili flakes.", price: 9.00, imageUrl: IMAGES.salad },
          { name: "Patate Arrosto", description: "Roasted fingerling potatoes with rosemary.", price: 8.00, imageUrl: IMAGES.appetizer },
          { name: "Spinaci Saltati", description: "Spinach sautéed in garlic and olive oil.", price: 8.00, imageUrl: IMAGES.salad },
          { name: "Pane all'Aglio", description: "Rustic garlic bread with parmesan.", price: 7.00, imageUrl: IMAGES.appetizer }
        ]
      },
      {
        name: "Dolci (Desserts)",
        items: [
          { name: "Tiramisu", description: "Espresso-soaked ladyfingers, mascarpone cream, cocoa powder.", price: 11.00, imageUrl: IMAGES.dessert },
          { name: "Cannoli Siciliani", description: "Two crispy pastry shells filled with sweet ricotta and chocolate chips.", price: 9.00, imageUrl: IMAGES.dessert },
          { name: "Panna Cotta", description: "Vanilla bean custard with wild berry compote.", price: 10.00, imageUrl: IMAGES.dessert },
          { name: "Gelato", description: "Two scoops. Choice of Vanilla, Chocolate, Pistachio, or Stracciatella.", price: 8.00, imageUrl: IMAGES.dessert },
          { name: "Affogato", description: "A scoop of vanilla gelato 'drowned' in a shot of hot espresso.", price: 9.00, imageUrl: IMAGES.coffee }
        ]
      }
    ]
  },
  {
    id: "cafe",
    name: "Cafe & Coffee Shop",
    description: "Complete cafe menu featuring espresso drinks, teas, pastries, and breakfast items.",
    categories: [
      {
        name: "Espresso & Hot Coffee",
        items: [
          { name: "Espresso (Double)", description: "Rich, full-bodied double shot of our house blend.", price: 3.50, imageUrl: IMAGES.coffee },
          { name: "Americano", description: "Double espresso pulled over hot water.", price: 4.00, imageUrl: IMAGES.coffee },
          { name: "Macchiato", description: "Espresso marked with a dollop of steamed milk foam.", price: 4.25, imageUrl: IMAGES.coffee },
          { name: "Cortado", description: "Equal parts espresso and warmly steamed milk.", price: 4.50, imageUrl: IMAGES.coffee },
          { name: "Cappuccino", description: "Espresso with equal parts steamed milk and deep microfoam.", price: 5.00, imageUrl: IMAGES.coffee },
          { name: "Latte", description: "Espresso with steamed milk and a light layer of foam.", price: 5.50, imageUrl: IMAGES.coffee },
          { name: "Mocha", description: "Espresso, steamed milk, and rich dark chocolate sauce.", price: 6.00, imageUrl: IMAGES.coffee },
          { name: "Flat White", description: "Ristretto espresso shots with velvety steamed milk.", price: 5.25, imageUrl: IMAGES.coffee },
          { name: "Drip Coffee", description: "Freshly brewed single-origin batch filter coffee.", price: 3.00, imageUrl: IMAGES.coffee },
          { name: "Pour Over", description: "Hand-poured filter coffee highlighting single-origin beans.", price: 6.50, imageUrl: IMAGES.coffee }
        ]
      },
      {
        name: "Iced Coffee & Cold Brew",
        items: [
          { name: "Cold Brew", description: "Steeped for 18 hours for a smooth, low-acid flavor profile.", price: 5.00, imageUrl: IMAGES.coffee },
          { name: "Nitro Cold Brew", description: "Cold brew infused with nitrogen for a creamy, stout-like texture.", price: 6.00, imageUrl: IMAGES.coffee },
          { name: "Iced Latte", description: "Espresso and cold milk poured over ice.", price: 5.50, imageUrl: IMAGES.coffee },
          { name: "Iced Americano", description: "Espresso and cold water poured over ice.", price: 4.00, imageUrl: IMAGES.coffee },
          { name: "Iced Mocha", description: "Espresso, cold milk, and chocolate sauce over ice.", price: 6.00, imageUrl: IMAGES.coffee }
        ]
      },
      {
        name: "Tea & Alternatives",
        items: [
          { name: "Matcha Latte", description: "Ceremonial grade matcha whisked with steamed milk and a touch of honey.", price: 6.00, imageUrl: IMAGES.coffee },
          { name: "Chai Latte", description: "Spiced black tea concentrate blended with steamed milk.", price: 5.50, imageUrl: IMAGES.coffee },
          { name: "London Fog", description: "Earl Grey tea steeped in steamed milk with vanilla syrup.", price: 5.00, imageUrl: IMAGES.coffee },
          { name: "Loose Leaf Tea", description: "Choice of English Breakfast, Earl Grey, Chamomile, Peppermint, or Green.", price: 4.00, imageUrl: IMAGES.coffee },
          { name: "Hot Chocolate", description: "Rich cocoa, steamed milk, topped with whipped cream.", price: 4.50, imageUrl: IMAGES.coffee }
        ]
      },
      {
        name: "Pastries & Bakery",
        items: [
          { name: "Butter Croissant", description: "Flaky, buttery, freshly baked every morning.", price: 4.50, imageUrl: IMAGES.pastry },
          { name: "Almond Croissant", description: "Filled with almond frangipane and topped with sliced almonds.", price: 5.50, imageUrl: IMAGES.pastry },
          { name: "Pain au Chocolat", description: "Flaky pastry wrapped around dark chocolate batons.", price: 5.00, imageUrl: IMAGES.pastry },
          { name: "Blueberry Muffin", description: "Loaded with wild blueberries and topped with a streusel crumble.", price: 4.00, imageUrl: IMAGES.pastry },
          { name: "Banana Nut Bread", description: "Moist banana bread slice loaded with walnuts.", price: 4.50, imageUrl: IMAGES.pastry },
          { name: "Chocolate Chip Cookie", description: "Massive, gooey, brown-butter chocolate chip cookie.", price: 3.50, imageUrl: IMAGES.pastry },
          { name: "Cinnamon Roll", description: "Warm, soft cinnamon roll topped with cream cheese icing.", price: 5.50, imageUrl: IMAGES.pastry }
        ]
      },
      {
        name: "Breakfast & Food",
        items: [
          { name: "Bacon, Egg & Cheese", description: "Crispy bacon, folded egg, cheddar cheese on a toasted brioche bun.", price: 8.50, imageUrl: IMAGES.sandwich },
          { name: "Sausage, Egg & Cheese", description: "Pork sausage patty, folded egg, cheddar on an english muffin.", price: 8.50, imageUrl: IMAGES.sandwich },
          { name: "Avocado Toast", description: "Smashed avocado, cherry tomatoes, radish, microgreens, chili flakes on thick-cut sourdough.", price: 11.00, imageUrl: IMAGES.salad },
          { name: "Smoked Salmon Bagel", description: "Toasted everything bagel, cream cheese, smoked salmon, capers, red onion, dill.", price: 14.00, imageUrl: IMAGES.sandwich },
          { name: "Oatmeal Bowl", description: "Steel-cut oats topped with fresh berries, sliced almonds, and a drizzle of maple syrup.", price: 8.00, imageUrl: IMAGES.soup },
          { name: "Yogurt Parfait", description: "Greek yogurt, house-made granola, mixed berries, and honey.", price: 7.50, imageUrl: IMAGES.dessert }
        ]
      }
    ]
  },
  {
    id: "japanese",
    name: "Japanese & Sushi",
    description: "Extensive sushi menu covering rolls, sashimi, hot appetizers, and ramen.",
    categories: [
      {
        name: "Zensai (Appetizers)",
        items: [
          { name: "Edamame", description: "Steamed soybeans tossed with coarse sea salt.", price: 6.00, imageUrl: IMAGES.appetizer },
          { name: "Spicy Garlic Edamame", description: "Edamame sautéed with garlic, chili oil, and soy.", price: 8.00, imageUrl: IMAGES.appetizer },
          { name: "Pork Gyoza", description: "Six pan-fried pork and cabbage dumplings, served with ponzu dipping sauce.", price: 9.00, imageUrl: IMAGES.appetizer },
          { name: "Shrimp Tempura", description: "Four pieces of lightly battered and fried shrimp with tempura sauce.", price: 12.00, imageUrl: IMAGES.seafood },
          { name: "Spicy Tuna Crispy Rice", description: "Crispy pan-fried sushi rice topped with spicy tuna, jalapeño, and eel sauce.", price: 15.00, imageUrl: IMAGES.sushi },
          { name: "Yellowtail Jalapeño", description: "Thinly sliced yellowtail sashimi, jalapeño rings, cilantro, yuzu ponzu.", price: 18.00, imageUrl: IMAGES.sushi },
          { name: "Agedashi Tofu", description: "Deep-fried silken tofu in a dashi-soy broth, topped with bonito flakes.", price: 10.00, imageUrl: IMAGES.appetizer }
        ]
      },
      {
        name: "Soups & Salads",
        items: [
          { name: "Miso Soup", description: "Traditional dashi and soybean paste broth, tofu, seaweed, scallions.", price: 4.00, imageUrl: IMAGES.soup },
          { name: "Seaweed Salad", description: "Marinated wakame seaweed with sesame seeds.", price: 7.00, imageUrl: IMAGES.salad },
          { name: "House Salad", description: "Mixed greens with our signature ginger dressing.", price: 6.00, imageUrl: IMAGES.salad },
          { name: "Sashimi Salad", description: "Assorted raw fish over mixed greens with a spicy yuzu dressing.", price: 18.00, imageUrl: IMAGES.salad }
        ]
      },
      {
        name: "Classic Maki (Rolls)",
        items: [
          { name: "California Roll", description: "Crab mix, avocado, cucumber.", price: 8.00, imageUrl: IMAGES.sushi },
          { name: "Spicy Tuna Roll", description: "Minced tuna mixed with spicy mayo, cucumber.", price: 9.00, imageUrl: IMAGES.sushi },
          { name: "Spicy Salmon Roll", description: "Minced salmon mixed with spicy mayo, avocado.", price: 9.00, imageUrl: IMAGES.sushi },
          { name: "Eel Avocado Roll", description: "BBQ freshwater eel, avocado, eel sauce.", price: 10.00, imageUrl: IMAGES.sushi },
          { name: "Philadelphia Roll", description: "Smoked salmon, cream cheese, avocado.", price: 10.00, imageUrl: IMAGES.sushi },
          { name: "Shrimp Tempura Roll", description: "Crispy shrimp tempura, avocado, cucumber, eel sauce.", price: 11.00, imageUrl: IMAGES.sushi },
          { name: "Spider Roll", description: "Soft shell crab tempura, avocado, cucumber, spicy mayo, eel sauce.", price: 14.00, imageUrl: IMAGES.sushi }
        ]
      },
      {
        name: "Specialty Maki",
        items: [
          { name: "Dragon Roll", description: "Shrimp tempura and cucumber inside, topped with eel, avocado, and eel sauce.", price: 16.00, imageUrl: IMAGES.sushi },
          { name: "Rainbow Roll", description: "California roll topped with assorted sashimi (tuna, salmon, yellowtail, white fish, avocado).", price: 17.00, imageUrl: IMAGES.sushi },
          { name: "Volcano Roll", description: "California roll topped with a baked mixture of scallops, crab, and spicy mayo, eel sauce, scallions.", price: 18.00, imageUrl: IMAGES.sushi },
          { name: "Caterpillar Roll", description: "Eel and cucumber inside, topped with layers of avocado and eel sauce.", price: 15.00, imageUrl: IMAGES.sushi },
          { name: "Firecracker Roll", description: "Spicy tuna and jalapeño inside, topped with spicy yellowtail and sriracha.", price: 17.00, imageUrl: IMAGES.sushi }
        ]
      },
      {
        name: "Nigiri & Sashimi",
        items: [
          { name: "Maguro (Tuna)", description: "2 pieces Nigiri or 3 pieces Sashimi.", price: 8.00, imageUrl: IMAGES.sushi },
          { name: "Sake (Salmon)", description: "2 pieces Nigiri or 3 pieces Sashimi.", price: 7.00, imageUrl: IMAGES.sushi },
          { name: "Hamachi (Yellowtail)", description: "2 pieces Nigiri or 3 pieces Sashimi.", price: 8.00, imageUrl: IMAGES.sushi },
          { name: "Unagi (Freshwater Eel)", description: "2 pieces Nigiri or 3 pieces Sashimi.", price: 9.00, imageUrl: IMAGES.sushi },
          { name: "Hotate (Scallop)", description: "2 pieces Nigiri or 3 pieces Sashimi.", price: 10.00, imageUrl: IMAGES.sushi },
          { name: "Ebi (Shrimp)", description: "2 pieces Nigiri or 3 pieces Sashimi.", price: 6.00, imageUrl: IMAGES.sushi },
          { name: "Sashimi Deluxe Platter", description: "Chef's selection of 18 pieces of premium sashimi.", price: 45.00, imageUrl: IMAGES.sushi }
        ]
      },
      {
        name: "Hot Entrees & Noodles",
        items: [
          { name: "Tonkotsu Ramen", description: "Rich pork broth, fresh noodles, chashu pork belly, soft boiled egg, wood ear mushrooms, scallions.", price: 18.00, imageUrl: IMAGES.soup },
          { name: "Spicy Miso Ramen", description: "Miso and chili-infused pork broth, fresh noodles, ground pork, corn, bean sprouts.", price: 18.00, imageUrl: IMAGES.soup },
          { name: "Chicken Teriyaki", description: "Grilled chicken breast glazed with house teriyaki sauce, served with steamed rice and vegetables.", price: 20.00, imageUrl: IMAGES.chicken },
          { name: "Salmon Teriyaki", description: "Grilled salmon filet glazed with house teriyaki sauce, served with steamed rice and vegetables.", price: 24.00, imageUrl: IMAGES.seafood },
          { name: "Chicken Katsu Curry", description: "Panko breaded fried chicken cutlet, rich Japanese curry sauce, steamed rice.", price: 22.00, imageUrl: IMAGES.chicken },
          { name: "Yakisoba", description: "Stir-fried noodles with chicken, cabbage, carrots, onions, and savory yakisoba sauce.", price: 17.00, imageUrl: IMAGES.pasta }
        ]
      },
      {
        name: "Desserts & Drinks",
        items: [
          { name: "Mochi Ice Cream", description: "Three pieces. Choice of Green Tea, Mango, Strawberry, or Vanilla.", price: 7.00, imageUrl: IMAGES.dessert },
          { name: "Green Tea Cheesecake", description: "Matcha infused cheesecake with a graham cracker crust.", price: 9.00, imageUrl: IMAGES.dessert },
          { name: "Hot Sake (Tokkuri)", description: "Traditional warm house sake. Small carafe.", price: 8.00, imageUrl: IMAGES.cocktail },
          { name: "Sapporo Draft", description: "Premium Japanese lager on tap.", price: 7.00, imageUrl: IMAGES.beer }
        ]
      }
    ]
  },
  {
    id: "mexican",
    name: "Mexican & Taqueria",
    description: "Authentic taqueria menu with tacos, burritos, fajitas, and margaritas.",
    categories: [
      {
        name: "Antojitos (Starters)",
        items: [
          { name: "Guacamole & Chips", description: "Made fresh to order: Hass avocados, jalapeño, tomato, red onion, cilantro, lime. Served with warm tortilla chips.", price: 12.00, imageUrl: IMAGES.appetizer },
          { name: "Queso Fundido", description: "Melted Oaxaca and Monterey Jack cheese, house-made chorizo. Served with warm flour tortillas.", price: 14.00, imageUrl: IMAGES.appetizer },
          { name: "Elote (Street Corn)", description: "Grilled corn on the cob slathered in mayo, cotija cheese, chili powder, and lime.", price: 7.00, imageUrl: IMAGES.appetizer },
          { name: "Ceviche de Camarón", description: "Shrimp marinated in lime juice, cucumber, pico de gallo, avocado.", price: 16.00, imageUrl: IMAGES.seafood },
          { name: "Nachos Supremos", description: "Tortilla chips loaded with refried beans, queso, pico de gallo, jalapeños, sour cream, guacamole.", price: 15.00, imageUrl: IMAGES.appetizer },
          { name: "Taquitos Dorados", description: "Four crispy rolled corn tortillas filled with shredded chicken, topped with lettuce, crema, and cotija cheese.", price: 11.00, imageUrl: IMAGES.appetizer }
        ]
      },
      {
        name: "Street Tacos",
        items: [
          { name: "Tacos Al Pastor", description: "Three corn tortillas, marinated pork, roasted pineapple, diced onion, cilantro.", price: 14.00, imageUrl: IMAGES.taco },
          { name: "Tacos de Carne Asada", description: "Three corn tortillas, grilled marinated steak, diced onion, cilantro, salsa roja.", price: 16.00, imageUrl: IMAGES.taco },
          { name: "Tacos de Carnitas", description: "Three corn tortillas, slow-braised pork shoulder, diced onion, cilantro, salsa verde.", price: 14.00, imageUrl: IMAGES.taco },
          { name: "Tacos de Pollo", description: "Three corn tortillas, grilled marinated chicken, pico de gallo, avocado salsa.", price: 13.00, imageUrl: IMAGES.taco },
          { name: "Baja Fish Tacos", description: "Three corn tortillas, beer-battered cod, cabbage slaw, chipotle crema.", price: 15.00, imageUrl: IMAGES.taco },
          { name: "Tacos Veganos", description: "Three corn tortillas, roasted sweet potatoes, black beans, corn salsa, avocado.", price: 13.00, imageUrl: IMAGES.taco }
        ]
      },
      {
        name: "Burritos & Bowls",
        items: [
          { name: "Carne Asada Burrito", description: "Flour tortilla, grilled steak, Mexican rice, pinto beans, pico de gallo, cheese, guacamole.", price: 16.00, imageUrl: IMAGES.sandwich },
          { name: "Carnitas Burrito", description: "Flour tortilla, slow-braised pork, rice, black beans, salsa verde, cheese, sour cream.", price: 15.00, imageUrl: IMAGES.sandwich },
          { name: "California Burrito", description: "Flour tortilla, carne asada, french fries, cheese, guacamole, sour cream, pico de gallo.", price: 17.00, imageUrl: IMAGES.sandwich },
          { name: "Pollo Asado Bowl", description: "Grilled chicken served over rice, black beans, lettuce, corn salsa, cheese, and avocado.", price: 14.00, imageUrl: IMAGES.salad },
          { name: "Veggie Burrito", description: "Flour tortilla, grilled fajita veggies, rice, black beans, guacamole, pico de gallo.", price: 13.00, imageUrl: IMAGES.sandwich }
        ]
      },
      {
        name: "Especialidades (Mains)",
        items: [
          { name: "Enchiladas Verdes", description: "Three chicken enchiladas topped with tangy tomatillo sauce, melted cheese, crema. Served with rice and beans.", price: 18.00, imageUrl: IMAGES.taco },
          { name: "Steak Fajitas", description: "Sizzling marinated skirt steak, grilled peppers and onions. Served with rice, beans, guacamole, sour cream, tortillas.", price: 24.00, imageUrl: IMAGES.steak },
          { name: "Chicken Fajitas", description: "Sizzling marinated chicken breast, grilled peppers and onions. Served with rice, beans, guacamole, sour cream, tortillas.", price: 20.00, imageUrl: IMAGES.chicken },
          { name: "Chile Relleno", description: "Poblano pepper stuffed with Oaxaca cheese, battered and fried, topped with ranchero sauce. Served with rice and beans.", price: 19.00, imageUrl: IMAGES.taco },
          { name: "Carne Asada Plate", description: "Thinly sliced marinated skirt steak, grilled scallions, jalapeño. Served with rice, beans, tortillas.", price: 26.00, imageUrl: IMAGES.steak }
        ]
      },
      {
        name: "Postres (Desserts)",
        items: [
          { name: "Churros", description: "Crispy fried dough dusted in cinnamon sugar, served with chocolate and caramel dipping sauces.", price: 8.00, imageUrl: IMAGES.dessert },
          { name: "Tres Leches Cake", description: "Traditional sponge cake soaked in three kinds of milk, topped with whipped cream.", price: 9.00, imageUrl: IMAGES.dessert },
          { name: "Flan", description: "Classic vanilla custard topped with rich caramel sauce.", price: 7.00, imageUrl: IMAGES.dessert }
        ]
      },
      {
        name: "Margaritas & Bebidas",
        items: [
          { name: "House Margarita", description: "Blanco tequila, triple sec, fresh lime, agave. Rocks or frozen.", price: 10.00, imageUrl: IMAGES.cocktail },
          { name: "Spicy Jalapeño Margarita", description: "Jalapeño-infused tequila, lime, agave, tajin rim.", price: 12.00, imageUrl: IMAGES.cocktail },
          { name: "Cadillac Margarita", description: "Reposado tequila, Grand Marnier float, fresh lime, agave.", price: 14.00, imageUrl: IMAGES.cocktail },
          { name: "Paloma", description: "Tequila, fresh grapefruit juice, lime, grapefruit soda.", price: 11.00, imageUrl: IMAGES.cocktail },
          { name: "Horchata", description: "Sweet traditional rice milk beverage with cinnamon.", price: 4.00, imageUrl: IMAGES.coffee },
          { name: "Agua de Jamaica", description: "Sweetened iced hibiscus tea.", price: 4.00, imageUrl: IMAGES.coffee },
          { name: "Mexican Coke", description: "Made with cane sugar, served in a glass bottle.", price: 4.00, imageUrl: IMAGES.coffee }
        ]
      }
    ]
  },
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
    id: "bakery",
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
