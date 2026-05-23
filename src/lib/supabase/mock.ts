interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  cuisine_type?: string | null;
  address?: string | null;
  phone?: string | null;
  currency?: string | null;
  plan?: string | null;
  primary_color?: string | null;
  accent_color?: string | null;
  theme_style?: string | null;
  wifi_password?: string | null;
  created_at?: string;
}

interface Menu {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
}

interface Category {
  id: string;
  menu_id: string;
  name: string;
  description?: string | null;
  sort_order: number;
}

interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description?: string | null;
  price: number;
  is_available: boolean;
  is_popular: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  image_url?: string | null;
  created_at?: string;
}

interface QrCode {
  id: string;
  restaurant_id: string;
  menu_id: string;
  label: string;
  scan_count: number;
  created_at?: string;
}

interface MenuScan {
  id: string;
  qr_code_id: string;
  restaurant_id: string;
  scanned_at: string;
  device_type?: string | null;
  country?: string | null;
}

interface DemoDb {
  restaurants: Restaurant[];
  menus: Menu[];
  categories: Category[];
  menu_items: MenuItem[];
  qr_codes: QrCode[];
  menu_scans: MenuScan[];
}

const globalForDemo = global as unknown as { demoDb: DemoDb };

if (!globalForDemo.demoDb) {
  // Pre-populate with beautiful, premium initial data
  const restaurantId = "demo-restaurant-uuid-9876";
  const userId = "demo-user-uuid-1234-5678";

  const menus: Menu[] = [
    {
      id: "menu-lunch-111",
      restaurant_id: restaurantId,
      name: "Lunch Menu",
      description: "Available daily from 11:30 AM to 3:00 PM.",
      is_active: true,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "menu-dinner-222",
      restaurant_id: restaurantId,
      name: "Dinner & Wine Menu",
      description: "Fine French classics and handpicked wine pairings.",
      is_active: true,
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const categories: Category[] = [
    { id: "cat-app-1", menu_id: "menu-lunch-111", name: "Appetizers", sort_order: 1 },
    { id: "cat-main-2", menu_id: "menu-lunch-111", name: "Mains", sort_order: 2 },
    { id: "cat-app-3", menu_id: "menu-dinner-222", name: "Starters", sort_order: 1 },
    { id: "cat-main-4", menu_id: "menu-dinner-222", name: "Entrées", sort_order: 2 },
    { id: "cat-des-5", menu_id: "menu-dinner-222", name: "Desserts & Wine", sort_order: 3 }
  ];

  const menuItems: MenuItem[] = [
    // Lunch Apps
    {
      id: "item-1",
      category_id: "cat-app-1",
      restaurant_id: restaurantId,
      name: "French Onion Soup",
      description: "Slow-caramelized onions in a rich beef broth, topped with a sourdough crouton and melted Gruyère cheese.",
      price: 12.00,
      is_available: true,
      is_popular: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      created_at: new Date().toISOString()
    },
    {
      id: "item-2",
      category_id: "cat-app-1",
      restaurant_id: restaurantId,
      name: "Escargots de Bourgogne",
      description: "Six wild Burgundy snails baked in their shells with rich garlic, parsley, and butter. Served with a warm baguette.",
      price: 15.00,
      is_available: true,
      is_popular: false,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      created_at: new Date().toISOString()
    },
    // Lunch Mains
    {
      id: "item-3",
      category_id: "cat-main-2",
      restaurant_id: restaurantId,
      name: "Croque Monsieur",
      description: "Classic French toasted ham and cheese sandwich on brioche, smothered with creamy bechamel, served with frites.",
      price: 18.00,
      is_available: true,
      is_popular: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      created_at: new Date().toISOString()
    },
    {
      id: "item-4",
      category_id: "cat-main-2",
      restaurant_id: restaurantId,
      name: "Salade Niçoise",
      description: "Seared Ahi tuna, soft-boiled egg, fingerling potatoes, haricots verts, olives, and tomatoes over wild greens with lemon vinaigrette.",
      price: 22.00,
      is_available: true,
      is_popular: false,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      created_at: new Date().toISOString()
    },
    // Dinner Entrees
    {
      id: "item-5",
      category_id: "cat-main-4",
      restaurant_id: restaurantId,
      name: "Steak Frites",
      description: "Pan-seared 10oz prime ribeye steak with a velvety cognac peppercorn sauce, served alongside crispy house-cut truffled frites.",
      price: 38.00,
      is_available: true,
      is_popular: true,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      created_at: new Date().toISOString()
    },
    {
      id: "item-6",
      category_id: "cat-main-4",
      restaurant_id: restaurantId,
      name: "Coq au Vin",
      description: "Red wine braised chicken leg quarters, smoked bacon lardons, pearl onions, and wild mushrooms over buttered egg noodles.",
      price: 32.00,
      is_available: true,
      is_popular: false,
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_spicy: false,
      created_at: new Date().toISOString()
    },
    // Dinner Desserts
    {
      id: "item-7",
      category_id: "cat-des-5",
      restaurant_id: restaurantId,
      name: "Vanilla Bean Crème Brûlée",
      description: "Creamy Madagascar vanilla custard topped with a perfectly caramelized, shattered sugar crust, served with fresh berries.",
      price: 11.00,
      is_available: true,
      is_popular: true,
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: true,
      is_spicy: false,
      created_at: new Date().toISOString()
    }
  ];

  const qrCodes: QrCode[] = [
    {
      id: "qr-1",
      restaurant_id: restaurantId,
      menu_id: "menu-lunch-111",
      label: "Table 1 (Lunch)",
      scan_count: 42,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "qr-2",
      restaurant_id: restaurantId,
      menu_id: "menu-lunch-111",
      label: "Table 4 (Lunch)",
      scan_count: 27,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "qr-3",
      restaurant_id: restaurantId,
      menu_id: "menu-dinner-222",
      label: "VIP Lounge Booth",
      scan_count: 68,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const menuScans: MenuScan[] = [
    // Today's scans
    {
      id: "scan-1",
      qr_code_id: "qr-1",
      restaurant_id: restaurantId,
      scanned_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      device_type: "iOS",
      country: "FR"
    },
    {
      id: "scan-2",
      qr_code_id: "qr-3",
      restaurant_id: restaurantId,
      scanned_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      device_type: "Android",
      country: "FR"
    },
    {
      id: "scan-3",
      qr_code_id: "qr-3",
      restaurant_id: restaurantId,
      scanned_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      device_type: "iOS",
      country: "US"
    },
    // Past days (this month)
    {
      id: "scan-4",
      qr_code_id: "qr-1",
      restaurant_id: restaurantId,
      scanned_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      device_type: "iOS",
      country: "FR"
    },
    {
      id: "scan-5",
      qr_code_id: "qr-2",
      restaurant_id: restaurantId,
      scanned_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      device_type: "Android",
      country: "DE"
    },
    {
      id: "scan-6",
      qr_code_id: "qr-3",
      restaurant_id: restaurantId,
      scanned_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      device_type: "iOS",
      country: "GB"
    },
    {
      id: "scan-7",
      qr_code_id: "qr-1",
      restaurant_id: restaurantId,
      scanned_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      device_type: "iOS",
      country: "FR"
    }
  ];

  globalForDemo.demoDb = {
    restaurants: [
      {
        id: restaurantId,
        owner_id: userId,
        name: "Le Bistrot Parisien",
        cuisine_type: "French Bistro",
        address: "75 Rue de l'Université, Paris, France",
        phone: "+33 1 45 55 12 34",
        currency: "USD",
        plan: "FREE",
        primary_color: "#2563EB",
        accent_color: "#F59E0B",
        theme_style: "bistro",
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    menus,
    categories,
    menu_items: menuItems,
    qr_codes: qrCodes,
    menu_scans: menuScans
  };
}

class MockQueryBuilder {
  private tableName: string;
  private data: Record<string, unknown>[];

  constructor(tableName: string, data: Record<string, unknown>[]) {
    this.tableName = tableName;
    this.data = [...data];
  }

  select() {
    return this;
  }

  eq(field: string, value: unknown) {
    this.data = this.data.filter((item) => item[field] === value);
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    const ascending = options?.ascending !== false;
    this.data.sort((a, b) => {
      const valA = a[field] as string | number;
      const valB = b[field] as string | number;
      if (valA < valB) return ascending ? -1 : 1;
      if (valA > valB) return ascending ? 1 : -1;
      return 0;
    });
    return this;
  }

  limit(n: number) {
    this.data = this.data.slice(0, n);
    return this;
  }

  async maybeSingle() {
    return { data: this.data[0] || null, error: null };
  }

  async single() {
    if (this.data.length === 0) {
      return { data: null, error: new Error("No row found") };
    }
    return { data: this.data[0], error: null };
  }

  async then(resolve: (value: { data: Record<string, unknown>[]; error: Error | null }) => void) {
    resolve({ data: this.data, error: null });
  }

  insert(values: Record<string, unknown> | Record<string, unknown>[]) {
    const db = globalForDemo.demoDb;
    const key = this.tableName as keyof DemoDb;
    const array = db[key] as unknown as Record<string, unknown>[];
    const newItems = Array.isArray(values) ? values : [values];
    const insertedItems: Record<string, unknown>[] = [];
    
    for (const item of newItems) {
      const newItem = {
        id: (item.id as string) || Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        ...item
      };
      array.push(newItem);
      insertedItems.push(newItem);
    }
    
    const result = { data: insertedItems, error: null };
    
    return {
      then: (resolve: (val: typeof result) => void) => resolve(result),
      select: () => {
        const selectResult = { data: insertedItems, error: null };
        return {
          then: (resolve: (val: typeof selectResult) => void) => resolve(selectResult),
          single: async () => {
            return { data: insertedItems[0] || null, error: null };
          },
          maybeSingle: async () => {
            return { data: insertedItems[0] || null, error: null };
          }
        };
      }
    };
  }

  update(values: Record<string, unknown>) {
    return {
      eq: async (field: string, value: unknown) => {
        const db = globalForDemo.demoDb;
        const key = this.tableName as keyof DemoDb;
        const array = db[key] as unknown as Record<string, unknown>[];
        for (let i = 0; i < array.length; i++) {
          if (array[i][field] === value) {
            array[i] = { ...array[i], ...values };
          }
        }
        return { error: null };
      }
    };
  }

  delete() {
    return {
      eq: async (field: string, value: unknown) => {
        const db = globalForDemo.demoDb;
        const key = this.tableName as keyof DemoDb;
        const array = db[key] as unknown as Record<string, unknown>[];
        db[key] = array.filter((item) => item[field] !== value) as never;
        return { error: null };
      }
    };
  }
}

export function createMockClient(options?: {
  getCookie: (name: string) => string | undefined;
  setCookie: (name: string, value: string) => void;
  deleteCookie: (name: string) => void;
}) {
  const getCookie = options?.getCookie || (() => undefined);
  const setCookie = options?.setCookie || (() => {});
  const deleteCookie = options?.deleteCookie || (() => {});

  return {
    auth: {
      async getUser() {
        const userEmail = getCookie("nomenu_demo_user");
        if (!userEmail) return { data: { user: null }, error: null };
        return {
          data: {
            user: {
              id: "demo-user-uuid-1234-5678",
              email: userEmail,
              user_metadata: {
                restaurant_name: "Le Bistrot Parisien"
              }
            }
          },
          error: null
        };
      },
      async signInWithPassword({ email }: { email: string }) {
        setCookie("nomenu_demo_user", email);
        return { data: { user: { id: "demo-user-uuid-1234-5678" } }, error: null };
      },
      async signUp({
        email,
        options: signUpOptions,
      }: {
        email: string;
        options?: { data?: { restaurant_name?: string } };
      }) {
        setCookie("nomenu_demo_user", email);
        const restaurantName = signUpOptions?.data?.restaurant_name;
        if (restaurantName) {
          const restaurantObj = {
            id: "demo-restaurant-uuid-9876",
            owner_id: "demo-user-uuid-1234-5678",
            name: restaurantName,
            cuisine_type: "",
            address: "",
            phone: "",
            currency: "USD",
            plan: "free"
          };
          
          // Add to global DB
          const db = globalForDemo.demoDb;
          if (!db.restaurants.some(r => r.owner_id === "demo-user-uuid-1234-5678")) {
            db.restaurants.push(restaurantObj);
          }
          setCookie("nomenu_demo_restaurant", JSON.stringify(restaurantObj));
        }
        return {
          data: {
            user: { id: "demo-user-uuid-1234-5678", email },
            session: {}
          },
          error: null
        };
      },
      async signOut() {
        deleteCookie("nomenu_demo_user");
        deleteCookie("nomenu_demo_restaurant");
        return { error: null };
      },
      async exchangeCodeForSession() {
        return { data: { session: {} }, error: null };
      }
    },
    from(table: string) {
      const db = globalForDemo.demoDb;
      const array = db[table as keyof DemoDb] || [];
      return new MockQueryBuilder(table, array as unknown as Record<string, unknown>[]);
    }
  };
}
