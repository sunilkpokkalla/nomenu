import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    pattern = r'\.eq\(\s*["\']owner_id["\']\s*,\s*([a-zA-Z0-9_.]+)\s*\)\s*\.single\(\)'
    def repl(m):
        var_name = m.group(1)
        return f'.eq("owner_id", {var_name})\n    .order("created_at", {{ ascending: true }})\n    .limit(1)\n    .maybeSingle()'
        
    new_content = re.sub(pattern, repl, content)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            fix_file(os.path.join(root, file))
