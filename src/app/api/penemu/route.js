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
