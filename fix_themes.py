import os
import re

def rewrite_theme(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Fix imports
    content = content.replace(
        'import { MenuProps, OrderItem } from "../types";',
        'import { MenuThemeProps } from "../types";'
    )

    # 2. Add OrderItem if missing
    order_item_def = """
type OrderItem = {
  item_id: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
};
"""
    if "type OrderItem =" not in content:
        content = content.replace('import { useState } from "react";', 'import { useState } from "react";\n' + order_item_def)

    # 3. Replace the component signature and init block
    theme_name = "BotanicalTheme" if "BotanicalTheme" in filepath else "MolecularTheme"
    default_msg = "Locally sourced, organically inspired." if theme_name == "BotanicalTheme" else "SYNTHESIS // PREPARATION // CONSUMPTION"
    
    new_init = f"""export function {theme_name}({{ restaurant, categories: rawCategories, items }}: MenuThemeProps) {{
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";
  const canFeedback = currentPlan === "pro" || currentPlan === "growth" || canOrder;

  const categories = rawCategories.map(cat => ({{
    ...cat,
    items: items.filter(item => item.category_id === cat.id && item.is_available)
  }})).filter(cat => cat.items.length > 0);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].name : ""
  );

  const restaurantName = restaurant.name || "{'The Garden' if theme_name == 'BotanicalTheme' else 'LAB-01'}";
  const accentColor = restaurant.accent_color || "{'#3E5739' if theme_name == 'BotanicalTheme' else '#00E5FF'}";
  const welcomeMessage = "{default_msg}";
"""

    content = re.sub(
        rf"export function {theme_name}\(.*?\) {{.*?const accentColor = [^\n]+\n",
        new_init,
        content,
        flags=re.DOTALL
    )

    # 4. Fix menu. usages
    content = content.replace(
        "{menu.design_config?.welcome_message || \"Locally sourced, organically inspired.\"}",
        "{welcomeMessage}"
    )
    content = content.replace(
        "{menu.design_config?.welcome_message || \"SYNTHESIS // PREPARATION // CONSUMPTION\"}",
        "{welcomeMessage}"
    )
    content = re.sub(
        r'<FeedbackFAB menuId=\{menu\.id\} restaurantId=\{menu\.restaurant_id\} />',
        '<FeedbackFAB restaurantId={restaurant.id} />',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

rewrite_theme('src/components/menu/themes/BotanicalTheme.tsx')
rewrite_theme('src/components/menu/themes/MolecularTheme.tsx')
