import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyAuth(request);

    if (!authResult.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const usage = await cloudinary.api.usage();
    return NextResponse.json(usage);
  } catch (error: any) {
    if (error.message === 'No token, authorization denied' || error.message === 'Token is not valid') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching Cloudinary usage:', error);
    return NextResponse.json({ message: 'Failed to fetch usage' }, { status: 500 });
  }
}
