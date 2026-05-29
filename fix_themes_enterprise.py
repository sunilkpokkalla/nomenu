import os

themes_dir = "src/components/menu/themes"
files_to_fix = [
    "BrutalistTheme.tsx",
    "CyberpunkTheme.tsx",
    "SpeakeasyTheme.tsx",
    "RetroTheme.tsx",
    "OmakaseTheme.tsx",
    "BoutiqueTheme.tsx"
]

for file in files_to_fix:
    path = os.path.join(themes_dir, file)
    with open(path, "r") as f:
        content = f.read()
    
    # Replace the old logic
    content = content.replace(
        'const canOrder = currentPlan === "elite";', 
        'const canOrder = currentPlan === "elite" || currentPlan === "enterprise";'
    )
    
    with open(path, "w") as f:
        f.write(content)

print("Fixed theme order checks")
