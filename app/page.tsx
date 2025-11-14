import Calendar from '@/components/Calendar';

async function getPersons() {
  const res = await fetch('http://localhost:3000/api/persons', {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

export default async function Home() {
  const persons = await getPersons();

  return (
    <main>
      <Calendar persons={persons} />
    </main>
  );
}
