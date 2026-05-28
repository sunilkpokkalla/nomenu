const fs = require('fs');
const path = './src/app/dashboard/actions.ts';
let code = fs.readFileSync(path, 'utf8');

// Replace updateMenuBranding
code = code.replace(/export async function updateMenuBranding[\s\S]*?redirect\(\`\/dashboard\/menus\/\$\{menuId\}\/customize\?success=Menu design updated successfully\`\);\n\}/, 
`export async function updateMenuBranding(menuId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const useCustomDesign = formData.get("use_custom_design") === "true";
  
  let design_config = null;
  if (useCustomDesign) {
    design_config = {
      primary_color: formData.get("primaryColor") as string,
      accent_color: formData.get("accentColor") as string,
      theme_style: formData.get("themeStyle") as string,
    };
  }

  const { error } = await supabase
    .from("menus")
    .update({ design_config })
    .eq("id", menuId);

  if (error) {
    redirect(\`/dashboard/customize?message=\${encodeURIComponent(error.message)}\`);
  }

  revalidatePath("/dashboard/customize");
  redirect(\`/dashboard/customize?success=Menu design updated successfully\`);
}`);

fs.writeFileSync(path, code);
console.log('Fixed actions');
