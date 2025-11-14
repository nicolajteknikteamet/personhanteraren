import { NextResponse } from 'next/server';
import { StandardLocation } from '@/types';

let standardLocations: StandardLocation[] = [
  { id: 1, name: 'Stockholm Office' },
  { id: 2, name: 'Gothenburg Event' },
  { id: 3, name: 'Malmö Venue' },
  { id: 4, name: 'Remote' },
  { id: 5, name: 'Uppsala Concert Hall' },
  { id: 6, name: 'Linköping Arena' },
];

export async function GET() {
  return NextResponse.json(standardLocations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
  }

  const newLocation: StandardLocation = {
    id: standardLocations.length > 0 ? Math.max(...standardLocations.map(l => l.id)) + 1 : 1,
    name: name.trim(),
  };

  standardLocations.push(newLocation);
  return NextResponse.json(newLocation);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name } = body;

  if (!id || !name || !name.trim()) {
    return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
  }

  const index = standardLocations.findIndex(loc => loc.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  standardLocations[index].name = name.trim();
  return NextResponse.json(standardLocations[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const index = standardLocations.findIndex(loc => loc.id === parseInt(id));
  if (index === -1) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  const deleted = standardLocations.splice(index, 1)[0];
  return NextResponse.json(deleted);
}
