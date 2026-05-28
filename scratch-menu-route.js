const fs = require('fs');
const path = './src/app/menu/[id]/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetReturn = `  return (
    <CartProvider>
      <MenuClientView 
        restaurant={{
          id: restaurant.id,
          name: restaurant.name,
          cuisine_type: restaurant.cuisine_type,
          address: restaurant.address,
          phone: restaurant.phone,
          wifi_password: restaurant.wifi_password,
          primary_color: restaurant.primary_color,
          accent_color: restaurant.accent_color,
          theme_style: restaurant.theme_style,
          currency: restaurant.currency,
          plan: restaurant.plan
        }}
        categories={categoriesList}
        items={itemsList}
        tableNumber={tableNumber}
        qrCodeId={qrCodeId}
      />
      {restaurant.plan?.toLowerCase() === "elite" && (
        <FloatingCart 
          restaurantId={restaurant.id}
          tableNumber={tableNumber}
          themeStyle={restaurant.theme_style || "bistro"}
          primaryColor={restaurant.primary_color || "#000"}
          currencySymbol={restaurant.currency || "USD"}
        />
      )}
    </CartProvider>
  );`;

const newReturn = `  // 6. Theme Fallback Logic (Paywall Enforced)
  const canUseCustomDesign = ['pro', 'elite'].includes(restaurant.plan?.toLowerCase() || '') && menu.use_custom_design;

  const activeThemeStyle = canUseCustomDesign && menu.theme_style ? menu.theme_style : restaurant.theme_style;
  const activePrimaryColor = canUseCustomDesign && menu.primary_color ? menu.primary_color : restaurant.primary_color;
  const activeAccentColor = canUseCustomDesign && menu.accent_color ? menu.accent_color : restaurant.accent_color;

  return (
    <CartProvider>
      <MenuClientView 
        restaurant={{
          id: restaurant.id,
          name: restaurant.name,
          cuisine_type: restaurant.cuisine_type,
          address: restaurant.address,
          phone: restaurant.phone,
          wifi_password: restaurant.wifi_password,
          primary_color: activePrimaryColor,
          accent_color: activeAccentColor,
          theme_style: activeThemeStyle,
          currency: restaurant.currency,
          plan: restaurant.plan
        }}
        categories={categoriesList}
        items={itemsList}
        tableNumber={tableNumber}
        qrCodeId={qrCodeId}
      />
      {restaurant.plan?.toLowerCase() === "elite" && (
        <FloatingCart 
          restaurantId={restaurant.id}
          tableNumber={tableNumber}
          themeStyle={activeThemeStyle || "bistro"}
          primaryColor={activePrimaryColor || "#000"}
          currencySymbol={restaurant.currency || "USD"}
        />
      )}
    </CartProvider>
  );`;

code = code.replace(targetReturn, newReturn);
fs.writeFileSync(path, code);
console.log('Fixed menu route');
