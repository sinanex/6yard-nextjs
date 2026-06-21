import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { verifyAuth } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string, subName: string }> }) {
  try {
    await dbConnect();
    verifyAuth(req);
    const { id, subName } = await params;
    const category = await (Category as any).findById(id);
    if (!category) return NextResponse.json({ message: 'Category not found' }, { status: 404 });

    category.subcategories = category.subcategories.filter(
      (sub: string) => sub.toLowerCase() !== subName.toLowerCase()
    );

    const updatedCategory = await category.save();
    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
