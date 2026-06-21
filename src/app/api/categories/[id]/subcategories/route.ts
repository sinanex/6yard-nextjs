import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    verifyAuth(req);
    const { subcategoryName } = await req.json();
    if (!subcategoryName) return NextResponse.json({ message: 'Subcategory name is required' }, { status: 400 });

    const id = (await params).id;
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ message: 'Category not found' }, { status: 404 });

    const exists = category.subcategories.some(
      (sub: string) => sub.toLowerCase() === subcategoryName.toLowerCase()
    );

    if (exists) return NextResponse.json({ message: 'Subcategory already exists' }, { status: 400 });

    category.subcategories.push(subcategoryName);
    const updatedCategory = await category.save();
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
