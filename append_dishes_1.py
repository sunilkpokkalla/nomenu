import json

french_dishes = [
    # Starters (10)
    {"name": "Soupe à l'Oignon Gratinée", "category": "Starters", "cuisines": ["french", "bistro"], "description": "Classic French onion soup topped with a toasted baguette slice and melted Gruyère cheese.", "suggestedCookingTime": 20},
    {"name": "Escargots de Bourgogne", "category": "Starters", "cuisines": ["french", "bistro", "fine dining"], "description": "Snail delicacy baked in its shell with a rich, fragrant garlic and parsley butter.", "suggestedCookingTime": 15},
    {"name": "Pâté de Campagne", "category": "Starters", "cuisines": ["french", "bistro"], "description": "Rustic pork and liver pâté served with cornichons, Dijon mustard, and toasted sourdough.", "suggestedCookingTime": 0},
    {"name": "Gougères", "category": "Starters", "cuisines": ["french"], "description": "Warm, savory choux pastry puffs baked with aged Comté cheese.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Tartare de Bœuf", "category": "Starters", "cuisines": ["french", "bistro"], "description": "Hand-chopped raw beef tenderloin seasoned with capers, shallots, egg yolk, and Dijon mustard.", "suggestedCookingTime": 10},
    {"name": "Foie Gras Poêlé", "category": "Starters", "cuisines": ["french", "fine dining"], "description": "Seared duck liver served with a sweet fig compote and toasted brioche.", "suggestedCookingTime": 10},
    {"name": "Salade Lyonnaise", "category": "Starters", "cuisines": ["french", "bistro"], "description": "Frisée lettuce tossed with warm bacon lardons, croutons, and topped with a poached egg.", "suggestedCookingTime": 15},
    {"name": "Bisque de Homard", "category": "Starters", "cuisines": ["french", "fine dining"], "description": "A velvety, rich lobster soup infused with cognac and fresh cream.", "suggestedCookingTime": 25},
    {"name": "Camembert Rôti", "category": "Starters", "cuisines": ["french", "bistro"], "description": "Whole roasted Camembert cheese infused with garlic and rosemary, served with crusty bread.", "isVegetarian": True, "suggestedCookingTime": 20},
    {"name": "Quiche Lorraine", "category": "Starters", "cuisines": ["french", "bistro", "cafe"], "description": "Classic savory tart filled with a rich egg custard, smoked bacon, and Gruyère cheese.", "suggestedCookingTime": 20},
    
    # Mains (20)
    {"name": "Coq au Vin", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "Tender chicken braised slowly in red Burgundy wine with mushrooms, pearl onions, and bacon.", "suggestedCookingTime": 45},
    {"name": "Bœuf Bourguignon", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "Classic beef stew simmered in red wine with carrots, onions, garlic, and a bouquet garni.", "suggestedCookingTime": 45},
    {"name": "Canard à l'Orange", "category": "Main Courses", "cuisines": ["french", "fine dining"], "description": "Crispy roasted duck breast dressed in a sweet and savory bitter-orange glaze.", "suggestedCookingTime": 35},
    {"name": "Bouillabaisse", "category": "Main Courses", "cuisines": ["french", "seafood"], "description": "Traditional Provençal fish stew heavily infused with saffron, fennel, and orange zest, served with rouille.", "suggestedCookingTime": 40},
    {"name": "Steak Frites", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "Pan-seared ribeye steak slathered in herb butter, served with a mountain of crispy golden frites.", "suggestedCookingTime": 20},
    {"name": "Ratatouille Niçoise", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "A vibrant, slow-stewed medley of eggplant, zucchini, bell peppers, tomatoes, and Herbes de Provence.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Cassoulet", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "Rich, slow-cooked casserole from the South of France featuring white beans, duck confit, and garlic sausage.", "suggestedCookingTime": 60},
    {"name": "Confit de Canard", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "Duck legs slow-cooked in their own fat until meltingly tender, then roasted until crisp.", "suggestedCookingTime": 30},
    {"name": "Blanquette de Veau", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "A classic, comforting veal ragout cooked in a rich, velvety white sauce with button mushrooms.", "suggestedCookingTime": 45},
    {"name": "Sole Meunière", "category": "Main Courses", "cuisines": ["french", "fine dining"], "description": "Delicate whole Dover sole pan-fried in brown butter, lemon, and fresh parsley.", "suggestedCookingTime": 25},
    {"name": "Poulet Rôti", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "Half a chicken beautifully roasted with lemon, garlic, and thyme, served with buttered green beans.", "suggestedCookingTime": 40},
    {"name": "Magret de Canard", "category": "Main Courses", "cuisines": ["french", "fine dining"], "description": "Pan-seared duck breast served pink, paired with a rich cherry reduction.", "suggestedCookingTime": 25},
    {"name": "Châteaubriand", "category": "Main Courses", "cuisines": ["french", "fine dining"], "description": "A thick, center-cut beef tenderloin roasted to perfection, served with Béarnaise sauce.", "suggestedCookingTime": 40},
    {"name": "Moules Marinières", "category": "Main Courses", "cuisines": ["french", "bistro", "seafood"], "description": "Fresh mussels steamed in white wine, garlic, shallots, and parsley, served with crusty baguette.", "suggestedCookingTime": 15},
    {"name": "Hachis Parmentier", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "The elegant French cousin to Shepherd's Pie, made with slow-braised beef topped with creamy mashed potatoes.", "suggestedCookingTime": 30},
    {"name": "Filet Mignon au Poivre", "category": "Main Courses", "cuisines": ["french", "fine dining"], "description": "Tender beef filet encrusted with cracked black peppercorns and bathed in a creamy cognac sauce.", "isSpicy": True, "suggestedCookingTime": 25},
    {"name": "Navarin d'Agneau", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "A delicate spring lamb stew simmered with baby turnips, carrots, and peas.", "suggestedCookingTime": 50},
    {"name": "Gratin Dauphinois", "category": "Main Courses", "cuisines": ["french", "bistro"], "description": "Thinly sliced potatoes slow-baked in heavy cream, garlic, and nutmeg.", "isVegetarian": True, "suggestedCookingTime": 45},
    {"name": "Salade Niçoise", "category": "Main Courses", "cuisines": ["french", "cafe"], "description": "Composed salad with seared tuna, green beans, hard-boiled eggs, tomatoes, olives, and anchovies.", "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Croque Monsieur", "category": "Main Courses", "cuisines": ["french", "cafe", "bistro"], "description": "The ultimate toasted ham and Gruyère cheese sandwich, smothered in rich Béchamel sauce.", "suggestedCookingTime": 15},
    
    # Sides (10)
    {"name": "Pommes Purée", "category": "Sides", "cuisines": ["french"], "description": "Incredibly smooth and rich mashed potatoes made with an obscene amount of butter.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Haricots Verts Amandine", "category": "Sides", "cuisines": ["french"], "description": "Crisp-tender French green beans sautéed in butter with toasted almonds.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Pommes Frites", "category": "Sides", "cuisines": ["french", "bistro"], "description": "Classic double-fried potatoes, crispy on the outside and fluffy inside, served with aioli.", "isVegetarian": True, "isVegan": True, "suggestedCookingTime": 15},
    {"name": "Gratin de Macaronis", "category": "Sides", "cuisines": ["french", "bistro"], "description": "French-style baked macaroni with Gruyère, Emmental, and a touch of nutmeg.", "isVegetarian": True, "suggestedCookingTime": 25},
    {"name": "Champignons Sauvages", "category": "Sides", "cuisines": ["french", "fine dining"], "description": "Wild mushrooms pan-roasted with garlic, shallots, and fresh herbs.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Asperges Sauce Hollandaise", "category": "Sides", "cuisines": ["french", "fine dining"], "description": "Steamed white asparagus spears draped in a rich, buttery hollandaise sauce.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Pommes Anna", "category": "Sides", "cuisines": ["french", "fine dining"], "description": "Thinly sliced potatoes baked in clarified butter until crisp and golden.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 40},
    {"name": "Petits Pois à la Française", "category": "Sides", "cuisines": ["french"], "description": "Spring peas gently braised with pearl onions, lettuce, and butter.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Salade Verte", "category": "Sides", "cuisines": ["french", "bistro"], "description": "Simple mixed green salad dressed perfectly with a classic Dijon vinaigrette.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Tomates à la Provençale", "category": "Sides", "cuisines": ["french"], "description": "Halved tomatoes roasted with a crust of garlic, parsley, and breadcrumbs.", "isVegetarian": True, "suggestedCookingTime": 20},
    
    # Desserts (10)
    {"name": "Crème Brûlée", "category": "Desserts", "cuisines": ["french", "bistro"], "description": "Rich vanilla bean custard topped with a contrasting layer of hard, caramelized sugar.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Tarte Tatin", "category": "Desserts", "cuisines": ["french", "bistro", "bakery"], "description": "Classic upside-down apple tart with deep caramel notes, served warm with crème fraîche.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Mousse au Chocolat", "category": "Desserts", "cuisines": ["french", "bistro"], "description": "Incredibly airy and intense dark chocolate mousse topped with cocoa shavings.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Profiteroles", "category": "Desserts", "cuisines": ["french", "bistro"], "description": "Choux pastry puffs filled with vanilla ice cream and drenched in warm chocolate sauce.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Île Flottante", "category": "Desserts", "cuisines": ["french", "fine dining"], "description": "A light poached meringue 'island' floating on a sea of vanilla crème anglaise, topped with spun caramel.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Soufflé au Grand Marnier", "category": "Desserts", "cuisines": ["french", "fine dining"], "description": "A towering, delicate soufflé infused with orange liqueur, served immediately upon baking.", "isVegetarian": True, "suggestedCookingTime": 20},
    {"name": "Mille-Feuille", "category": "Desserts", "cuisines": ["french", "bakery"], "description": "Three layers of crisp puff pastry alternating with rich vanilla pastry cream.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Macarons Assortis", "category": "Desserts", "cuisines": ["french", "bakery"], "description": "A selection of delicate almond meringue cookies with diverse buttercream and ganache fillings.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Tarte au Citron Meringuée", "category": "Desserts", "cuisines": ["french", "bistro", "bakery"], "description": "A sharp, tangy lemon curd tart crowned with fluffy, toasted meringue.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Éclair au Chocolat", "category": "Desserts", "cuisines": ["french", "bakery"], "description": "Oblong choux pastry filled with chocolate custard and topped with glossy chocolate icing.", "isVegetarian": True, "suggestedCookingTime": 0}
]

italian_dishes = [
    # Starters (10)
    {"name": "Bruschetta al Pomodoro", "category": "Starters", "cuisines": ["italian", "bistro"], "description": "Grilled rustic bread rubbed with garlic and topped with fresh tomatoes, basil, and extra virgin olive oil.", "isVegan": True, "suggestedCookingTime": 10},
    {"name": "Burrata e Prosciutto", "category": "Starters", "cuisines": ["italian", "fine dining"], "description": "Creamy heart burrata served with thinly sliced Prosciutto di Parma and a balsamic glaze.", "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Arancini al Ragù", "category": "Starters", "cuisines": ["italian", "street food"], "description": "Crispy, golden-fried risotto balls stuffed with a rich beef ragù and mozzarella center.", "suggestedCookingTime": 15},
    {"name": "Calamari Fritti", "category": "Starters", "cuisines": ["italian", "seafood"], "description": "Lightly dusted, crispy fried squid rings served with a side of zesty marinara sauce and lemon.", "suggestedCookingTime": 15},
    {"name": "Carpaccio di Manzo", "category": "Starters", "cuisines": ["italian", "fine dining"], "description": "Paper-thin slices of raw beef tenderloin drizzled with olive oil, lemon, and shaved Parmesan.", "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Insalata Caprese", "category": "Starters", "cuisines": ["italian", "bistro"], "description": "Fresh buffalo mozzarella, ripe vine tomatoes, and basil leaves dressed with premium olive oil.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Polpette della Nonna", "category": "Starters", "cuisines": ["italian", "bistro"], "description": "Classic Italian meatballs simmered in a slow-cooked tomato sauce, served with toasted focaccia.", "suggestedCookingTime": 20},
    {"name": "Fritto Misto", "category": "Starters", "cuisines": ["italian", "seafood"], "description": "A crispy mix of lightly fried seafood and vegetables, perfectly seasoned with sea salt.", "suggestedCookingTime": 15},
    {"name": "Melanzane alla Parmigiana", "category": "Starters", "cuisines": ["italian", "bistro"], "description": "Baked layers of thinly sliced eggplant, mozzarella, parmesan, and rich tomato sauce.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Zuppa Toscana", "category": "Starters", "cuisines": ["italian"], "description": "Hearty Tuscan soup loaded with spicy Italian sausage, kale, and potatoes in a creamy broth.", "isSpicy": True, "suggestedCookingTime": 15},

    # Mains (20)
    {"name": "Spaghetti Carbonara", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Authentic Roman pasta dish with guanciale, pecorino romano, egg yolks, and heavy black pepper.", "suggestedCookingTime": 20},
    {"name": "Lasagna al Forno", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Oven-baked layers of fresh pasta, rich Bolognese ragù, velvety béchamel, and parmesan.", "suggestedCookingTime": 35},
    {"name": "Risotto ai Funghi Porcini", "category": "Main Courses", "cuisines": ["italian", "fine dining"], "description": "Creamy Arborio rice slowly simmered with earthy porcini mushrooms, white wine, and parmesan.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Ossobuco alla Milanese", "category": "Main Courses", "cuisines": ["italian", "fine dining"], "description": "Slow-braised veal shanks with vegetables, white wine, and broth, finished with vibrant gremolata.", "isGlutenFree": True, "suggestedCookingTime": 60},
    {"name": "Pizza Margherita", "category": "Main Courses", "cuisines": ["italian", "pizza"], "description": "Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala, and basil.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Tagliatelle al Ragù Bolognese", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Ribbons of egg pasta tossed in a slow-cooked, rich meat sauce from Bologna.", "suggestedCookingTime": 25},
    {"name": "Cacio e Pepe", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "A minimalist Roman masterpiece: spaghetti coated in a creamy emulsion of Pecorino Romano and toasted black pepper.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Saltimbocca alla Romana", "category": "Main Courses", "cuisines": ["italian", "fine dining"], "description": "Pan-fried veal medallions wrapped in prosciutto and sage, glazed with a white wine sauce.", "suggestedCookingTime": 20},
    {"name": "Bistecca alla Fiorentina", "category": "Main Courses", "cuisines": ["italian", "fine dining"], "description": "Massive, thick-cut T-bone steak grilled rare over wood fire, simply dressed with olive oil and coarse salt.", "isGlutenFree": True, "suggestedCookingTime": 35},
    {"name": "Linguine alle Vongole", "category": "Main Courses", "cuisines": ["italian", "seafood"], "description": "Linguine tossed with fresh clams, white wine, garlic, parsley, and a touch of chili flakes.", "suggestedCookingTime": 20},
    {"name": "Ravioli Ricotta e Spinaci", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Handmade pasta parcels filled with ricotta and spinach, served in a sage-infused brown butter sauce.", "isVegetarian": True, "suggestedCookingTime": 20},
    {"name": "Pizza Diavola", "category": "Main Courses", "cuisines": ["italian", "pizza"], "description": "Wood-fired pizza topped with tomato sauce, mozzarella, and spicy Calabrian salami.", "isSpicy": True, "suggestedCookingTime": 10},
    {"name": "Gnocchi al Pesto Genovese", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Pillowy potato dumplings coated in a vibrant, fresh basil and pine nut pesto.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Pappardelle al Cinghiale", "category": "Main Courses", "cuisines": ["italian", "fine dining"], "description": "Wide pasta ribbons served with a robust, slow-braised wild boar ragù.", "suggestedCookingTime": 25},
    {"name": "Pollo alla Cacciatora", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Rustic 'hunter-style' chicken braised with tomatoes, onions, herbs, and red wine.", "isGlutenFree": True, "suggestedCookingTime": 40},
    {"name": "Spaghetti all'Amatriciana", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Pasta tossed in a zesty tomato sauce fortified with crispy guanciale and chili flakes.", "isSpicy": True, "suggestedCookingTime": 20},
    {"name": "Fritto Misto di Pesce", "category": "Main Courses", "cuisines": ["italian", "seafood"], "description": "A generous platter of assorted Mediterranean seafood, lightly battered and fried.", "suggestedCookingTime": 20},
    {"name": "Orecchiette con Cime di Rapa", "category": "Main Courses", "cuisines": ["italian", "bistro"], "description": "Little 'ear-shaped' pasta tossed with bitter broccoli rabe, garlic, and anchovies.", "suggestedCookingTime": 20},
    {"name": "Risotto alla Milanese", "category": "Main Courses", "cuisines": ["italian", "fine dining"], "description": "Golden, luxurious saffron-infused risotto, traditionally served alongside Ossobuco.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Pizza Quattro Formaggi", "category": "Main Courses", "cuisines": ["italian", "pizza"], "description": "White pizza featuring a rich blend of Mozzarella, Gorgonzola, Fontina, and Parmigiano-Reggiano.", "isVegetarian": True, "suggestedCookingTime": 10},

    # Sides (10)
    {"name": "Focaccia al Rosmarino", "category": "Sides", "cuisines": ["italian", "bakery"], "description": "Oven-baked flatbread infused with olive oil, sea salt, and fresh rosemary sprigs.", "isVegan": True, "suggestedCookingTime": 10},
    {"name": "Broccoletti Saltati", "category": "Sides", "cuisines": ["italian"], "description": "Sautéed broccoli rabe with garlic, olive oil, and a pinch of red chili flakes.", "isVegan": True, "isGlutenFree": True, "isSpicy": True, "suggestedCookingTime": 15},
    {"name": "Patate Arrosto", "category": "Sides", "cuisines": ["italian"], "description": "Crispy roasted potatoes tossed with garlic and rosemary.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Polenta Morbida", "category": "Sides", "cuisines": ["italian"], "description": "Creamy, slow-cooked cornmeal enriched with butter and parmesan cheese.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Insalata Mista", "category": "Sides", "cuisines": ["italian", "bistro"], "description": "A simple mixed green salad dressed lightly with balsamic vinaigrette.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Carciofi alla Romana", "category": "Sides", "cuisines": ["italian"], "description": "Tender artichokes slowly braised with garlic, mint, and parsley.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Verdure Grigliate", "category": "Sides", "cuisines": ["italian"], "description": "A colorful medley of grilled zucchini, eggplant, and bell peppers drizzled with balsamic glaze.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Pane all'Aglio", "category": "Sides", "cuisines": ["italian"], "description": "Warm, crusty Italian bread generously slathered in garlic herb butter.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Spinaci al Limone", "category": "Sides", "cuisines": ["italian"], "description": "Fresh spinach wilted in olive oil and finished with a squeeze of fresh lemon.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Caponata Siciliana", "category": "Sides", "cuisines": ["italian"], "description": "A sweet and sour Sicilian eggplant relish with capers, celery, and pine nuts.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 20},

    # Desserts (10)
    {"name": "Tiramisù", "category": "Desserts", "cuisines": ["italian", "bistro"], "description": "Classic layered dessert of espresso-soaked ladyfingers, velvety mascarpone cream, and cocoa powder.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Panna Cotta", "category": "Desserts", "cuisines": ["italian", "fine dining"], "description": "Silky vanilla cream gelatin set and served with a vibrant mixed berry compote.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Cannoli Siciliani", "category": "Desserts", "cuisines": ["italian", "bakery"], "description": "Crispy pastry tubes filled with sweet, creamy ricotta and chocolate chips.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Gelato Artigianale", "category": "Desserts", "cuisines": ["italian", "cafe"], "description": "A selection of authentic, slow-churned Italian ice cream (ask for today's flavors).", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Affogato al Caffè", "category": "Desserts", "cuisines": ["italian", "cafe"], "description": "A scoop of rich vanilla gelato 'drowned' in a shot of hot, fresh espresso.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Zabaione", "category": "Desserts", "cuisines": ["italian", "fine dining"], "description": "A warm, frothy custard made from egg yolks, sugar, and Marsala wine.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Torta della Nonna", "category": "Desserts", "cuisines": ["italian", "bakery"], "description": "Grandmother's tart: a shortcrust pastry filled with lemon custard and topped with pine nuts.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Biscotti Cantuccini", "category": "Desserts", "cuisines": ["italian", "bakery"], "description": "Twice-baked, crunchy almond biscuits, traditionally served with sweet Vin Santo wine.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Profiteroles al Cioccolato", "category": "Desserts", "cuisines": ["italian", "bistro"], "description": "Choux pastry puffs generously filled with chantilly cream and smothered in dark chocolate.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Zeppole", "category": "Desserts", "cuisines": ["italian", "bakery", "street food"], "description": "Deep-fried dough balls generously dusted with powdered sugar, crispy outside, fluffy inside.", "isVegetarian": True, "suggestedCookingTime": 10}
]

def append_to_file():
    with open("src/lib/global-dish-library.ts", "a") as f:
        for dish in french_dishes + italian_dishes:
            f.write(f"  {json.dumps(dish)},\n")

if __name__ == "__main__":
    append_to_file()
