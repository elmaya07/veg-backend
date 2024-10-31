
import multer from 'multer';
import { NextResponse } from 'next/server';
import { promisify } from 'util';
import { randomUUID } from 'crypto';// app/api/login/route.ts
import { supabase, supabaseUrl } from '@/lib/supabaseClient';

// Setup multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper untuk menjalankan multer
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function POST(req) {
  const contentType = req.headers.get('content-type') || '';
  console.log(contentType)
  // Bungkus dalam try-catch untuk menangani error
  try {
    // Jalankan middleware multer
    await runMiddleware(req, {}, upload.single('image'));

    const { title, body, author, user_id } = req.body; // menangkap data tambahan dari form
    const imageFile = req.file;
    console.log(imageFile)
    if (!imageFile) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // Generate unique file title
    const fileName = `${randomUUID()}-${imageFile.originalname}`;

    // Upload file ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, imageFile.buffer, {
        contentType: imageFile.mimetype,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Dapatkan URL publik dari gambar
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/images/${fileName}`;

    // Simpan URL gambar bersama dengan data lainnya di Supabase Database
    const { data: dbData, error: dbError } = await supabase
      .from('penemu')
      .insert({ title, body, author, user_id, image_url: imageUrl })
      .select();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image uploaded successfully', data: dbData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser untuk menggunakan multer
  },
};