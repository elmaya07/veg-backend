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
  const { email, password } = await request.json();

  // Validate the input
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Sign in the user
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Handle any errors during sign-in
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Successful login, return user data
  return NextResponse.json(data.user, { status: 200 });
}