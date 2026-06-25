import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ message: 'Amount is required' }, { status: 400 });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
