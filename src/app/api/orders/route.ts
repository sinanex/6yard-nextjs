import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const { items, shippingAddress, paymentMethod, totalAmount, shippingCharge, subtotal, advancePaid, razorpayPaymentId } = await req.json();
    
    const newOrder = new Order({
      user: auth.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      shippingCharge,
      subtotal,
      advancePaid: advancePaid || 0,
      razorpayPaymentId,
      paymentStatus: razorpayPaymentId ? 'Paid' : 'Pending'
    });

    const savedOrder = await newOrder.save();

    await User.findByIdAndUpdate(auth.user.userId, { $set: { cart: [] } });

    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
