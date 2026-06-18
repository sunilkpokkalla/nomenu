import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    const supabase = createClient();
    
    let dbQuery = supabase
      .from('global_chef_library')
      .select('*')
      .limit(12);
      
    if (query) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
    }
    
    const { data, error } = await dbQuery;
    
    if (error) {
      console.error("Library search error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("Library API error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
