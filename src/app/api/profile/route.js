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


export async function PUT(request) {
  try {
    // Parse the request body to get the updated data and record ID
    const { user_id, ...updatedFields } = await request.json();
    console.log(user_id)
    // Ensure the `id` is provided
    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Perform the update in Supabase
    const { data, error } = await supabase
      .from('user_data')
      .update(updatedFields) // Pass the fields to update
      .eq('user_id', user_id);
    // Handle errors
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Respond with the updated data
    return NextResponse.json(1, { status: 200 });
  } catch (error) {

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
