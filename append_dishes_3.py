import json

indian_dishes = [
    # Starters (10)
    {"name": "Samosa", "category": "Starters", "cuisines": ["indian", "street food"], "description": "Crispy, golden pastry pyramids stuffed with spiced potatoes and peas.", "isVegetarian": True, "isVegan": True, "suggestedCookingTime": 15},
    {"name": "Onion Bhaji", "category": "Starters", "cuisines": ["indian", "street food"], "description": "Finely sliced onions spiced, coated in chickpea flour, and deep-fried to a crisp.", "isVegetarian": True, "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Chicken Tikka", "category": "Starters", "cuisines": ["indian", "tandoori"], "description": "Tender chicken chunks marinated in yogurt and spices, grilled in a tandoor oven.", "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Paneer Tikka", "category": "Starters", "cuisines": ["indian", "tandoori"], "description": "Cubes of fresh Indian cottage cheese marinated in spices and grilled with bell peppers.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Aloo Tikki", "category": "Starters", "cuisines": ["indian", "street food"], "description": "Spiced, crisp potato patties served with tangy tamarind and green mint chutneys.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Pani Puri", "category": "Starters", "cuisines": ["indian", "street food"], "description": "Hollow, crispy puri shells filled with a mixture of flavored water, tamarind chutney, chili, chaat masala, potato, and chickpeas.", "isVegetarian": True, "isVegan": True, "isSpicy": True, "suggestedCookingTime": 10},
    {"name": "Seekh Kebab", "category": "Starters", "cuisines": ["indian", "tandoori"], "description": "Minced lamb mixed with fresh herbs and spices, skewered and roasted in the tandoor.", "isGlutenFree": True, "isSpicy": True, "suggestedCookingTime": 20},
    {"name": "Gobi Manchurian", "category": "Starters", "cuisines": ["indian", "street food"], "description": "Crispy cauliflower florets tossed in a sweet, spicy, and tangy Indo-Chinese sauce.", "isVegetarian": True, "isSpicy": True, "suggestedCookingTime": 15},
    {"name": "Papdi Chaat", "category": "Starters", "cuisines": ["indian", "street food"], "description": "Crisp fried dough wafers topped with potatoes, chickpeas, yogurt, chutneys, and spices.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Fish Amritsari", "category": "Starters", "cuisines": ["indian", "seafood"], "description": "North Indian style deep-fried fish coated in a spicy gram flour batter.", "isSpicy": True, "suggestedCookingTime": 15},

    # Mains (20)
    {"name": "Butter Chicken (Murgh Makhani)", "category": "Main Courses", "cuisines": ["indian"], "description": "Tandoori chicken simmered in a mildly spiced, velvety tomato and butter gravy.", "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Chicken Tikka Masala", "category": "Main Courses", "cuisines": ["indian", "bistro"], "description": "Roasted chunks of chicken in a vibrant, spiced, creamy orange curry sauce.", "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Lamb Rogan Josh", "category": "Main Courses", "cuisines": ["indian"], "description": "A robust, aromatic Kashmiri curry featuring tender pieces of lamb braised in a gravy flavored with garlic, ginger, and aromatic spices.", "isGlutenFree": True, "suggestedCookingTime": 60},
    {"name": "Palak Paneer", "category": "Main Courses", "cuisines": ["indian"], "description": "Cubes of soft cottage cheese simmered in a smooth, vibrant spinach pureé spiced with garlic and garam masala.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Chana Masala", "category": "Main Courses", "cuisines": ["indian"], "description": "Hearty chickpeas slow-cooked in a tangy, spiced tomato and onion gravy.", "isVegetarian": True, "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Biryani (Chicken or Lamb)", "category": "Main Courses", "cuisines": ["indian"], "description": "A royal dish of fragrant basmati rice slow-cooked with meat, saffron, and a rich blend of spices.", "isGlutenFree": True, "suggestedCookingTime": 45},
    {"name": "Dal Makhani", "category": "Main Courses", "cuisines": ["indian"], "description": "Whole black lentils and kidney beans slow-cooked for hours with butter and cream for a rich, smoky flavor.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 60},
    {"name": "Aloo Gobi", "category": "Main Courses", "cuisines": ["indian"], "description": "A classic dry curry of potatoes and cauliflower florets spiced with turmeric and cumin.", "isVegetarian": True, "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Vindaloo", "category": "Main Courses", "cuisines": ["indian"], "description": "A notoriously fiery, tangy Goan curry made with pork or chicken, vinegar, and heavy chili.", "isSpicy": True, "isGlutenFree": True, "suggestedCookingTime": 40},
    {"name": "Saag Gosht", "category": "Main Courses", "cuisines": ["indian"], "description": "Tender chunks of lamb slow-cooked in a vibrant, mildly spiced spinach gravy.", "isGlutenFree": True, "suggestedCookingTime": 50},
    {"name": "Baingan Bharta", "category": "Main Courses", "cuisines": ["indian"], "description": "Smoky fire-roasted eggplant mashed and cooked with onions, tomatoes, and spices.", "isVegetarian": True, "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Malai Kofta", "category": "Main Courses", "cuisines": ["indian"], "description": "Melt-in-your-mouth potato and paneer dumplings served in a rich, creamy cashew-based sauce.", "isVegetarian": True, "suggestedCookingTime": 35},
    {"name": "Tandoori Chicken (Half/Full)", "category": "Main Courses", "cuisines": ["indian", "tandoori"], "description": "Bone-in chicken marinated in yogurt and a fiery red spice blend, roasted in a clay oven.", "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Korma", "category": "Main Courses", "cuisines": ["indian"], "description": "A rich, mild, and highly aromatic curry thickened with almonds, coconut, or cashews.", "isGlutenFree": True, "suggestedCookingTime": 35},
    {"name": "Fish Curry (Goan Style)", "category": "Main Courses", "cuisines": ["indian", "seafood"], "description": "Fresh fish simmered in a bright, tangy, coconut-milk based curry infused with tamarind and chili.", "isGlutenFree": True, "isSpicy": True, "suggestedCookingTime": 25},
    {"name": "Bhindi Masala", "category": "Main Courses", "cuisines": ["indian"], "description": "Fresh okra stir-fried with onions, tomatoes, and a dry spice blend.", "isVegetarian": True, "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Madras Curry", "category": "Main Courses", "cuisines": ["indian"], "description": "A fairly hot curry with a deep red, thick sauce made with heavy chili powder and tamarind.", "isSpicy": True, "isGlutenFree": True, "suggestedCookingTime": 40},
    {"name": "Prawn Balchão", "category": "Main Courses", "cuisines": ["indian", "seafood"], "description": "A fiery, pickled Goan prawn dish cooked in a spicy, tangy, dark red sauce.", "isSpicy": True, "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Matar Paneer", "category": "Main Courses", "cuisines": ["indian"], "description": "A classic North Indian curry of green peas and cottage cheese in a tomato-based sauce.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Keema Mutter", "category": "Main Courses", "cuisines": ["indian"], "description": "Minced lamb slow-cooked with green peas, onions, tomatoes, and aromatic spices.", "isGlutenFree": True, "suggestedCookingTime": 30},

    # Sides (10)
    {"name": "Garlic Naan", "category": "Sides", "cuisines": ["indian", "bakery"], "description": "Soft, pillowy Indian flatbread baked in a tandoor and brushed heavily with garlic butter.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Basmati Rice", "category": "Sides", "cuisines": ["indian"], "description": "Long-grain, incredibly fragrant steamed white rice.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Roti / Chapati", "category": "Sides", "cuisines": ["indian", "bakery"], "description": "Simple, unleavened whole wheat flatbread cooked on a hot griddle.", "isVegan": True, "suggestedCookingTime": 5},
    {"name": "Cucumber Raita", "category": "Sides", "cuisines": ["indian"], "description": "Cooling, lightly spiced yogurt mixed with grated cucumber and roasted cumin.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Peshawari Naan", "category": "Sides", "cuisines": ["indian", "bakery"], "description": "Sweet flatbread stuffed with a blend of dried fruits, coconut, and nuts.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Mango Chutney", "category": "Sides", "cuisines": ["indian"], "description": "A sweet, tangy, and slightly spicy condiment made from ripe mangoes.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Jeera Rice", "category": "Sides", "cuisines": ["indian"], "description": "Basmati rice pan-fried with ghee and toasted cumin seeds.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Pappadum", "category": "Sides", "cuisines": ["indian", "street food"], "description": "Thin, crisp, disc-shaped crackers made from lentil flour.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Kachumber Salad", "category": "Sides", "cuisines": ["indian"], "description": "A fresh chopped salad of cucumbers, onions, and tomatoes tossed with lemon juice and chaat masala.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Lacha Paratha", "category": "Sides", "cuisines": ["indian", "bakery"], "description": "A multi-layered, crispy, flaky whole wheat flatbread pan-fried with ghee.", "isVegetarian": True, "suggestedCookingTime": 15},

    # Desserts (10)
    {"name": "Gulab Jamun", "category": "Desserts", "cuisines": ["indian"], "description": "Soft, melt-in-the-mouth milk-solid dumplings soaked in a warm, rose-scented sugar syrup.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Rasgulla", "category": "Desserts", "cuisines": ["indian"], "description": "Spongy, light cottage cheese balls cooked in a light sugar syrup.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Mango Lassi", "category": "Desserts", "cuisines": ["indian", "cafe"], "description": "A thick, creamy, refreshing yogurt-based drink blended with sweet Alphonso mangoes.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Gajar Ka Halwa", "category": "Desserts", "cuisines": ["indian"], "description": "A rich, slow-cooked pudding made with grated carrots, milk, sugar, ghee, and nuts.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 45},
    {"name": "Kheer", "category": "Desserts", "cuisines": ["indian"], "description": "Traditional Indian rice pudding flavored with cardamom, saffron, and nuts.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Rasmalai", "category": "Desserts", "cuisines": ["indian"], "description": "Soft paneer discs soaked in chilled, creamy, cardamom-flavored milk.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Jalebi", "category": "Desserts", "cuisines": ["indian", "street food"], "description": "Crispy, deep-fried, spiral-shaped batter soaked in saffron sugar syrup.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Kulfi", "category": "Desserts", "cuisines": ["indian"], "description": "Traditional Indian ice cream—denser and creamier than Western ice cream, flavored with pistachio or mango.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Mysore Pak", "category": "Desserts", "cuisines": ["indian"], "description": "A rich, crumbly, melt-in-the-mouth sweet made generously with ghee, sugar, and gram flour.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Falooda", "category": "Desserts", "cuisines": ["indian", "street food"], "description": "A cold, layered dessert beverage with rose syrup, vermicelli, sweet basil seeds, and ice cream.", "isVegetarian": True, "suggestedCookingTime": 5}
]

spanish_dishes = [
    # Starters (10)
    {"name": "Patatas Bravas", "category": "Starters", "cuisines": ["spanish", "tapas"], "description": "Crispy, fried potato cubes served with a spicy, smoky tomato bravas sauce and creamy aioli.", "isVegetarian": True, "isGlutenFree": True, "isSpicy": True, "suggestedCookingTime": 15},
    {"name": "Gambas al Ajillo", "category": "Starters", "cuisines": ["spanish", "tapas", "seafood"], "description": "Sizzling shrimp cooked in extra virgin olive oil heavily infused with garlic and dried chili.", "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Pan con Tomate", "category": "Starters", "cuisines": ["spanish", "tapas"], "description": "Toasted rustic bread rubbed with raw garlic and ripe tomatoes, drizzled with olive oil and sea salt.", "isVegan": True, "suggestedCookingTime": 5},
    {"name": "Croquetas de Jamón", "category": "Starters", "cuisines": ["spanish", "tapas"], "description": "Crispy fried croquettes with an impossibly creamy, rich béchamel and cured ham filling.", "suggestedCookingTime": 15},
    {"name": "Jamón Ibérico de Bellota", "category": "Starters", "cuisines": ["spanish", "tapas", "fine dining"], "description": "Premium acorn-fed Iberian ham, sliced paper-thin, served at room temperature.", "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Tortilla Española", "category": "Starters", "cuisines": ["spanish", "tapas"], "description": "A thick, classic Spanish omelette made simply with eggs, potatoes, and onions slowly cooked in olive oil.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Pimientos de Padrón", "category": "Starters", "cuisines": ["spanish", "tapas"], "description": "Small green peppers blistered in olive oil and finished with coarse sea salt. Mostly mild, but some are spicy!", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Boquerones en Vinagre", "category": "Starters", "cuisines": ["spanish", "tapas", "seafood"], "description": "Fresh white anchovy fillets marinated in vinegar, olive oil, garlic, and parsley.", "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Chorizo a la Sidra", "category": "Starters", "cuisines": ["spanish", "tapas"], "description": "Spanish chorizo sausage slowly braised in hard apple cider until tender.", "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Pulpo a la Gallega", "category": "Starters", "cuisines": ["spanish", "tapas", "seafood"], "description": "Tender octopus slices dusted with smoked paprika and coarse sea salt, served over boiled potatoes.", "isGlutenFree": True, "suggestedCookingTime": 45},

    # Mains (20)
    {"name": "Paella Valenciana", "category": "Main Courses", "cuisines": ["spanish"], "description": "The authentic paella from Valencia, cooked with rabbit, chicken, butter beans, green beans, and saffron-infused rice.", "isGlutenFree": True, "suggestedCookingTime": 45},
    {"name": "Paella de Marisco", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "A stunning seafood paella packed with shrimp, mussels, clams, and calamari in a saffron broth.", "isGlutenFree": True, "suggestedCookingTime": 45},
    {"name": "Cochinillo Asado", "category": "Main Courses", "cuisines": ["spanish", "fine dining"], "description": "Segovian-style whole roasted suckling pig with incredibly crispy skin and tender, melt-in-the-mouth meat.", "isGlutenFree": True, "suggestedCookingTime": 180},
    {"name": "Rabo de Toro", "category": "Main Courses", "cuisines": ["spanish"], "description": "A rich, slow-braised oxtail stew simmered in red wine and vegetables until the meat falls off the bone.", "isGlutenFree": True, "suggestedCookingTime": 180},
    {"name": "Fabada Asturiana", "category": "Main Courses", "cuisines": ["spanish"], "description": "A hearty, warming white bean stew from Asturias, cooked with chorizo, morcilla (blood sausage), and pork belly.", "isGlutenFree": True, "suggestedCookingTime": 60},
    {"name": "Fideuà", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "A paella-like dish from Catalonia made with short noodles instead of rice, packed with seafood.", "suggestedCookingTime": 35},
    {"name": "Pollo al Ajillo", "category": "Main Courses", "cuisines": ["spanish"], "description": "Rustic, flavor-packed chicken braised with copious amounts of garlic, white wine, and bay leaves.", "isGlutenFree": True, "suggestedCookingTime": 40},
    {"name": "Bacalao a la Vizcaína", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "Salt cod simmered in a rich, slightly sweet Basque sauce made from red choricero peppers, onions, and tomatoes.", "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Secreto Ibérico", "category": "Main Courses", "cuisines": ["spanish", "fine dining"], "description": "A highly marbled, incredibly flavorful cut of Iberian pork grilled rapidly to preserve its juiciness.", "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Arroz Negro", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "A dramatic paella variation colored pitch black with squid ink, featuring cuttlefish and served with garlic aioli.", "isGlutenFree": True, "suggestedCookingTime": 40},
    {"name": "Merluza a la Vasca", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "Hake fish served in a Basque-style green sauce made with parsley, garlic, clams, and white wine.", "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Caldereta de Langosta", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "A luxurious lobster stew from Menorca, cooked with a tomato, pepper, and garlic sofrito.", "isGlutenFree": True, "suggestedCookingTime": 45},
    {"name": "Chuletón de Vaca Vieja", "category": "Main Courses", "cuisines": ["spanish", "fine dining"], "description": "A massive, dry-aged, bone-in ribeye steak from mature cows, grilled rare and sliced to share.", "isGlutenFree": True, "suggestedCookingTime": 30},
    {"name": "Callos a la Madrileña", "category": "Main Courses", "cuisines": ["spanish"], "description": "A traditional, gelatinous Madrid stew made with beef tripe, chorizo, and morcilla.", "isGlutenFree": True, "suggestedCookingTime": 120},
    {"name": "Zarzuela de Mariscos", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "A complex, tomato-based Catalan seafood stew heavily scented with almonds and saffron.", "isGlutenFree": True, "suggestedCookingTime": 50},
    {"name": "Pisto Manchego", "category": "Main Courses", "cuisines": ["spanish"], "description": "Spain's answer to ratatouille: a slow-cooked vegetable medley of tomatoes, peppers, zucchini, topped with a fried egg.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 35},
    {"name": "Marmitako", "category": "Main Courses", "cuisines": ["spanish", "seafood"], "description": "A hearty Basque tuna and potato stew flavored with sweet choricero peppers.", "isGlutenFree": True, "suggestedCookingTime": 40},
    {"name": "Cordero Asado", "category": "Main Courses", "cuisines": ["spanish", "fine dining"], "description": "Slow-roasted baby lamb leg, cooked simply with water, salt, and garlic until falling apart.", "isGlutenFree": True, "suggestedCookingTime": 120},
    {"name": "Lomo de Orza", "category": "Main Courses", "cuisines": ["spanish"], "description": "Pork loin preserved in olive oil and spices, served sliced with rustic bread.", "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Paella de Verduras", "category": "Main Courses", "cuisines": ["spanish"], "description": "A vibrant vegan paella utilizing the freshest seasonal vegetables, artichokes, and saffron.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 40},

    # Sides (10)
    {"name": "Alioli", "category": "Sides", "cuisines": ["spanish", "tapas"], "description": "A fiercely strong, emulsion of pure garlic and olive oil.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Aceitunas Aliñadas", "category": "Sides", "cuisines": ["spanish", "tapas"], "description": "House-marinated Spanish olives with citrus peel, fennel, and garlic.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Ensalada Mixta", "category": "Sides", "cuisines": ["spanish"], "description": "A large salad of lettuce, tomatoes, onions, hard-boiled eggs, and high-quality canned tuna.", "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Patatas a lo Pobre", "category": "Sides", "cuisines": ["spanish"], "description": "'Poor man's potatoes' slow-fried with green peppers, onions, and garlic.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 25},
    {"name": "Escalivada", "category": "Sides", "cuisines": ["spanish"], "description": "Catalan roasted vegetables (eggplant, red peppers, onions) peeled, torn into strips, and dressed with olive oil.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 45},
    {"name": "Pan Rústico", "category": "Sides", "cuisines": ["spanish", "bakery"], "description": "A basket of crusty, rustic sourdough bread, perfect for mopping up sauces.", "isVegan": True, "suggestedCookingTime": 0},
    {"name": "Queso Manchego", "category": "Sides", "cuisines": ["spanish", "tapas"], "description": "A wedge of aged sheep's milk cheese from La Mancha.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Garbanzos Fritos", "category": "Sides", "cuisines": ["spanish", "tapas"], "description": "Crispy fried chickpeas dusted with smoked paprika and sea salt.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Champiñones al Ajillo", "category": "Sides", "cuisines": ["spanish", "tapas"], "description": "Button mushrooms sautéed aggressively with garlic, parsley, and dry sherry.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Espinacas con Garbanzos", "category": "Sides", "cuisines": ["spanish", "tapas"], "description": "A Moorish-influenced Sevillian dish of spinach and chickpeas cooked with cumin and smoked paprika.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 20},

    # Desserts (10)
    {"name": "Crema Catalana", "category": "Desserts", "cuisines": ["spanish", "bistro"], "description": "Spain's version of crème brûlée, flavored with cinnamon and lemon zest.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Churros con Chocolate", "category": "Desserts", "cuisines": ["spanish", "street food", "cafe"], "description": "Crispy fried dough loops served alongside a cup of thick, dark, pudding-like hot chocolate.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Tarta de Santiago", "category": "Desserts", "cuisines": ["spanish", "bakery"], "description": "A traditional Galician almond cake lightly scented with lemon and dusted with powdered sugar.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Flan de Huevo", "category": "Desserts", "cuisines": ["spanish"], "description": "The classic, dense Spanish egg custard baked with a pool of clear caramel.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Basque Cheesecake (Tarta de Queso)", "category": "Desserts", "cuisines": ["spanish", "fine dining", "bakery"], "description": "A crustless cheesecake baked at a high temperature to create a burnt exterior and a gooey, molten center.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Torrijas", "category": "Desserts", "cuisines": ["spanish", "bakery"], "description": "Spanish-style French toast, soaked in honey or milk, fried in olive oil, and dusted with cinnamon.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Polvorones", "category": "Desserts", "cuisines": ["spanish", "bakery"], "description": "Incredibly crumbly, rich shortbread cookies made with almonds and toasted flour.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Leche Frita", "category": "Desserts", "cuisines": ["spanish", "cafe"], "description": "'Fried milk'—a firm milk pudding that is breaded, fried crisp, and rolled in cinnamon sugar.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Ensaimada", "category": "Desserts", "cuisines": ["spanish", "bakery"], "description": "A sweet, spiral pastry from Mallorca, dusted heavily with powdered sugar.", "isVegetarian": True, "suggestedCookingTime": 0},
    {"name": "Turrón", "category": "Desserts", "cuisines": ["spanish"], "description": "Slices of premium Spanish nougat made from almonds and honey (hard or soft varieties available).", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 0}
]

breakfast_dishes = [
    # generic breakfast items
    {"name": "Avocado Toast", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "Thick-cut artisanal sourdough topped with smashed avocado, chili flakes, and a squeeze of lemon.", "isVegan": True, "suggestedCookingTime": 5},
    {"name": "Eggs Benedict", "category": "Breakfast", "cuisines": ["breakfast", "bistro"], "description": "Two poached eggs and Canadian bacon on toasted English muffins, draped in rich hollandaise sauce.", "suggestedCookingTime": 15},
    {"name": "Buttermilk Pancakes", "category": "Breakfast", "cuisines": ["breakfast", "diner"], "description": "A stack of three fluffy pancakes served with whipped butter and pure maple syrup.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "French Toast", "category": "Breakfast", "cuisines": ["breakfast", "bistro"], "description": "Thick slices of brioche dipped in vanilla-cinnamon custard and griddled golden brown.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Full English Breakfast", "category": "Breakfast", "cuisines": ["breakfast", "pub"], "description": "A hearty plate of eggs, bacon, sausage, baked beans, grilled tomatoes, mushrooms, and toast.", "suggestedCookingTime": 20},
    {"name": "Breakfast Burrito", "category": "Breakfast", "cuisines": ["breakfast", "mexican"], "description": "A large flour tortilla wrapped around scrambled eggs, chorizo, potatoes, and cheddar cheese.", "suggestedCookingTime": 15},
    {"name": "Açaí Bowl", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "Blended açaí berries topped with granola, fresh strawberries, bananas, coconut flakes, and chia seeds.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Smoked Salmon Bagel", "category": "Breakfast", "cuisines": ["breakfast", "bakery"], "description": "A toasted everything bagel smeared with cream cheese, topped with lox, capers, red onions, and dill.", "suggestedCookingTime": 5},
    {"name": "Oatmeal with Fresh Berries", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "Steel-cut oats cooked to perfection, topped with mixed berries, honey, and toasted almonds.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Breakfast Sandwich", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "A fried egg, melted cheddar, and crispy bacon served on a freshly baked brioche bun.", "suggestedCookingTime": 10},
    {"name": "Shakshuka", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "Eggs gently poached in a simmering, spiced sauce of tomatoes, bell peppers, and onions.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 20},
    {"name": "Croissant Sandwich", "category": "Breakfast", "cuisines": ["breakfast", "bakery"], "description": "A buttery, flaky croissant filled with thinly sliced ham and melted Gruyère cheese.", "suggestedCookingTime": 10},
    {"name": "Belgian Waffle", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "A deep-pocketed, crispy waffle served with a dusting of powdered sugar and fresh strawberries.", "isVegetarian": True, "suggestedCookingTime": 15},
    {"name": "Huevos Rancheros", "category": "Breakfast", "cuisines": ["breakfast", "mexican"], "description": "Fried eggs served on lightly fried corn tortillas, smothered in a warm tomato-chili salsa.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Greek Yogurt Parfait", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "Layers of thick Greek yogurt, mixed berry compote, and crunchy honey-oat granola.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Steak and Eggs", "category": "Breakfast", "cuisines": ["breakfast", "diner"], "description": "A tender 8oz sirloin steak cooked to order, served with two eggs any style and hash browns.", "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Corned Beef Hash", "category": "Breakfast", "cuisines": ["breakfast", "diner"], "description": "Crispy pan-fried potatoes mixed with savory corned beef and onions, topped with two poached eggs.", "suggestedCookingTime": 15},
    {"name": "Mushroom & Swiss Omelette", "category": "Breakfast", "cuisines": ["breakfast", "diner"], "description": "A fluffy three-egg omelette filled with sautéed mushrooms and melted Swiss cheese.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 10},
    {"name": "Chilaquiles", "category": "Breakfast", "cuisines": ["breakfast", "mexican"], "description": "Crispy corn tortillas simmered in salsa verde, topped with a fried egg, crema, and queso fresco.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 15},
    {"name": "Chia Seed Pudding", "category": "Breakfast", "cuisines": ["breakfast", "cafe"], "description": "Chia seeds soaked overnight in almond milk, topped with mango puree and coconut flakes.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0}
]

drinks_dishes = [
    # generic drinks
    {"name": "Classic Margarita", "category": "Beverages", "cuisines": ["drinks", "mexican", "bar"], "description": "Tequila blanco, fresh lime juice, and Cointreau, served over ice with a salted rim.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Old Fashioned", "category": "Beverages", "cuisines": ["drinks", "bar"], "description": "Bourbon whiskey stirred gently with sugar, Angostura bitters, and an orange twist.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Mojito", "category": "Beverages", "cuisines": ["drinks", "bar"], "description": "A refreshing blend of white rum, fresh mint leaves, lime juice, sugar, and a splash of soda water.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Aperol Spritz", "category": "Beverages", "cuisines": ["drinks", "italian", "bar"], "description": "Aperol, Prosecco, and a splash of soda, garnished with an orange slice. The perfect summer aperitif.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Espresso Martini", "category": "Beverages", "cuisines": ["drinks", "bar", "cafe"], "description": "A sophisticated, caffeinated cocktail made with vodka, coffee liqueur, and a shot of fresh espresso.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Fresh Squeezed Orange Juice", "category": "Beverages", "cuisines": ["drinks", "breakfast"], "description": "100% pure, cold-pressed Valencia oranges.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Cappuccino", "category": "Beverages", "cuisines": ["drinks", "cafe", "breakfast"], "description": "A single shot of espresso topped with equal parts steamed milk and dense milk foam.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Iced Latte", "category": "Beverages", "cuisines": ["drinks", "cafe"], "description": "Espresso and chilled milk poured over ice.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Matcha Latte", "category": "Beverages", "cuisines": ["drinks", "cafe", "japanese"], "description": "Premium stone-ground green tea whisked with steamed milk.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Strawberry Banana Smoothie", "category": "Beverages", "cuisines": ["drinks", "cafe"], "description": "Fresh strawberries, banana, and a splash of apple juice blended with ice.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Craft IPA", "category": "Beverages", "cuisines": ["drinks", "bar"], "description": "A pint of locally brewed, intensely hoppy India Pale Ale.", "isVegan": True, "suggestedCookingTime": 0},
    {"name": "Pino Grigio (Glass)", "category": "Beverages", "cuisines": ["drinks", "bar"], "description": "A crisp, dry white wine with notes of green apple and citrus.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Cabernet Sauvignon (Glass)", "category": "Beverages", "cuisines": ["drinks", "bar"], "description": "A full-bodied red wine with dark fruit flavors and a hint of oak.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Sangria Tinto", "category": "Beverages", "cuisines": ["drinks", "spanish"], "description": "A traditional Spanish punch made with red wine, chopped fruit, brandy, and a splash of orange juice.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Diet Cola", "category": "Beverages", "cuisines": ["drinks", "fast food"], "description": "Classic zero-calorie cola served over ice.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Sparkling Water", "category": "Beverages", "cuisines": ["drinks"], "description": "Premium carbonated mineral water, served with a lime wedge.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Moscow Mule", "category": "Beverages", "cuisines": ["drinks", "bar"], "description": "Vodka, spicy ginger beer, and lime juice served in a traditional copper mug.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 5},
    {"name": "Lemonade", "category": "Beverages", "cuisines": ["drinks", "diner"], "description": "Tart, sweet, and freshly squeezed lemonade.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Iced Tea", "category": "Beverages", "cuisines": ["drinks", "diner"], "description": "Unsweetened black tea brewed fresh daily, served over ice with lemon.", "isVegan": True, "isGlutenFree": True, "suggestedCookingTime": 0},
    {"name": "Piña Colada", "category": "Beverages", "cuisines": ["drinks", "bar"], "description": "A frozen, tropical blend of rum, coconut cream, and pineapple juice.", "isVegetarian": True, "isGlutenFree": True, "suggestedCookingTime": 5}
]

kids_dishes = [
    # generic kids
    {"name": "Kids Chicken Nuggets", "category": "Kids", "cuisines": ["kids", "fast food"], "description": "Six crispy, all-white-meat chicken nuggets served with french fries and ketchup.", "suggestedCookingTime": 10},
    {"name": "Kids Mac & Cheese", "category": "Kids", "cuisines": ["kids"], "description": "A smaller portion of our creamy, gooey macaroni and cheese.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Kids Cheese Pizza", "category": "Kids", "cuisines": ["kids", "italian"], "description": "A personal 8-inch pizza topped with mild tomato sauce and mozzarella cheese.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Kids Mini Burger", "category": "Kids", "cuisines": ["kids", "american diner"], "description": "A plain beef slider with American cheese on a soft bun, served with fries.", "suggestedCookingTime": 10},
    {"name": "Kids Grilled Cheese", "category": "Kids", "cuisines": ["kids"], "description": "Melted American cheese between two slices of white bread, grilled until golden.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Kids Buttered Noodles", "category": "Kids", "cuisines": ["kids", "italian"], "description": "Simple elbow pasta tossed with sweet butter and a sprinkle of parmesan.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Kids Hot Dog", "category": "Kids", "cuisines": ["kids"], "description": "A classic all-beef hot dog on a soft bun, served with a side of apple slices.", "suggestedCookingTime": 10},
    {"name": "Kids Fish Sticks", "category": "Kids", "cuisines": ["kids"], "description": "Crispy breaded fish sticks served with tartar sauce and a side of steamed peas.", "suggestedCookingTime": 10},
    {"name": "Kids Quesadilla", "category": "Kids", "cuisines": ["kids", "mexican"], "description": "A simple flour tortilla folded with melted cheddar and mozzarella cheese.", "isVegetarian": True, "suggestedCookingTime": 10},
    {"name": "Kids Chicken & Rice", "category": "Kids", "cuisines": ["kids"], "description": "Plain grilled chicken breast strips served with a side of white rice.", "isGlutenFree": True, "suggestedCookingTime": 15}
]

def append_to_file():
    with open("src/lib/global-dish-library.ts", "a") as f:
        for dish in indian_dishes + spanish_dishes + breakfast_dishes + drinks_dishes + kids_dishes:
            f.write(f"  {json.dumps(dish)},\n")
        f.write("];\n")

if __name__ == "__main__":
    append_to_file()
