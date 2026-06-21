import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const user = await User.findById(auth.user.userId).populate('cart.product');
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json(user.cart);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const { productId, size, quantity } = await req.json();
    const user = await User.findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    const existingItem = user.cart.find((item: any) => 
      item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += (quantity || 1);
    } else {
      user.cart.push({ product: productId, size, quantity: quantity || 1 });
    }

    await user.save();
    const updatedUser = await User.findById(auth.user.userId).populate('cart.product');
    return NextResponse.json(updatedUser.cart);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
