import os
import re

themes_dir = "/Users/sunilkumar/Desktop/WEBSITES/Nomenu/src/components/menu/themes"

for filename in os.listdir(themes_dir):
    if not filename.endswith(".tsx"):
        continue
    filepath = os.path.join(themes_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Replace Import
    content = content.replace(
        'import { RestaurantInfoModal } from "../restaurant-info-modal";',
        'import { RestaurantInfoPills } from "../restaurant-info-pills";'
    )
    
    # 2. Remove the old Modal
    content = re.sub(r'<\s*RestaurantInfoModal\s+restaurant=\{restaurant\}\s*/>\s*', '', content)
    
    # 3. Inject Pills. A good place is right after the block that prints {restaurant.name}
    # We will look for {restaurant.name} and then the next closing tag like </h1, </h2, </p, or </div.
    # Since regex is tricky, let's find the first occurrence of `{restaurant.name}` 
    # and then the very next line that has a closing tag.
    
    # Let's do a regex that finds the first heading tag containing {restaurant.name}
    # e.g., <h1 ...> {restaurant.name} </h1>
    # or <p ...> {restaurant.name} </p>
    # Since it can span multiple lines, we'll try to find {restaurant.name} and then the next closing block-level tag.
    
    def inject_pills(match):
        return match.group(0) + '\n          <RestaurantInfoPills restaurant={restaurant} />\n'
        
    # We will search for {restaurant.name} followed by anything until a closing h1/h2/h3/p/div tag on the same or next few lines.
    # We use a non-greedy match to find the FIRST closing tag after {restaurant.name} that looks like a heading or paragraph.
    # Actually, many themes use <h1...> \n {restaurant.name} \n </h1>.
    pattern = r'(\{restaurant\.name\}.*?</(?:h1|h2|h3|p|div|span)>)'
    
    # We only want to inject it once per file, at the main header, which is the FIRST match.
    content, count = re.subn(pattern, inject_pills, content, count=1, flags=re.DOTALL)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    if count == 0:
        print(f"Failed to inject in {filename}")
    else:
        print(f"Updated {filename}")
