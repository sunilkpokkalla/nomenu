import os

files_to_fix = [
    "src/app/api/stripe/connect/route.ts",
    "src/app/api/stripe/webhook/route.ts"
]

for file in files_to_fix:
    path = os.path.join("/Users/sunilkumar/Desktop/WEBSITES/Nomenu", file)
    with open(path, "r") as f:
        content = f.read()
    
    content = content.replace(
        "// @ts-ignore:",
        "// @ts-expect-error:"
    )
    
    with open(path, "w") as f:
        f.write(content)

print("Changed ts-ignore to ts-expect-error")
