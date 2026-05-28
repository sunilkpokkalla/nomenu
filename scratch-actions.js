const fs = require('fs');
const path = './src/app/dashboard/actions.ts';
let code = fs.readFileSync(path, 'utf8');

const newAction = `
export async function updateMenuBranding(menuId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const useCustomDesign = formData.get("use_custom_design") === "true";
  const primaryColor = formData.get("primary_color") as string;
  const accentColor = formData.get("accent_color") as string;
  const themeStyle = formData.get("theme_style") as string;

  const { error } = await supabase
    .from("menus")
    .update({
      use_custom_design: useCustomDesign,
      primary_color: primaryColor || null,
      accent_color: accentColor || null,
      theme_style: themeStyle || null,
    })
    .eq("id", menuId);

  if (error) {
    redirect(\`/dashboard/menus/\${menuId}/customize?error=\${encodeURIComponent(error.message)}\`);
  }

  redirect(\`/dashboard/menus/\${menuId}/customize?success=Menu design updated successfully\`);
}
`;

if (!code.includes('updateMenuBranding')) {
  code += newAction;
  fs.writeFileSync(path, code);
  console.log('Added updateMenuBranding action');
} else {
  console.log('Action already exists');
}
