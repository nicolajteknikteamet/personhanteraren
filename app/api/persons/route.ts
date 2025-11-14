import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const persons = db.persons.getAll();
  return NextResponse.json(persons);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const newPerson = db.persons.create(name, email);
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create person' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: 'ID, name, and email are required' },
        { status: 400 }
      );
    }

    const updatedPerson = db.persons.update(id, name, email);
    
    if (!updatedPerson) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPerson);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update person' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const deletedPerson = db.persons.delete(parseInt(id));
    
    if (!deletedPerson) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedPerson);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete person' },
      { status: 500 }
    );
  }
}
