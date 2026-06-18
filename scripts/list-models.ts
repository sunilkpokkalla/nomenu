import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.models) {
    const names = data.models.map((m: any) => m.name);
    console.log("Available imagen or gemini models:");
    console.log(names.filter((n: string) => n.includes('imagen') || n.includes('gemini')));
  } else {
    console.log("Error fetching models:", data);
  }
}

listModels();
