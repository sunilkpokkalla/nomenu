import os
import re

themes_dir = "src/components/menu/themes"

for filename in os.listdir(themes_dir):
    if not filename.endswith("Theme.tsx"):
        continue
        
    filepath = os.path.join(themes_dir, filename)
    with open(filepath, "r") as f:
        content = f.read()

    # Find the backdrop div: usually starts with <div className="fixed inset-0
    # and the next div is the modal container
    
    # We can do this with regex, but since we want to be safe, let's just find the pattern:
    # 1. <div className="fixed inset-0 ...">
    # 2.   <div className="... flex flex-col ..."> or similar inner container
    
    # It might be easier to just do it via string replacement if they are consistent.
    # Let's see if we can find the exact strings.
    
