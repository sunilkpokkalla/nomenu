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
          { name: "Spinach Artichoke Dip", description: "Creamy blend of cheeses, spinach, and artichoke hearts. Served with warm tortilla chips.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,spinachartichokedip?lock=85945"},
          { name: "Crispy Calamari", description: "Lightly breaded and fried golden brown, served with house marinara.", price: 16.50, imageUrl: "https://loremflickr.com/800/600/food,crispycalamari?lock=22608"},
          { name: "Loaded Potato Skins", description: "Crispy skins loaded with cheddar, bacon, scallions, and sour cream.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,loadedpotatoskins?lock=32736"},
          { name: "Buffalo Wings (10)", description: "Jumbo wings tossed in classic buffalo sauce. Served with blue cheese and celery.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,buffalowings%2810%29?lock=97064"},
          { name: "Bruschetta", description: "Toasted baguette topped with diced tomatoes, garlic, basil, and balsamic glaze.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,bruschetta?lock=44577"},
          { name: "Onion Rings", description: "Thick-cut, beer-battered onion rings with spicy ranch. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,onionrings?lock=3908"},
          { name: "Mozzarella Sticks", description: "Six crispy fried cheese sticks with marinara dipping sauce. Authentic and freshly prepared by our expert chefs.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,mozzarellasticks?lock=22857"},
          { name: "Shrimp Cocktail", description: "Five jumbo shrimp chilled, served with fiery cocktail sauce and lemon.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,shrimpcocktail?lock=53312"}
        ]
      },
      {
        name: "Soups & Salads",
        items: [
          { name: "French Onion Soup", description: "Rich beef broth, caramelized onions, topped with a crostini and melted gruyere.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,frenchonionsoup?lock=64534"},
          { name: "New England Clam Chowder", description: "Creamy traditional chowder loaded with sea clams and potatoes.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,newenglandclamchowder?lock=29324"},
          { name: "Classic Caesar Salad", description: "Crisp romaine, shaved parmesan, garlic croutons, and house caesar dressing.", price: 13.00, imageUrl: "https://loremflickr.com/800/600/food,classiccaesarsalad?lock=65019"},
          { name: "Cobb Salad", description: "Mixed greens, grilled chicken, bacon, hard-boiled egg, avocado, tomatoes, blue cheese.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,cobbsalad?lock=74245"},
          { name: "House Salad", description: "Mixed greens, cherry tomatoes, cucumbers, red onions, croutons. Choice of dressing.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,housesalad?lock=83369"},
          { name: "Caprese Salad", description: "Fresh mozzarella, vine-ripe tomatoes, basil, olive oil, and balsamic reduction.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,capresesalad?lock=23413"}
        ]
      },
      {
        name: "Burgers & Sandwiches",
        items: [
          { name: "Classic Cheeseburger", description: "Half-pound Angus patty, cheddar, lettuce, tomato, onion, pickle on a brioche bun. Served with fries.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,classiccheeseburger?lock=2671"},
          { name: "Bacon BBQ Burger", description: "Angus patty, crispy bacon, onion rings, cheddar, and house BBQ sauce.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,baconbbqburger?lock=48465"},
          { name: "Mushroom Swiss Burger", description: "Sautéed mushrooms, melted swiss cheese, truffle mayo. Authentic and freshly prepared by our expert chefs.", price: 17.00, imageUrl: "https://loremflickr.com/800/600/food,mushroomswissburger?lock=41568"},
          { name: "Grilled Chicken Sandwich", description: "Marinated chicken breast, provolone, lettuce, tomato, garlic aioli.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,grilledchickensandwich?lock=76248"},
          { name: "Spicy Fried Chicken Sandwich", description: "Buttermilk fried chicken tossed in hot honey, house slaw, pickles.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,spicyfriedchickensandwich?lock=93436"},
          { name: "Philly Cheesesteak", description: "Shaved ribeye, caramelized onions, peppers, provolone on a hoagie roll.", price: 17.00, imageUrl: "https://loremflickr.com/800/600/food,phillycheesesteak?lock=86880"},
          { name: "Club Sandwich", description: "Turkey, ham, bacon, cheddar, lettuce, tomato, mayo on toasted sourdough.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,clubsandwich?lock=30681"}
        ]
      },
      {
        name: "Main Courses",
        items: [
          { name: "New York Strip (12oz)", description: "USDA Prime strip steak, grilled to order. Served with garlic mashed potatoes and asparagus.", price: 38.00, imageUrl: "https://loremflickr.com/800/600/food,newyorkstrip%2812oz%29?lock=14796"},
          { name: "Filet Mignon (8oz)", description: "Tender center-cut filet, red wine demi-glace, roasted potatoes.", price: 42.00, imageUrl: "https://loremflickr.com/800/600/food,filetmignon%288oz%29?lock=87010"},
          { name: "Grilled Atlantic Salmon", description: "Fresh salmon filet, lemon-dill butter, wild rice, seasonal vegetables.", price: 28.00, imageUrl: "https://loremflickr.com/800/600/food,grilledatlanticsalmon?lock=10025"},
          { name: "Fish and Chips", description: "Beer-battered cod, thick-cut fries, house coleslaw, tartar sauce.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,fishandchips?lock=79248"},
          { name: "Chicken Parmesan", description: "Breaded chicken breast, marinara, melted mozzarella, over linguine.", price: 24.00, imageUrl: "https://loremflickr.com/800/600/food,chickenparmesan?lock=55680"},
          { name: "Penne alla Vodka", description: "Penne pasta tossed in a creamy tomato vodka sauce with pancetta.", price: 20.00, imageUrl: "https://loremflickr.com/800/600/food,penneallavodka?lock=32906"},
          { name: "BBQ Baby Back Ribs", description: "Slow-cooked, fall-off-the-bone ribs, fries, coleslaw. Half rack.", price: 26.00, imageUrl: "https://loremflickr.com/800/600/food,bbqbabybackribs?lock=23040"},
          { name: "Roasted Vegetable Quinoa Bowl", description: "Seasonal roasted vegetables, quinoa, avocado, tahini-lemon dressing.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,roastedvegetablequinoabowl?lock=88248"}
        ]
      },
      {
        name: "Sides",
        items: [
          { name: "Truffle Fries", description: "Crispy fries tossed in truffle oil, parmesan, and parsley. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,trufflefries?lock=74702"},
          { name: "Garlic Mashed Potatoes", description: "Creamy potatoes whipped with roasted garlic and butter. Authentic and freshly prepared by our expert chefs.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,garlicmashedpotatoes?lock=39164"},
          { name: "Steamed Asparagus", description: "Fresh asparagus tossed in olive oil and lemon. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,steamedasparagus?lock=62238"},
          { name: "Mac & Cheese", description: "Four-cheese blend baked with a crispy breadcrumb topping. Authentic and freshly prepared by our expert chefs.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,mac%26cheese?lock=32596"},
          { name: "Sweet Potato Fries", description: "Served with maple-cinnamon aioli. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,sweetpotatofries?lock=15935"},
          { name: "Coleslaw", description: "House-made creamy cabbage slaw. Authentic and freshly prepared by our expert chefs.", price: 5.00, imageUrl: "https://loremflickr.com/800/600/food,coleslaw?lock=89628"}
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "New York Cheesecake", description: "Classic creamy cheesecake with a graham cracker crust and strawberry sauce.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,newyorkcheesecake?lock=13338"},
          { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center. Served with vanilla ice cream.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,chocolatelavacake?lock=63580"},
          { name: "Crème Brûlée", description: "Rich vanilla custard with a caramelized sugar crust. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,cr%C3%A8mebr%C3%BBl%C3%A9e?lock=91266"},
          { name: "Apple Cobbler", description: "Warm baked apples, cinnamon streusel topping, vanilla ice cream.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,applecobbler?lock=32500"},
          { name: "Key Lime Pie", description: "Tart and creamy key lime filling, graham crust, whipped cream.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,keylimepie?lock=41047"},
          { name: "Brownie Sundae", description: "Warm fudge brownie, two scoops vanilla ice cream, hot fudge, nuts, cherry.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,browniesundae?lock=96335"}
        ]
      },
      {
        name: "Beverages & Cocktails",
        items: [
          { name: "Old Fashioned", description: "Bourbon, simple syrup, angostura bitters, orange peel. Authentic and freshly prepared by our expert chefs.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,oldfashioned?lock=90217"},
          { name: "Margarita", description: "Blanco tequila, fresh lime juice, agave nectar, salt rim. Authentic and freshly prepared by our expert chefs.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,margarita?lock=59914"},
          { name: "Moscow Mule", description: "Vodka, ginger beer, fresh lime, served in a copper mug. Authentic and freshly prepared by our expert chefs.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,moscowmule?lock=300"},
          { name: "Draft IPA", description: "Rotating selection of local craft IPA. 16oz. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,draftipa?lock=92762"},
          { name: "Pilsner", description: "Crisp, refreshing light lager. 16oz. Authentic and freshly prepared by our expert chefs.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,pilsner?lock=19057"},
          { name: "Cabernet Sauvignon", description: "Rich, full-bodied red wine. Glass. Authentic and freshly prepared by our expert chefs.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,cabernetsauvignon?lock=34684"},
          { name: "Chardonnay", description: "Oaky, buttery white wine. Glass. Authentic and freshly prepared by our expert chefs.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,chardonnay?lock=26481"},
          { name: "Fountain Soda", description: "Coke, Diet Coke, Sprite, Ginger Ale. Authentic and freshly prepared by our expert chefs.", price: 3.50, imageUrl: "https://loremflickr.com/800/600/food,fountainsoda?lock=92812"}
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
          { name: "Bruschetta al Pomodoro", description: "Toasted rustic bread, marinated heirloom tomatoes, garlic, basil, EVOO.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,bruschettaalpomodoro?lock=50085"},
          { name: "Calamari Fritti", description: "Crispy fried squid rings, lemon wedge, spicy marinara. Authentic and freshly prepared by our expert chefs.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,calamarifritti?lock=739"},
          { name: "Burrata & Prosciutto", description: "Fresh burrata cheese, 24-month aged Prosciutto di Parma, hot honey.", price: 19.00, imageUrl: "https://loremflickr.com/800/600/food,burrata%26prosciutto?lock=4636"},
          { name: "Arancini", description: "Crispy risotto balls stuffed with mozzarella and peas, served with ragu.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,arancini?lock=64679"},
          { name: "Carpaccio di Manzo", description: "Thinly sliced raw beef, arugula, shaved parmesan, truffle oil, capers.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,carpacciodimanzo?lock=62696"},
          { name: "Polpette (Meatballs)", description: "Three house-made beef and pork meatballs in San Marzano tomato sauce.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,polpette%28meatballs%29?lock=6669"}
        ]
      },
      {
        name: "Insalate & Zuppe (Salads & Soups)",
        items: [
          { name: "Minestrone", description: "Classic Italian vegetable soup with beans and ditalini pasta.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,minestrone?lock=17355"},
          { name: "Insalata Mista", description: "Mixed greens, cherry tomatoes, cucumbers, balsamic vinaigrette.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,insalatamista?lock=26742"},
          { name: "Insalata Caprese", description: "Slices of fresh mozzarella, tomatoes, basil, drizzled with balsamic reduction.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,insalatacaprese?lock=81457"},
          { name: "Insalata di Cesare", description: "Romaine hearts, classic caesar dressing, garlic croutons, parmigiano-reggiano.", price: 13.00, imageUrl: "https://loremflickr.com/800/600/food,insalatadicesare?lock=53996"},
          { name: "Arugula & Fennel", description: "Baby arugula, shaved fennel, orange segments, citrus vinaigrette.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,arugula%26fennel?lock=39532"}
        ]
      },
      {
        name: "Pizze (Wood-Fired Pizza)",
        items: [
          { name: "Margherita", description: "San Marzano tomato sauce, fresh mozzarella, basil, extra virgin olive oil.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,margherita?lock=44844"},
          { name: "Diavola", description: "Tomato sauce, mozzarella, spicy Calabrian salami, chili flakes.", price: 21.00, imageUrl: "https://loremflickr.com/800/600/food,diavola?lock=58377"},
          { name: "Quattro Formaggi", description: "White pizza with mozzarella, gorgonzola, fontina, and parmigiano.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,quattroformaggi?lock=80881"},
          { name: "Funghi Tartufo", description: "Wild mushrooms, mozzarella, truffle oil, roasted garlic. Authentic and freshly prepared by our expert chefs.", price: 23.00, imageUrl: "https://loremflickr.com/800/600/food,funghitartufo?lock=54625"},
          { name: "Prosciutto e Rucola", description: "Tomato sauce, mozzarella, topped with fresh arugula, prosciutto, shaved parmesan.", price: 24.00, imageUrl: "https://loremflickr.com/800/600/food,prosciuttoerucola?lock=59497"},
          { name: "Salsiccia", description: "Tomato sauce, mozzarella, Italian sausage, roasted red peppers, onions.", price: 21.00, imageUrl: "https://loremflickr.com/800/600/food,salsiccia?lock=99109"}
        ]
      },
      {
        name: "Primi (Fresh Pasta)",
        items: [
          { name: "Spaghetti Carbonara", description: "Pancetta, egg yolk, pecorino romano, cracked black pepper. Authentic and freshly prepared by our expert chefs.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,spaghetticarbonara?lock=75590"},
          { name: "Tagliatelle al Ragù", description: "Ribbon pasta with traditional slow-cooked beef and pork bolognese sauce.", price: 24.00, imageUrl: "https://loremflickr.com/800/600/food,tagliatellealrag%C3%B9?lock=66690"},
          { name: "Cacio e Pepe", description: "Tonnarelli pasta, pecorino romano, toasted black pepper. Authentic and freshly prepared by our expert chefs.", price: 20.00, imageUrl: "https://loremflickr.com/800/600/food,cacioepepe?lock=46164"},
          { name: "Penne all'Arrabbiata", description: "Short pasta in a spicy garlic and tomato sauce. Authentic and freshly prepared by our expert chefs.", price: 19.00, imageUrl: "https://loremflickr.com/800/600/food,penneall%27arrabbiata?lock=80780"},
          { name: "Linguine alle Vongole", description: "Linguine with fresh clams, garlic, white wine, chili flakes, parsley.", price: 26.00, imageUrl: "https://loremflickr.com/800/600/food,linguineallevongole?lock=63674"},
          { name: "Ravioli di Ricotta", description: "House-made ravioli stuffed with ricotta and spinach, in a butter sage sauce.", price: 23.00, imageUrl: "https://loremflickr.com/800/600/food,raviolidiricotta?lock=19209"},
          { name: "Gnocchi al Pesto", description: "Potato dumplings tossed in basil pesto with toasted pine nuts.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,gnocchialpesto?lock=150"},
          { name: "Lasagna al Forno", description: "Baked layers of pasta, bolognese, bechamel, and parmesan. Authentic and freshly prepared by our expert chefs.", price: 25.00, imageUrl: "https://loremflickr.com/800/600/food,lasagnaalforno?lock=6893"}
        ]
      },
      {
        name: "Secondi (Main Courses)",
        items: [
          { name: "Pollo Parmigiana", description: "Breaded chicken breast, marinara, melted mozzarella. Served with spaghetti.", price: 26.00, imageUrl: "https://loremflickr.com/800/600/food,polloparmigiana?lock=70692"},
          { name: "Vitello Marsala", description: "Veal medallions sautéed with mushrooms in a sweet Marsala wine sauce.", price: 32.00, imageUrl: "https://loremflickr.com/800/600/food,vitellomarsala?lock=14381"},
          { name: "Bistecca alla Fiorentina", description: "32oz Porterhouse steak, grilled with olive oil and rosemary (Serves 2).", price: 85.00, imageUrl: "https://loremflickr.com/800/600/food,bisteccaallafiorentina?lock=97806"},
          { name: "Salmone Arrosto", description: "Wood-roasted salmon, lemon-caper sauce, sautéed spinach. Authentic and freshly prepared by our expert chefs.", price: 30.00, imageUrl: "https://loremflickr.com/800/600/food,salmonearrosto?lock=85300"},
          { name: "Osso Buco", description: "Braised veal shank in a white wine tomato broth, served over saffron risotto.", price: 42.00, imageUrl: "https://loremflickr.com/800/600/food,ossobuco?lock=13041"}
        ]
      },
      {
        name: "Contorni (Sides)",
        items: [
          { name: "Broccolini", description: "Sautéed with garlic, olive oil, and chili flakes. Authentic and freshly prepared by our expert chefs.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,broccolini?lock=49055"},
          { name: "Patate Arrosto", description: "Roasted fingerling potatoes with rosemary. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,patatearrosto?lock=55536"},
          { name: "Spinaci Saltati", description: "Spinach sautéed in garlic and olive oil. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,spinacisaltati?lock=13462"},
          { name: "Pane all'Aglio", description: "Rustic garlic bread with parmesan. Authentic and freshly prepared by our expert chefs.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,paneall%27aglio?lock=66507"}
        ]
      },
      {
        name: "Dolci (Desserts)",
        items: [
          { name: "Tiramisu", description: "Espresso-soaked ladyfingers, mascarpone cream, cocoa powder.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,tiramisu?lock=24824"},
          { name: "Cannoli Siciliani", description: "Two crispy pastry shells filled with sweet ricotta and chocolate chips.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,cannolisiciliani?lock=86095"},
          { name: "Panna Cotta", description: "Vanilla bean custard with wild berry compote. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,pannacotta?lock=68212"},
          { name: "Gelato", description: "Two scoops. Choice of Vanilla, Chocolate, Pistachio, or Stracciatella.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,gelato?lock=39614"},
          { name: "Affogato", description: "A scoop of vanilla gelato 'drowned' in a shot of hot espresso.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,affogato?lock=36453"}
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
          { name: "Espresso (Double)", description: "Rich, full-bodied double shot of our house blend. Authentic and freshly prepared by our expert chefs.", price: 3.50, imageUrl: "https://loremflickr.com/800/600/food,espresso%28double%29?lock=87094"},
          { name: "Americano", description: "Double espresso pulled over hot water. Authentic and freshly prepared by our expert chefs.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,americano?lock=18712"},
          { name: "Macchiato", description: "Espresso marked with a dollop of steamed milk foam. Authentic and freshly prepared by our expert chefs.", price: 4.25, imageUrl: "https://loremflickr.com/800/600/food,macchiato?lock=33566"},
          { name: "Cortado", description: "Equal parts espresso and warmly steamed milk. Authentic and freshly prepared by our expert chefs.", price: 4.50, imageUrl: "https://loremflickr.com/800/600/food,cortado?lock=58002"},
          { name: "Cappuccino", description: "Espresso with equal parts steamed milk and deep microfoam. Authentic and freshly prepared by our expert chefs.", price: 5.00, imageUrl: "https://loremflickr.com/800/600/food,cappuccino?lock=91566"},
          { name: "Latte", description: "Espresso with steamed milk and a light layer of foam. Authentic and freshly prepared by our expert chefs.", price: 5.50, imageUrl: "https://loremflickr.com/800/600/food,latte?lock=49293"},
          { name: "Mocha", description: "Espresso, steamed milk, and rich dark chocolate sauce. Authentic and freshly prepared by our expert chefs.", price: 6.00, imageUrl: "https://loremflickr.com/800/600/food,mocha?lock=55869"},
          { name: "Flat White", description: "Ristretto espresso shots with velvety steamed milk. Authentic and freshly prepared by our expert chefs.", price: 5.25, imageUrl: "https://loremflickr.com/800/600/food,flatwhite?lock=8739"},
          { name: "Drip Coffee", description: "Freshly brewed single-origin batch filter coffee. Authentic and freshly prepared by our expert chefs.", price: 3.00, imageUrl: "https://loremflickr.com/800/600/food,dripcoffee?lock=69014"},
          { name: "Pour Over", description: "Hand-poured filter coffee highlighting single-origin beans. Authentic and freshly prepared by our expert chefs.", price: 6.50, imageUrl: "https://loremflickr.com/800/600/food,pourover?lock=45145"}
        ]
      },
      {
        name: "Iced Coffee & Cold Brew",
        items: [
          { name: "Cold Brew", description: "Steeped for 18 hours for a smooth, low-acid flavor profile. Authentic and freshly prepared by our expert chefs.", price: 5.00, imageUrl: "https://loremflickr.com/800/600/food,coldbrew?lock=83748"},
          { name: "Nitro Cold Brew", description: "Cold brew infused with nitrogen for a creamy, stout-like texture.", price: 6.00, imageUrl: "https://loremflickr.com/800/600/food,nitrocoldbrew?lock=99672"},
          { name: "Iced Latte", description: "Espresso and cold milk poured over ice. Authentic and freshly prepared by our expert chefs.", price: 5.50, imageUrl: "https://loremflickr.com/800/600/food,icedlatte?lock=88126"},
          { name: "Iced Americano", description: "Espresso and cold water poured over ice. Authentic and freshly prepared by our expert chefs.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,icedamericano?lock=77073"},
          { name: "Iced Mocha", description: "Espresso, cold milk, and chocolate sauce over ice. Authentic and freshly prepared by our expert chefs.", price: 6.00, imageUrl: "https://loremflickr.com/800/600/food,icedmocha?lock=8539"}
        ]
      },
      {
        name: "Tea & Alternatives",
        items: [
          { name: "Matcha Latte", description: "Ceremonial grade matcha whisked with steamed milk and a touch of honey.", price: 6.00, imageUrl: "https://loremflickr.com/800/600/food,matchalatte?lock=61751"},
          { name: "Chai Latte", description: "Spiced black tea concentrate blended with steamed milk. Authentic and freshly prepared by our expert chefs.", price: 5.50, imageUrl: "https://loremflickr.com/800/600/food,chailatte?lock=59348"},
          { name: "London Fog", description: "Earl Grey tea steeped in steamed milk with vanilla syrup. Authentic and freshly prepared by our expert chefs.", price: 5.00, imageUrl: "https://loremflickr.com/800/600/food,londonfog?lock=24639"},
          { name: "Loose Leaf Tea", description: "Choice of English Breakfast, Earl Grey, Chamomile, Peppermint, or Green.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,looseleaftea?lock=92192"},
          { name: "Hot Chocolate", description: "Rich cocoa, steamed milk, topped with whipped cream. Authentic and freshly prepared by our expert chefs.", price: 4.50, imageUrl: "https://loremflickr.com/800/600/food,hotchocolate?lock=55324"}
        ]
      },
      {
        name: "Pastries & Bakery",
        items: [
          { name: "Butter Croissant", description: "Flaky, buttery, freshly baked every morning. Authentic and freshly prepared by our expert chefs.", price: 4.50, imageUrl: "https://loremflickr.com/800/600/food,buttercroissant?lock=93158"},
          { name: "Almond Croissant", description: "Filled with almond frangipane and topped with sliced almonds.", price: 5.50, imageUrl: "https://loremflickr.com/800/600/food,almondcroissant?lock=54711"},
          { name: "Pain au Chocolat", description: "Flaky pastry wrapped around dark chocolate batons. Authentic and freshly prepared by our expert chefs.", price: 5.00, imageUrl: "https://loremflickr.com/800/600/food,painauchocolat?lock=81592"},
          { name: "Blueberry Muffin", description: "Loaded with wild blueberries and topped with a streusel crumble.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,blueberrymuffin?lock=83492"},
          { name: "Banana Nut Bread", description: "Moist banana bread slice loaded with walnuts. Authentic and freshly prepared by our expert chefs.", price: 4.50, imageUrl: "https://loremflickr.com/800/600/food,banananutbread?lock=24967"},
          { name: "Chocolate Chip Cookie", description: "Massive, gooey, brown-butter chocolate chip cookie. Authentic and freshly prepared by our expert chefs.", price: 3.50, imageUrl: "https://loremflickr.com/800/600/food,chocolatechipcookie?lock=56335"},
          { name: "Cinnamon Roll", description: "Warm, soft cinnamon roll topped with cream cheese icing. Authentic and freshly prepared by our expert chefs.", price: 5.50, imageUrl: "https://loremflickr.com/800/600/food,cinnamonroll?lock=80264"}
        ]
      },
      {
        name: "Breakfast & Food",
        items: [
          { name: "Bacon, Egg & Cheese", description: "Crispy bacon, folded egg, cheddar cheese on a toasted brioche bun.", price: 8.50, imageUrl: "https://loremflickr.com/800/600/food,bacon%2Cegg%26cheese?lock=78100"},
          { name: "Sausage, Egg & Cheese", description: "Pork sausage patty, folded egg, cheddar on an english muffin.", price: 8.50, imageUrl: "https://loremflickr.com/800/600/food,sausage%2Cegg%26cheese?lock=46143"},
          { name: "Avocado Toast", description: "Smashed avocado, cherry tomatoes, radish, microgreens, chili flakes on thick-cut sourdough.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,avocadotoast?lock=83575"},
          { name: "Smoked Salmon Bagel", description: "Toasted everything bagel, cream cheese, smoked salmon, capers, red onion, dill.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,smokedsalmonbagel?lock=90341"},
          { name: "Oatmeal Bowl", description: "Steel-cut oats topped with fresh berries, sliced almonds, and a drizzle of maple syrup.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,oatmealbowl?lock=57406"},
          { name: "Yogurt Parfait", description: "Greek yogurt, house-made granola, mixed berries, and honey. Authentic and freshly prepared by our expert chefs.", price: 7.50, imageUrl: "https://loremflickr.com/800/600/food,yogurtparfait?lock=6898"}
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
          { name: "Edamame", description: "Steamed soybeans tossed with coarse sea salt. Authentic and freshly prepared by our expert chefs.", price: 6.00, imageUrl: "https://loremflickr.com/800/600/food,edamame?lock=64679"},
          { name: "Spicy Garlic Edamame", description: "Edamame sautéed with garlic, chili oil, and soy. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,spicygarlicedamame?lock=86410"},
          { name: "Pork Gyoza", description: "Six pan-fried pork and cabbage dumplings, served with ponzu dipping sauce.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,porkgyoza?lock=40341"},
          { name: "Shrimp Tempura", description: "Four pieces of lightly battered and fried shrimp with tempura sauce.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,shrimptempura?lock=53134"},
          { name: "Spicy Tuna Crispy Rice", description: "Crispy pan-fried sushi rice topped with spicy tuna, jalapeño, and eel sauce.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,spicytunacrispyrice?lock=19271"},
          { name: "Yellowtail Jalapeño", description: "Thinly sliced yellowtail sashimi, jalapeño rings, cilantro, yuzu ponzu.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,yellowtailjalape%C3%B1o?lock=23116"},
          { name: "Agedashi Tofu", description: "Deep-fried silken tofu in a dashi-soy broth, topped with bonito flakes.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,agedashitofu?lock=33495"}
        ]
      },
      {
        name: "Soups & Salads",
        items: [
          { name: "Miso Soup", description: "Traditional dashi and soybean paste broth, tofu, seaweed, scallions.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,misosoup?lock=92141"},
          { name: "Seaweed Salad", description: "Marinated wakame seaweed with sesame seeds. Authentic and freshly prepared by our expert chefs.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,seaweedsalad?lock=16071"},
          { name: "House Salad", description: "Mixed greens with our signature ginger dressing. Authentic and freshly prepared by our expert chefs.", price: 6.00, imageUrl: "https://loremflickr.com/800/600/food,housesalad?lock=83369"},
          { name: "Sashimi Salad", description: "Assorted raw fish over mixed greens with a spicy yuzu dressing.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,sashimisalad?lock=56324"}
        ]
      },
      {
        name: "Classic Maki (Rolls)",
        items: [
          { name: "California Roll", description: "Crab mix, avocado, cucumber. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,californiaroll?lock=63577"},
          { name: "Spicy Tuna Roll", description: "Minced tuna mixed with spicy mayo, cucumber. Authentic and freshly prepared by our expert chefs.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,spicytunaroll?lock=72184"},
          { name: "Spicy Salmon Roll", description: "Minced salmon mixed with spicy mayo, avocado. Authentic and freshly prepared by our expert chefs.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,spicysalmonroll?lock=44253"},
          { name: "Eel Avocado Roll", description: "BBQ freshwater eel, avocado, eel sauce. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,eelavocadoroll?lock=10545"},
          { name: "Philadelphia Roll", description: "Smoked salmon, cream cheese, avocado. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,philadelphiaroll?lock=97148"},
          { name: "Shrimp Tempura Roll", description: "Crispy shrimp tempura, avocado, cucumber, eel sauce. Authentic and freshly prepared by our expert chefs.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,shrimptempuraroll?lock=87372"},
          { name: "Spider Roll", description: "Soft shell crab tempura, avocado, cucumber, spicy mayo, eel sauce.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,spiderroll?lock=82265"}
        ]
      },
      {
        name: "Specialty Maki",
        items: [
          { name: "Dragon Roll", description: "Shrimp tempura and cucumber inside, topped with eel, avocado, and eel sauce.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,dragonroll?lock=65919"},
          { name: "Rainbow Roll", description: "California roll topped with assorted sashimi (tuna, salmon, yellowtail, white fish, avocado).", price: 17.00, imageUrl: "https://loremflickr.com/800/600/food,rainbowroll?lock=57522"},
          { name: "Volcano Roll", description: "California roll topped with a baked mixture of scallops, crab, and spicy mayo, eel sauce, scallions.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,volcanoroll?lock=8491"},
          { name: "Caterpillar Roll", description: "Eel and cucumber inside, topped with layers of avocado and eel sauce.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,caterpillarroll?lock=8602"},
          { name: "Firecracker Roll", description: "Spicy tuna and jalapeño inside, topped with spicy yellowtail and sriracha.", price: 17.00, imageUrl: "https://loremflickr.com/800/600/food,firecrackerroll?lock=53192"}
        ]
      },
      {
        name: "Nigiri & Sashimi",
        items: [
          { name: "Maguro (Tuna)", description: "2 pieces Nigiri or 3 pieces Sashimi. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,maguro%28tuna%29?lock=80522"},
          { name: "Sake (Salmon)", description: "2 pieces Nigiri or 3 pieces Sashimi. Authentic and freshly prepared by our expert chefs.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,sake%28salmon%29?lock=30623"},
          { name: "Hamachi (Yellowtail)", description: "2 pieces Nigiri or 3 pieces Sashimi. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,hamachi%28yellowtail%29?lock=53875"},
          { name: "Unagi (Freshwater Eel)", description: "2 pieces Nigiri or 3 pieces Sashimi. Authentic and freshly prepared by our expert chefs.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,unagi%28freshwatereel%29?lock=7788"},
          { name: "Hotate (Scallop)", description: "2 pieces Nigiri or 3 pieces Sashimi. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,hotate%28scallop%29?lock=42190"},
          { name: "Ebi (Shrimp)", description: "2 pieces Nigiri or 3 pieces Sashimi. Authentic and freshly prepared by our expert chefs.", price: 6.00, imageUrl: "https://loremflickr.com/800/600/food,ebi%28shrimp%29?lock=17316"},
          { name: "Sashimi Deluxe Platter", description: "Chef's selection of 18 pieces of premium sashimi. Authentic and freshly prepared by our expert chefs.", price: 45.00, imageUrl: "https://loremflickr.com/800/600/food,sashimideluxeplatter?lock=22829"}
        ]
      },
      {
        name: "Hot Entrees & Noodles",
        items: [
          { name: "Tonkotsu Ramen", description: "Rich pork broth, fresh noodles, chashu pork belly, soft boiled egg, wood ear mushrooms, scallions.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,tonkotsuramen?lock=1995"},
          { name: "Spicy Miso Ramen", description: "Miso and chili-infused pork broth, fresh noodles, ground pork, corn, bean sprouts.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,spicymisoramen?lock=36821"},
          { name: "Chicken Teriyaki", description: "Grilled chicken breast glazed with house teriyaki sauce, served with steamed rice and vegetables.", price: 20.00, imageUrl: "https://loremflickr.com/800/600/food,chickenteriyaki?lock=20223"},
          { name: "Salmon Teriyaki", description: "Grilled salmon filet glazed with house teriyaki sauce, served with steamed rice and vegetables.", price: 24.00, imageUrl: "https://loremflickr.com/800/600/food,salmonteriyaki?lock=14925"},
          { name: "Chicken Katsu Curry", description: "Panko breaded fried chicken cutlet, rich Japanese curry sauce, steamed rice.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,chickenkatsucurry?lock=19192"},
          { name: "Yakisoba", description: "Stir-fried noodles with chicken, cabbage, carrots, onions, and savory yakisoba sauce.", price: 17.00, imageUrl: "https://loremflickr.com/800/600/food,yakisoba?lock=48656"}
        ]
      },
      {
        name: "Desserts & Drinks",
        items: [
          { name: "Mochi Ice Cream", description: "Three pieces. Choice of Green Tea, Mango, Strawberry, or Vanilla.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,mochiicecream?lock=9971"},
          { name: "Green Tea Cheesecake", description: "Matcha infused cheesecake with a graham cracker crust. Authentic and freshly prepared by our expert chefs.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,greenteacheesecake?lock=12983"},
          { name: "Hot Sake (Tokkuri)", description: "Traditional warm house sake. Small carafe. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,hotsake%28tokkuri%29?lock=95582"},
          { name: "Sapporo Draft", description: "Premium Japanese lager on tap. Authentic and freshly prepared by our expert chefs.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,sapporodraft?lock=44177"}
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
          { name: "Guacamole & Chips", description: "Made fresh to order: Hass avocados, jalapeño, tomato, red onion, cilantro, lime. Served with warm tortilla chips.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,guacamole%26chips?lock=51584"},
          { name: "Queso Fundido", description: "Melted Oaxaca and Monterey Jack cheese, house-made chorizo. Served with warm flour tortillas.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,quesofundido?lock=87249"},
          { name: "Elote (Street Corn)", description: "Grilled corn on the cob slathered in mayo, cotija cheese, chili powder, and lime.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,elote%28streetcorn%29?lock=52923"},
          { name: "Ceviche de Camarón", description: "Shrimp marinated in lime juice, cucumber, pico de gallo, avocado.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,cevichedecamar%C3%B3n?lock=10302"},
          { name: "Nachos Supremos", description: "Tortilla chips loaded with refried beans, queso, pico de gallo, jalapeños, sour cream, guacamole.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,nachossupremos?lock=49313"},
          { name: "Taquitos Dorados", description: "Four crispy rolled corn tortillas filled with shredded chicken, topped with lettuce, crema, and cotija cheese.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,taquitosdorados?lock=96897"}
        ]
      },
      {
        name: "Street Tacos",
        items: [
          { name: "Tacos Al Pastor", description: "Three corn tortillas, marinated pork, roasted pineapple, diced onion, cilantro.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,tacosalpastor?lock=83776"},
          { name: "Tacos de Carne Asada", description: "Three corn tortillas, grilled marinated steak, diced onion, cilantro, salsa roja.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,tacosdecarneasada?lock=83799"},
          { name: "Tacos de Carnitas", description: "Three corn tortillas, slow-braised pork shoulder, diced onion, cilantro, salsa verde.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,tacosdecarnitas?lock=17948"},
          { name: "Tacos de Pollo", description: "Three corn tortillas, grilled marinated chicken, pico de gallo, avocado salsa.", price: 13.00, imageUrl: "https://loremflickr.com/800/600/food,tacosdepollo?lock=81761"},
          { name: "Baja Fish Tacos", description: "Three corn tortillas, beer-battered cod, cabbage slaw, chipotle crema.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,bajafishtacos?lock=28845"},
          { name: "Tacos Veganos", description: "Three corn tortillas, roasted sweet potatoes, black beans, corn salsa, avocado.", price: 13.00, imageUrl: "https://loremflickr.com/800/600/food,tacosveganos?lock=88986"}
        ]
      },
      {
        name: "Burritos & Bowls",
        items: [
          { name: "Carne Asada Burrito", description: "Flour tortilla, grilled steak, Mexican rice, pinto beans, pico de gallo, cheese, guacamole.", price: 16.00, imageUrl: "https://loremflickr.com/800/600/food,carneasadaburrito?lock=86126"},
          { name: "Carnitas Burrito", description: "Flour tortilla, slow-braised pork, rice, black beans, salsa verde, cheese, sour cream.", price: 15.00, imageUrl: "https://loremflickr.com/800/600/food,carnitasburrito?lock=75797"},
          { name: "California Burrito", description: "Flour tortilla, carne asada, french fries, cheese, guacamole, sour cream, pico de gallo.", price: 17.00, imageUrl: "https://loremflickr.com/800/600/food,californiaburrito?lock=42218"},
          { name: "Pollo Asado Bowl", description: "Grilled chicken served over rice, black beans, lettuce, corn salsa, cheese, and avocado.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,polloasadobowl?lock=20189"},
          { name: "Veggie Burrito", description: "Flour tortilla, grilled fajita veggies, rice, black beans, guacamole, pico de gallo.", price: 13.00, imageUrl: "https://loremflickr.com/800/600/food,veggieburrito?lock=17014"}
        ]
      },
      {
        name: "Especialidades (Mains)",
        items: [
          { name: "Enchiladas Verdes", description: "Three chicken enchiladas topped with tangy tomatillo sauce, melted cheese, crema. Served with rice and beans.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,enchiladasverdes?lock=88409"},
          { name: "Steak Fajitas", description: "Sizzling marinated skirt steak, grilled peppers and onions. Served with rice, beans, guacamole, sour cream, tortillas.", price: 24.00, imageUrl: "https://loremflickr.com/800/600/food,steakfajitas?lock=59399"},
          { name: "Chicken Fajitas", description: "Sizzling marinated chicken breast, grilled peppers and onions. Served with rice, beans, guacamole, sour cream, tortillas.", price: 20.00, imageUrl: "https://loremflickr.com/800/600/food,chickenfajitas?lock=86716"},
          { name: "Chile Relleno", description: "Poblano pepper stuffed with Oaxaca cheese, battered and fried, topped with ranchero sauce. Served with rice and beans.", price: 19.00, imageUrl: "https://loremflickr.com/800/600/food,chilerelleno?lock=89945"},
          { name: "Carne Asada Plate", description: "Thinly sliced marinated skirt steak, grilled scallions, jalapeño. Served with rice, beans, tortillas.", price: 26.00, imageUrl: "https://loremflickr.com/800/600/food,carneasadaplate?lock=23121"}
        ]
      },
      {
        name: "Postres (Desserts)",
        items: [
          { name: "Churros", description: "Crispy fried dough dusted in cinnamon sugar, served with chocolate and caramel dipping sauces.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,churros?lock=346"},
          { name: "Tres Leches Cake", description: "Traditional sponge cake soaked in three kinds of milk, topped with whipped cream.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,treslechescake?lock=96237"},
          { name: "Flan", description: "Classic vanilla custard topped with rich caramel sauce. Authentic and freshly prepared by our expert chefs.", price: 7.00, imageUrl: "https://loremflickr.com/800/600/food,flan?lock=35372"}
        ]
      },
      {
        name: "Margaritas & Bebidas",
        items: [
          { name: "House Margarita", description: "Blanco tequila, triple sec, fresh lime, agave. Rocks or frozen.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,housemargarita?lock=51295"},
          { name: "Spicy Jalapeño Margarita", description: "Jalapeño-infused tequila, lime, agave, tajin rim. Authentic and freshly prepared by our expert chefs.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,spicyjalape%C3%B1omargarita?lock=55248"},
          { name: "Cadillac Margarita", description: "Reposado tequila, Grand Marnier float, fresh lime, agave. Authentic and freshly prepared by our expert chefs.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,cadillacmargarita?lock=40325"},
          { name: "Paloma", description: "Tequila, fresh grapefruit juice, lime, grapefruit soda. Authentic and freshly prepared by our expert chefs.", price: 11.00, imageUrl: "https://loremflickr.com/800/600/food,paloma?lock=3535"},
          { name: "Horchata", description: "Sweet traditional rice milk beverage with cinnamon. Authentic and freshly prepared by our expert chefs.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,horchata?lock=86969"},
          { name: "Agua de Jamaica", description: "Sweetened iced hibiscus tea. Authentic and freshly prepared by our expert chefs.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,aguadejamaica?lock=52760"},
          { name: "Mexican Coke", description: "Made with cane sugar, served in a glass bottle. Authentic and freshly prepared by our expert chefs.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,mexicancoke?lock=11717"}
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
          { name: "Foie Gras Macaron", description: "Savory macaron filled with whipped duck liver mousse. Authentic and freshly prepared by our expert chefs.", price: 12.00 },
          { name: "Gougère", description: "Warm Gruyère cheese puff with a hint of nutmeg. Authentic and freshly prepared by our expert chefs.", price: 5.00, imageUrl: "https://loremflickr.com/800/600/food,goug%C3%A8re?lock=78700" }
        ]
      },
      {
        name: "First Course",
        items: [
          { name: "Wagyu Beef Tartare", description: "Hand-cut wagyu, cured egg yolk, capers, crostini. Authentic and freshly prepared by our expert chefs.", price: 28.00 },
          { name: "Hokkaido Scallop Crudo", description: "Thinly sliced raw scallop, yuzu kosho, finger lime, olive oil.", price: 26.00 },
          { name: "Heirloom Tomato Consommé", description: "Clarified tomato broth, basil oil, micro-greens. Authentic and freshly prepared by our expert chefs.", price: 18.00 },
          { name: "Lobster Bisque", description: "Rich lobster stock, cognac cream, tarragon. Authentic and freshly prepared by our expert chefs.", price: 24.00 },
          { name: "Roasted Bone Marrow", description: "Parsley salad, pickled shallots, grilled sourdough. Authentic and freshly prepared by our expert chefs.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,roastedbonemarrow?lock=56706" }
        ]
      },
      {
        name: "Main Course",
        items: [
          { name: "Duck Magret", description: "Pan-seared duck breast, cherry reduction, parsnip purée. Authentic and freshly prepared by our expert chefs.", price: 45.00 },
          { name: "Halibut Meunière", description: "Wild-caught halibut, brown butter, capers, lemon, parsley. Authentic and freshly prepared by our expert chefs.", price: 42.00 },
          { name: "A5 Japanese Wagyu Ribeye", description: "4oz A5 Miyazaki wagyu, black garlic jus, maitake mushrooms. Authentic and freshly prepared by our expert chefs.", price: 110.00 },
          { name: "Rack of Lamb", description: "Herb-crusted lamb, mint chimichurri, fondant potatoes. Authentic and freshly prepared by our expert chefs.", price: 52.00 },
          { name: "Black Truffle Risotto", description: "Acquerello rice, Parmigiano-Reggiano, freshly shaved black truffle.", price: 48.00, imageUrl: "https://loremflickr.com/800/600/food,blacktrufflerisotto?lock=29275" }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Vanilla Bean Panna Cotta", description: "Madagascar vanilla, berry compote, micro-basil. Authentic and freshly prepared by our expert chefs.", price: 16.00 },
          { name: "Chocolate Soufflé", description: "Valrhona dark chocolate, Grand Marnier crème anglaise. Authentic and freshly prepared by our expert chefs.", price: 20.00 },
          { name: "Lemon Tart", description: "Meyer lemon curd, toasted meringue, shortbread crust. Authentic and freshly prepared by our expert chefs.", price: 15.00 },
          { name: "Artisanal Cheese Board", description: "Chef's selection of 3 cheeses, honeycomb, marcona almonds. Authentic and freshly prepared by our expert chefs.", price: 24.00 },
          { name: "Mille-Feuille", description: "Layers of puff pastry and vanilla pastry cream, caramelized sugar.", price: 18.00, imageUrl: "https://loremflickr.com/800/600/food,mille-feuille?lock=23050" }
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
          { name: "Scotch Egg", description: "Soft-boiled egg wrapped in sausage meat, breaded and fried. Authentic and freshly prepared by our expert chefs.", price: 9.00 },
          { name: "Pork Scratchings", description: "Crispy pork rind with smoked apple sauce. Authentic and freshly prepared by our expert chefs.", price: 6.00 },
          { name: "Welsh Rarebit", description: "Melted cheddar and ale on toasted thick sourdough. Authentic and freshly prepared by our expert chefs.", price: 10.00 },
          { name: "Spicy Sausage Roll", description: "Spiced pork filling in flaky puff pastry, mustard dip. Authentic and freshly prepared by our expert chefs.", price: 8.00 },
          { name: "Pickled Egg & Onions", description: "House-pickled free-range egg and silver skin onions. Authentic and freshly prepared by our expert chefs.", price: 5.00 },
          { name: "Loaded Fries", description: "Chips topped with pulled pork, cheese sauce, and jalapeños. Authentic and freshly prepared by our expert chefs.", price: 12.00, imageUrl: "https://loremflickr.com/800/600/food,loadedfries?lock=35709" }
        ]
      },
      {
        name: "Mains",
        items: [
          { name: "Bangers and Mash", description: "Cumberland sausages, buttery mashed potatoes, onion gravy. Authentic and freshly prepared by our expert chefs.", price: 18.00 },
          { name: "Steak and Ale Pie", description: "Slow-cooked beef in ale gravy, shortcrust pastry, peas. Authentic and freshly prepared by our expert chefs.", price: 22.00 },
          { name: "Beer Battered Fish & Chips", description: "Fresh cod, triple-cooked chips, mushy peas, tartare sauce. Authentic and freshly prepared by our expert chefs.", price: 20.00 },
          { name: "The Pub Burger", description: "Double beef patty, bacon, cheddar, burger sauce, brioche bun.", price: 19.00 },
          { name: "Ploughman's Lunch", description: "Cheddar, ham, pork pie, crusty bread, pickles, apple. Authentic and freshly prepared by our expert chefs.", price: 16.00 },
          { name: "Chicken Tikka Masala", description: "British-Indian classic, served with basmati rice and naan. Authentic and freshly prepared by our expert chefs.", price: 21.00, imageUrl: "https://loremflickr.com/800/600/food,chickentikkamasala?lock=37154" }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Sticky Toffee Pudding", description: "Warm date sponge, butterscotch sauce, vanilla ice cream. Authentic and freshly prepared by our expert chefs.", price: 10.00 },
          { name: "Eton Mess", description: "Crushed meringue, whipped cream, mixed berries. Authentic and freshly prepared by our expert chefs.", price: 9.00 },
          { name: "Apple Crumble", description: "Spiced baked apples, oat crumble topping, hot custard. Authentic and freshly prepared by our expert chefs.", price: 10.00 },
          { name: "Spotted Dick", description: "Traditional suet pudding with dried fruit and custard. Authentic and freshly prepared by our expert chefs.", price: 9.00, imageUrl: "https://loremflickr.com/800/600/food,spotteddick?lock=32594" }
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
          { name: "Espresso", description: "Double shot of house blend. Authentic and freshly prepared by our expert chefs.", price: 3.50 },
          { name: "Cappuccino", description: "Equal parts espresso, steamed milk, and foam. Authentic and freshly prepared by our expert chefs.", price: 4.50 },
          { name: "Latte", description: "Espresso with steamed milk and a light layer of foam. Authentic and freshly prepared by our expert chefs.", price: 5.00 },
          { name: "Flat White", description: "Espresso with micro-foamed milk. Authentic and freshly prepared by our expert chefs.", price: 4.75 },
          { name: "Mocha", description: "Espresso, steamed milk, dark chocolate syrup. Authentic and freshly prepared by our expert chefs.", price: 5.50 },
          { name: "Cold Brew", description: "Slow-steeped iced coffee, served black. Authentic and freshly prepared by our expert chefs.", price: 4.50, imageUrl: "https://loremflickr.com/800/600/food,coldbrew?lock=83748" }
        ]
      },
      {
        name: "Pastries",
        items: [
          { name: "Butter Croissant", description: "Classic flaky, buttery French pastry. Authentic and freshly prepared by our expert chefs.", price: 4.00 },
          { name: "Pain au Chocolat", description: "Croissant dough wrapped around dark chocolate batons. Authentic and freshly prepared by our expert chefs.", price: 4.50 },
          { name: "Blueberry Muffin", description: "Streusel-topped muffin loaded with fresh blueberries. Authentic and freshly prepared by our expert chefs.", price: 3.75 },
          { name: "Cinnamon Roll", description: "Soft dough, cinnamon sugar swirl, cream cheese icing. Authentic and freshly prepared by our expert chefs.", price: 5.00 },
          { name: "Almond Croissant", description: "Twice-baked croissant filled with almond frangipane. Authentic and freshly prepared by our expert chefs.", price: 5.50, imageUrl: "https://loremflickr.com/800/600/food,almondcroissant?lock=54711" }
        ]
      },
      {
        name: "Breakfast & Sandwiches",
        items: [
          { name: "Avocado Toast", description: "Smashed avocado, chili flakes, sea salt on sourdough. Authentic and freshly prepared by our expert chefs.", price: 12.00 },
          { name: "Bacon Egg & Cheese", description: "Fried egg, crispy bacon, cheddar on a brioche bun. Authentic and freshly prepared by our expert chefs.", price: 9.00 },
          { name: "Smoked Salmon Bagel", description: "Everything bagel, cream cheese, lox, capers, red onion. Authentic and freshly prepared by our expert chefs.", price: 14.00 },
          { name: "Turkey Club Panini", description: "Sliced turkey, bacon, provolone, pesto mayo on ciabatta. Authentic and freshly prepared by our expert chefs.", price: 13.00 },
          { name: "Caprese Sandwich", description: "Fresh mozzarella, tomato, basil, balsamic on baguette. Authentic and freshly prepared by our expert chefs.", price: 11.00 },
          { name: "Granola Bowl", description: "House-made granola, Greek yogurt, fresh berries, honey. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,granolabowl?lock=67282" }
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
          { name: "Half Dozen Oysters", description: "Chef's selection of East or West Coast oysters, mignonette. Authentic and freshly prepared by our expert chefs.", price: 21.00 },
          { name: "Shrimp Cocktail", description: "Jumbo poached shrimp, spicy cocktail sauce. Authentic and freshly prepared by our expert chefs.", price: 18.00 },
          { name: "Tuna Poke", description: "Ahi tuna, soy-sesame dressing, avocado, macadamia nuts. Authentic and freshly prepared by our expert chefs.", price: 22.00 },
          { name: "Seafood Tower", description: "Oysters, clams, shrimp, lobster tail, crab claws. Authentic and freshly prepared by our expert chefs.", price: 85.00 },
          { name: "Scallop Ceviche", description: "Bay scallops, lime juice, jalapeño, cilantro, red onion. Authentic and freshly prepared by our expert chefs.", price: 19.00, imageUrl: "https://loremflickr.com/800/600/food,scallopceviche?lock=65999" }
        ]
      },
      {
        name: "Starters",
        items: [
          { name: "Crab Cakes", description: "Maryland-style lump crab cakes, remoulade sauce. Authentic and freshly prepared by our expert chefs.", price: 24.00 },
          { name: "Fried Calamari", description: "Crispy squid rings and tentacles, marinara, lemon. Authentic and freshly prepared by our expert chefs.", price: 16.00 },
          { name: "Clam Chowder", description: "Creamy New England style with potatoes and bacon. Authentic and freshly prepared by our expert chefs.", price: 10.00 },
          { name: "Steamed Mussels", description: "PEI mussels, white wine, garlic, butter, toasted baguette. Authentic and freshly prepared by our expert chefs.", price: 18.00 },
          { name: "Lobster Bisque", description: "Rich, creamy lobster soup finished with sherry. Authentic and freshly prepared by our expert chefs.", price: 14.00, imageUrl: "https://loremflickr.com/800/600/food,lobsterbisque?lock=42908" }
        ]
      },
      {
        name: "Mains",
        items: [
          { name: "Grilled Swordfish", description: "Center-cut steak, lemon-caper butter, asparagus. Authentic and freshly prepared by our expert chefs.", price: 34.00 },
          { name: "Lobster Roll", description: "Chunks of fresh lobster meat, light mayo, celery, buttered roll.", price: 32.00 },
          { name: "Seared Scallops", description: "Jumbo sea scallops, sweet corn purée, bacon lardons. Authentic and freshly prepared by our expert chefs.", price: 38.00 },
          { name: "Whole Branzino", description: "Mediterranean sea bass, blistered tomatoes, olives, herbs. Authentic and freshly prepared by our expert chefs.", price: 42.00 },
          { name: "Seafood Pasta", description: "Linguine, shrimp, clams, mussels, spicy tomato sauce. Authentic and freshly prepared by our expert chefs.", price: 30.00 },
          { name: "Fish Tacos", description: "Blackened mahi-mahi, cabbage slaw, pico de gallo, crema. Authentic and freshly prepared by our expert chefs.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,fishtacos?lock=55990" }
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
          { name: "Vegetable Samosa", description: "Crispy pastry filled with spiced potatoes and peas. Authentic and freshly prepared by our expert chefs.", price: 7.00 },
          { name: "Onion Bhaji", description: "Crispy onion fritters seasoned with mild spices. Authentic and freshly prepared by our expert chefs.", price: 8.00 },
          { name: "Paneer Tikka", description: "Marinated cottage cheese cubes grilled in tandoor. Authentic and freshly prepared by our expert chefs.", price: 12.00 },
          { name: "Chicken 65", description: "Spicy, deep-fried chicken bites flavored with curry leaves. Authentic and freshly prepared by our expert chefs.", price: 14.00 },
          { name: "Aloo Tikki", description: "Spiced potato patties served with mint and tamarind chutney.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,alootikki?lock=47585" }
        ]
      },
      {
        name: "Curries & Mains",
        items: [
          { name: "Chicken Tikka Masala", description: "Roasted marinated chicken chunks in a spiced curry sauce. Authentic and freshly prepared by our expert chefs.", price: 20.00 },
          { name: "Butter Chicken", description: "Mild, creamy tomato-based curry with tender chicken. Authentic and freshly prepared by our expert chefs.", price: 21.00 },
          { name: "Lamb Rogan Josh", description: "Aromatic braised lamb chunks in a gravy of browned onions and spices.", price: 24.00 },
          { name: "Palak Paneer", description: "Fresh spinach purée cooked with chunks of Indian cottage cheese.", price: 18.00 },
          { name: "Chana Masala", description: "Chickpeas simmered in a spiced tomato and onion gravy. Authentic and freshly prepared by our expert chefs.", price: 16.00 },
          { name: "Biryani (Chicken/Lamb/Veg)", description: "Fragrant basmati rice layered with spices and your choice of protein.", price: 22.00, imageUrl: "https://loremflickr.com/800/600/food,biryani%28chicken/lamb/veg%29?lock=51292" }
        ]
      },
      {
        name: "Breads & Sides",
        items: [
          { name: "Garlic Naan", description: "Leavened flatbread baked in tandoor with minced garlic. Authentic and freshly prepared by our expert chefs.", price: 4.50 },
          { name: "Plain Naan", description: "Classic soft leavened flatbread. Authentic and freshly prepared by our expert chefs.", price: 3.50 },
          { name: "Roti", description: "Whole wheat unleavened flatbread. Authentic and freshly prepared by our expert chefs.", price: 3.00 },
          { name: "Basmati Rice", description: "Steamed aromatic long-grain rice. Authentic and freshly prepared by our expert chefs.", price: 5.00 },
          { name: "Raita", description: "Cooling yogurt dip with cucumber and cumin. Authentic and freshly prepared by our expert chefs.", price: 4.00, imageUrl: "https://loremflickr.com/800/600/food,raita?lock=85236" }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Gulab Jamun", description: "Fried milk dumplings soaked in cardamom-rose syrup. Authentic and freshly prepared by our expert chefs.", price: 6.00 },
          { name: "Rasmalai", description: "Soft cheese patties in sweet, thickened milk flavored with saffron.", price: 7.00 },
          { name: "Mango Lassi", description: "Sweet and creamy yogurt drink blended with mango pulp. Authentic and freshly prepared by our expert chefs.", price: 5.50, imageUrl: "https://loremflickr.com/800/600/food,mangolassi?lock=87153" }
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
          { name: "Hummus", description: "Creamy chickpea purée, tahini, lemon, olive oil, warm pita. Authentic and freshly prepared by our expert chefs.", price: 9.00 },
          { name: "Baba Ganoush", description: "Smoky roasted eggplant dip, tahini, garlic. Authentic and freshly prepared by our expert chefs.", price: 10.00 },
          { name: "Tzatziki", description: "Greek yogurt, cucumber, dill, garlic dip. Authentic and freshly prepared by our expert chefs.", price: 8.00 },
          { name: "Falafel", description: "Crispy fried chickpea herb patties, tahini sauce. Authentic and freshly prepared by our expert chefs.", price: 11.00 },
          { name: "Dolmades", description: "Grape leaves stuffed with rice, herbs, and lemon. Authentic and freshly prepared by our expert chefs.", price: 9.00 },
          { name: "Spanakopita", description: "Flaky phyllo pastry filled with spinach and feta cheese. Authentic and freshly prepared by our expert chefs.", price: 12.00 },
          { name: "Feta & Olives", description: "Marinated Kalamata olives and sheep's milk feta. Authentic and freshly prepared by our expert chefs.", price: 10.00, imageUrl: "https://loremflickr.com/800/600/food,feta%26olives?lock=70492" }
        ]
      },
      {
        name: "Salads & Soups",
        items: [
          { name: "Greek Salad", description: "Tomatoes, cucumbers, red onions, Kalamata olives, feta block.", price: 14.00 },
          { name: "Fattoush", description: "Mixed greens, radishes, tomatoes, crispy pita chips, sumac vinaigrette.", price: 13.00 },
          { name: "Tabbouleh", description: "Parsley, mint, bulgur, tomatoes, lemon juice. Authentic and freshly prepared by our expert chefs.", price: 11.00 },
          { name: "Lentil Soup", description: "Red lentils, cumin, onions, lemon wedge. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,lentilsoup?lock=44286" }
        ]
      },
      {
        name: "Mains & Grills",
        items: [
          { name: "Chicken Souvlaki", description: "Marinated chicken skewers, rice pilaf, tzatziki, pita. Authentic and freshly prepared by our expert chefs.", price: 21.00 },
          { name: "Lamb Gyro Plate", description: "Shaved lamb/beef mix, fries, Greek salad, pita. Authentic and freshly prepared by our expert chefs.", price: 22.00 },
          { name: "Beef Kofta", description: "Spiced ground beef skewers, grilled vegetables, hummus. Authentic and freshly prepared by our expert chefs.", price: 23.00 },
          { name: "Moussaka", description: "Layered eggplant, potatoes, ground beef, béchamel sauce. Authentic and freshly prepared by our expert chefs.", price: 24.00 },
          { name: "Grilled Branzino", description: "Whole Mediterranean sea bass, olive oil, lemon, herbs. Authentic and freshly prepared by our expert chefs.", price: 32.00, imageUrl: "https://loremflickr.com/800/600/food,grilledbranzino?lock=83469" }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Baklava", description: "Layers of phyllo dough, chopped nuts, honey syrup. Authentic and freshly prepared by our expert chefs.", price: 7.00 },
          { name: "Knafeh", description: "Warm sweet cheese pastry, shredded phyllo, pistachio. Authentic and freshly prepared by our expert chefs.", price: 10.00 },
          { name: "Greek Yogurt", description: "Served with local honey and walnuts. Authentic and freshly prepared by our expert chefs.", price: 8.00, imageUrl: "https://loremflickr.com/800/600/food,greekyogurt?lock=43184" }
        ]
      }
    ]
  }
];
