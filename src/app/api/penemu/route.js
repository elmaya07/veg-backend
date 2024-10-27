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
  const { title, body, author } = await request.json();
  console.log(title)
  const { data, error } = await supabase
    .from('penemu')
    .insert([{ title, body, author }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
