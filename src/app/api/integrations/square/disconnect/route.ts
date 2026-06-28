import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!restaurant) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Delete the Square integration token
    await supabase
      .from('restaurant_integrations')
      .delete()
      .eq('restaurant_id', restaurant.id)
      .eq('provider', 'square');

    // Redirect back to integrations with success message
    return NextResponse.redirect(new URL('/dashboard/integrations?success=Square+disconnected+successfully', req.url));

  } catch (error) {
    console.error('Error disconnecting Square:', error);
    return NextResponse.redirect(new URL('/dashboard/integrations?message=Failed+to+disconnect+Square', req.url));
  }
}
