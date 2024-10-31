
import multer from 'multer';
import { NextResponse } from 'next/server';
import { promisify } from 'util';
import { randomUUID } from 'crypto';// app/api/login/route.ts
import { supabase, supabaseUrl } from '@/lib/supabaseClient';
import fs from 'fs';
import path from 'path';
import moment from 'moment';


export async function POST(req) {
  try {
    // Ambil form data dari request
    const formData = await req.formData();
    const imageFile = formData.get('image'); // Mengambil file image
    const title = formData.get('title'); // Mengambil field title
    const body = formData.get('body'); // Mengambil field body
    const author = formData.get('body'); // Mengambil field body
    const userId = formData.get('user_id'); // Mengambil field body

    if (!imageFile || !imageFile.arrayBuffer) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Generate a unique file title
    const fileName = `${randomUUID()}-${imageFile.name}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images') // Ganti dengan nama bucket Anda
      .upload(fileName, buffer, {
        contentType: imageFile.type, // Tipe konten file
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Dapatkan URL publik dari gambar
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/images/${fileName}`;

    // Simpan metadata ke database (jika perlu)
    const { data: dbData, error: dbError } = await supabase
      .from('penemu') // Ganti dengan nama tabel Anda
      .insert({
        title, body, author,
        date: moment().format('YYYY-MM-DD'),
        user_id: userId, image_url: publicUrl
      })
      .select();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Image uploaded successfully',
      url: publicUrl,
      title,
      body,
      author,
      user_id: userId,
      data: dbData,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function PUT(req) {
  try {
    // Ambil form data dari request
    const formData = await req.formData();
    const imageFile = formData.get('image'); // Mengambil file image
    const title = formData.get('title'); // Mengambil field title
    const body = formData.get('body'); // Mengambil field body
    const author = formData.get('body'); // Mengambil field body
    const userId = formData.get('user_id'); // Mengambil field body
    const id = formData.get('id'); // Mengambil field body

    if (!imageFile || !imageFile.arrayBuffer) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Generate a unique file title
    const fileName = `${randomUUID()}-${imageFile.name}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images') // Ganti dengan nama bucket Anda
      .upload(fileName, buffer, {
        contentType: imageFile.type, // Tipe konten file
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Dapatkan URL publik dari gambar
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/images/${fileName}`;

    // Simpan metadata ke database (jika perlu)
    const { data: dbData, error: dbError } = await supabase
      .from('penemu') // Ganti dengan nama tabel Anda
      .update({
        title, body, author,
        date: moment().format('YYYY-MM-DD'),
        user_id: userId, image_url: publicUrl
      })
      .eq('id', id)
      .select();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Image uploaded successfully',
      url: publicUrl,
      title,
      body,
      author,
      user_id: userId,
      data: dbData,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};