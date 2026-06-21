import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const { quantity } = await req.json();
    const itemId = (await params).itemId;
    
    const user = await User.findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    const cartItem = user.cart.id(itemId);
    if (!cartItem) return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    
    cartItem.quantity = quantity;
    await user.save();
    
    const updatedUser = await User.findById(auth.user.userId).populate('cart.product');
    return NextResponse.json(updatedUser.cart);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const itemId = (await params).itemId;
    
    const user = await User.findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    user.cart.pull(itemId);
    await user.save();
    
    const updatedUser = await User.findById(auth.user.userId).populate('cart.product');
    return NextResponse.json(updatedUser.cart);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
