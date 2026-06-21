import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const { items } = await req.json();
    const user = await (User as any).findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    for (const item of items) {
      const existingItem = user.cart.find((ci: any) => ci.product.toString() === item.productId && ci.size === item.size);
      if (existingItem) {
        existingItem.quantity += (item.quantity || 1);
      } else {
        user.cart.push({ product: item.productId, size: item.size, quantity: item.quantity || 1 });
      }
    }
    
    await user.save();
    const updatedUser = await (User as any).findById(auth.user.userId).populate('cart.product');
    return NextResponse.json(updatedUser.cart);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
