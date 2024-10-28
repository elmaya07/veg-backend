// app/api/users/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase
    .from('penemu')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const penemuId = searchParams.get('penemu_id');

  // Check if both IDs are provided
  if (!userId || !penemuId) {
    return NextResponse.json(
      { error: 'Both user_id and penemu_id are required' },
      { status: 400 }
    );
  }

  // Query the Supabase 'penemu' table with the provided user_id and penemu_id
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('penemu_id', penemuId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data.length > 0) {
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('penemu_id', penemuId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(1, { status: 200 });
  } else {
    const { data, error } = await supabase
      .from('likes')
      .insert([{ user_id: userId, penemu_id: penemuId }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(1, { status: 200 });
  }


}
