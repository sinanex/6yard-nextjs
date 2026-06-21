import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const user = await User.findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    const { name, email } = await req.json();
    const user = await User.findById(auth.user.userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
