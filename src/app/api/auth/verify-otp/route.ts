import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ message: 'Phone and OTP are required' }, { status: 400 });
    }

    // Mock verification
    if (otp !== '0000') {
      return NextResponse.json({ message: 'Invalid OTP. Use 0000' }, { status: 400 });
    }

    let user = await (User as any).findOne({ phone });

    if (!user) {
      // Create new user since they don't exist
      user = new User({
        phone,
        role: 'user',
        // Provide dummy name/email or leave undefined since they are optional in schema
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' } // Extended expiration for better checkout flow
    );

    return NextResponse.json({
      message: 'Verified successfully',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
