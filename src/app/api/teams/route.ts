import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const teams = await Team.find().sort({ name: 1 });
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    verifyAuth(req);
    const { name } = await req.json();
    if (!name) return NextResponse.json({ message: 'Team name is required' }, { status: 400 });

    const existingTeam = await Team.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingTeam) return NextResponse.json({ message: 'Team already exists' }, { status: 400 });

    const team = new Team({ name });
    const savedTeam = await team.save();
    return NextResponse.json(savedTeam, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
