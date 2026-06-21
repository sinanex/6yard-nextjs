import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const body = await request.json();
    const { rating, text, name, date } = body;

    if (!rating || !text || !name || !date) {
      return NextResponse.json(
        { error: 'Missing required review fields' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add review
    if (!product.reviews) {
      product.reviews = [];
    }
    
    product.reviews.unshift({ rating, text, name, date });
    
    // Update average rating and count
    product.reviews_count = product.reviews.length;
    const sum = product.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
    product.rating = parseFloat((sum / product.reviews_count).toFixed(1));

    await product.save();

    return NextResponse.json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error('Add review error:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}
