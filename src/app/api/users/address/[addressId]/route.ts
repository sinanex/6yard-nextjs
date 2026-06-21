import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

// PUT update an address
export async function PUT(req: NextRequest, { params }: { params: Promise<{ addressId: string }> }) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const user = await User.findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const addressId = (await params).addressId;
    const updateData = await req.json();

    const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    if (updateData.isDefault) {
      user.addresses.forEach((addr: any) => addr.isDefault = false);
    }

    // Update the address fields
    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...updateData };
    
    await user.save();
    return NextResponse.json(user.addresses);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// DELETE an address
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ addressId: string }> }) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const user = await User.findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const addressId = (await params).addressId;
    
    user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
    
    // If we deleted the default address, set the first remaining one as default
    if (user.addresses.length > 0 && !user.addresses.some((addr: any) => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return NextResponse.json(user.addresses);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
