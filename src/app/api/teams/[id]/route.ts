import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Team from '@/models/Team';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    verifyAuth(req);
    const { name } = await req.json();
    const id = (await params).id;
    const team = await Team.findByIdAndUpdate(id, { name }, { new: true });
    if (!team) return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    verifyAuth(req);
    const id = (await params).id;
    const team = await Team.findByIdAndDelete(id);
    if (!team) return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
