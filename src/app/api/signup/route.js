// app/api/login/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*', // Ganti dengan asal yang diizinkan
        'Access-Control-Allow-Methods': 'GET, OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}


export async function POST(request) {
  const { email, password, username, profesi } = await request.json();
  console.log({ email, password, username, profesi })
  // Validate the input
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Sign in the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    username, profesi,
    user_metadata: {
      username, profesi,
    }
  });

  // Handle any errors during sign-in
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const insertdata = await supabase
    .from('user_data')
    .insert([{
      username, profesi, user_id: data.user.id,
    }]);

  if (insertdata.error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

  // Successful login, return user data
  return NextResponse.json(data.user, { status: 200 });
}
