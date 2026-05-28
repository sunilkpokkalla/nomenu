import json
import re

# Read the file
with open('src/lib/global-dish-library.ts', 'r') as f:
    content = f.read()

# We need to extract the JSON array part
match = re.search(r'export const GLOBAL_DISH_LIBRARY: LibraryDish\[\s*\] = (\[.*\]);', content, re.DOTALL)
if not match:
    print("Could not find the array")
    exit(1)

array_str = match.group(1)
dishes = json.loads(array_str)

# High quality Unsplash food images
images = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop", # salad
    "https://images.unsplash.com/photo-1567306301408-9b74779a11af?q=80&w=800&auto=format&fit=crop", # steak
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop", # pizza
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop", # sandwich
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop", # pasta
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop", # bbq meat
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop", # salmon
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", # vegan bowl
    "https://images.unsplash.com/photo-1484723091791-00d31535142b?q=80&w=800&auto=format&fit=crop", # pancakes
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=800&auto=format&fit=crop", # burger
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop", # salad nuts
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop", # dessert cake
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800&auto=format&fit=crop", # soup
    "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=800&auto=format&fit=crop", # steak/meat
    "https://images.unsplash.com/photo-1481070555726-e2fe83477d56?q=80&w=800&auto=format&fit=crop", # bread/cheese
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop", # fried chicken
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800&auto=format&fit=crop", # pastry/sweet
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop", # tacos
    "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop", # sushi
    "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=800&auto=format&fit=crop", # curry
]

import random

# Replace all image URLs with high-quality ones, or remove bad ones
for i, dish in enumerate(dishes):
    if 'imageUrl' in dish:
        # All wikipedia images are low quality or incorrect. We replace them.
        # Randomly assign a high quality image.
        dish['imageUrl'] = random.choice(images)

new_array_str = json.dumps(dishes, indent=2)

# Fix JS formatting (remove quotes around keys for a cleaner look, though JSON is valid JS)
new_content = content[:match.start(1)] + new_array_str + content[match.end(1):]

with open('src/lib/global-dish-library.ts', 'w') as f:
    f.write(new_content)

print("Images replaced successfully.")
