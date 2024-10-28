// app/api/users/route.ts
import { supabase } from "@/lib/supabaseClient";
import moment from "moment";
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


export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  let results = null;
  if (user_id) {
    const { data, error } = await supabase
      .from('penemu')
      .select('*')
      .eq('user_id', user_id);
    results = data
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { data, error } = await supabase
      .from('penemu')
      .select('*');
    results = data
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const result = [];
  for (const row of results) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('penemu_id', row.id)
      ;
    const res = {
      ...row,
      likes: (data || []).length
    }
    result.push(res);
  }

  console.log(result)
  return NextResponse.json(result);
}

export async function POST(request) {
  const { title, body, author, user_id } = await request.json();

  const currDate = moment().format('YYYY-MM-DD')
  console.log(currDate)
  const { data, error } = await supabase
    .from('penemu')
    .insert([{ title, body, author, user_id, date: currDate }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request) {
  try {
    // Parse the request body to get the updated data and record ID
    const { id, ...updatedFields } = await request.json();

    // Ensure the `id` is provided
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Perform the update in Supabase
    const { data, error } = await supabase
      .from('penemu')
      .update(updatedFields) // Pass the fields to update
      .eq('id', id); // Use the `id` to find the specific record

    // Handle errors
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Respond with the updated data
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request) {
  // Parse the request URL to get the ID of the user to delete
  const { searchParams } = new URL(request.url);
  console.log(searchParams)
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('penemu')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
}
