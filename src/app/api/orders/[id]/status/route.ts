import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    if (!auth.isAdmin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    const { status } = await req.json();
    const id = (await params).id;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
