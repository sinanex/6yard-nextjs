import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

// GET all addresses for the authenticated user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const user = await (User as any).findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    return NextResponse.json(user.addresses || []);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

// POST a new address
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const user = await (User as any).findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const newAddress = await req.json();

    // If this is the first address or set as default, unset others
    if (user.addresses.length === 0 || newAddress.isDefault) {
      user.addresses.forEach((addr: any) => addr.isDefault = false);
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json(user.addresses);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
