import os
import re

files_to_fix = [
    "src/app/api/stripe/checkout/route.ts",
    "src/app/api/stripe/connect/route.ts",
    "src/app/api/stripe/webhook/route.ts",
    "src/app/dashboard/payouts/connect-bank-button.tsx",
    "src/components/menu/floating-cart.tsx"
]

for file in files_to_fix:
    path = os.path.join("/Users/sunilkumar/Desktop/WEBSITES/Nomenu", file)
    with open(path, "r") as f:
        content = f.read()
    
    # Fix catch (error: any)
    content = content.replace("catch (error: any)", "catch (error: unknown)")
    content = content.replace("error.message", "(error as Error).message")
    
    # Fix catch (err: any)
    content = content.replace("catch (err: any)", "catch (err: unknown)")
    content = content.replace("err.message", "(err as Error).message")
    
    # Fix specific map item type in checkout route
    if file == "src/app/api/stripe/checkout/route.ts":
        content = content.replace(
            "const lineItems = items.map((item: any) => {",
            "const lineItems = items.map((item: {price: number, quantity: number, name: string, id?: string, item_id?: string}) => {"
        )
    
    with open(path, "w") as f:
        f.write(content)

print("Fixed any types")
