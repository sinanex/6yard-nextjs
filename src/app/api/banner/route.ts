import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Banner from '@/models/Banner';
import { verifyAuth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    await dbConnect();
    const banners = await (Banner as any).find().sort({ createdAt: -1 });
    if (banners.length === 0) {
      const defaultBanner = new Banner({
        title: 'Wear Your Passion',
        subtitle: 'Experience the game in peak performance gear. Engineered for the fans, designed for the pros.',
        imageUrl: 'https://images.unsplash.com/photo-1541002442-9f5985aa8023',
        buttonText: 'Shop Now'
      });
      await defaultBanner.save();
      return NextResponse.json([defaultBanner]);
    }
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = verifyAuth(req);
    if (!auth.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const buttonText = formData.get('buttonText') as string;
    const linkUrl = formData.get('linkUrl') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = '';
    if (image) {
      imageUrl = await uploadToCloudinary(image, 'kitbay/banners');
    }

    if (!imageUrl) {
      return NextResponse.json({ message: 'Banner image is required' }, { status: 400 });
    }

    const newBanner = new Banner({ title, subtitle, buttonText, imageUrl, linkUrl });
    await newBanner.save();
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
