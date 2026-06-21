import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    
    if (!phone || phone.length < 10) {
      return NextResponse.json({ message: 'Valid phone number required' }, { status: 400 });
    }

    // In a real application, you would integrate an SMS provider here (e.g., Twilio, AWS SNS)
    // For now, we mock success and expect '0000' during verification
    console.log(`Sending mock OTP to ${phone}`);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
