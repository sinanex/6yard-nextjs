import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const categories = await (Category as any).find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    verifyAuth(req); // ensure logged in
    
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File | null;

    if (!name) return NextResponse.json({ message: 'Category name is required' }, { status: 400 });

    const existingCategory = await (Category as any).findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) return NextResponse.json({ message: 'Category already exists' }, { status: 400 });

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadToCloudinary(image, 'kitbay/categories');
    }

    const category = new Category({ name, imageUrl, subcategories: [] });
    const savedCategory = await category.save();
    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
