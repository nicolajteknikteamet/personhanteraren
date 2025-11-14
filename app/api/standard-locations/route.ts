import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const standardLocations = db.standardLocations.getAll();
  return NextResponse.json(standardLocations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
  }

  const newLocation = db.standardLocations.create(name);
  return NextResponse.json(newLocation);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name } = body;

  if (!id || !name || !name.trim()) {
    return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
  }

  const updatedLocation = db.standardLocations.update(id, name);
  
  if (!updatedLocation) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  return NextResponse.json(updatedLocation);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const deletedLocation = db.standardLocations.delete(parseInt(id));
  
  if (!deletedLocation) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  return NextResponse.json(deletedLocation);
}
