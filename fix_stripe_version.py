import os

files_to_fix = [
    "src/app/api/stripe/checkout/route.ts",
    "src/app/api/stripe/connect/route.ts",
    "src/app/api/stripe/webhook/route.ts"
]

for file in files_to_fix:
    path = os.path.join("/Users/sunilkumar/Desktop/WEBSITES/Nomenu", file)
    with open(path, "r") as f:
        content = f.read()
    
    # Fix Stripe API version
    content = content.replace('apiVersion: "2024-12-18.acacia"', 'apiVersion: "2026-05-27.dahlia"')
    
    with open(path, "w") as f:
        f.write(content)

print("Fixed Stripe API version")
