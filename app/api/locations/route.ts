import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filteredLocations;

  if (startDate && endDate) {
    filteredLocations = db.locations.getByDateRange(startDate, endDate);
  } else {
    filteredLocations = db.locations.getAll();
  }

  return NextResponse.json(filteredLocations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { personId, date, startDate, endDate, location } = body;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const updatedLocations = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      const updatedLocation = db.locations.upsert({
        personId,
        date: dateStr,
        location,
      });
      
      updatedLocations.push(updatedLocation);
    }

    return NextResponse.json(updatedLocations);
  }

  const updatedLocation = db.locations.upsert({
    personId,
    date,
    location,
  });

  return NextResponse.json(updatedLocation);
}
