import { NextResponse } from 'next/server';
import { Location } from '@/types';

let locations: Location[] = [
  { id: 1, personId: 1, date: '2025-11-10', location: 'Stockholm Office' },
  { id: 2, personId: 1, date: '2025-11-11', location: 'Gothenburg Event' },
  { id: 3, personId: 2, date: '2025-11-10', location: 'Malmö Venue' },
  { id: 4, personId: 2, date: '2025-11-11', location: 'Remote' },
  { id: 5, personId: 3, date: '2025-11-10', location: 'Stockholm Office' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filteredLocations = locations;

  if (startDate && endDate) {
    filteredLocations = locations.filter(
      (loc) => loc.date >= startDate && loc.date <= endDate
    );
  }

  return NextResponse.json(filteredLocations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { personId, date, startDate, endDate, location } = body;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const updatedLocations: Location[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      const existingIndex = locations.findIndex(
        (loc) => loc.personId === personId && loc.date === dateStr
      );

      if (existingIndex >= 0) {
        locations[existingIndex].location = location;
        updatedLocations.push(locations[existingIndex]);
      } else {
        const newLocation: Location = {
          id: locations.length + 1,
          personId,
          date: dateStr,
          location,
        };
        locations.push(newLocation);
        updatedLocations.push(newLocation);
      }
    }

    return NextResponse.json(updatedLocations);
  }

  const existingIndex = locations.findIndex(
    (loc) => loc.personId === personId && loc.date === date
  );

  if (existingIndex >= 0) {
    locations[existingIndex].location = location;
    return NextResponse.json(locations[existingIndex]);
  } else {
    const newLocation: Location = {
      id: locations.length + 1,
      personId,
      date,
      location,
    };
    locations.push(newLocation);
    return NextResponse.json(newLocation);
  }
}
