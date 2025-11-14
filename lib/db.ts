import fs from 'fs';
import path from 'path';
import { Person, Location, StandardLocation } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

interface Database {
  persons: Person[];
  locations: Location[];
  standardLocations: StandardLocation[];
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(collection: keyof Database): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection<T>(collection: keyof Database): T[] {
  ensureDataDir();
  const filePath = getFilePath(collection);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading ${collection}:`, error);
    return [];
  }
}

function writeCollection<T>(collection: keyof Database, data: T[]): void {
  ensureDataDir();
  const filePath = getFilePath(collection);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${collection}:`, error);
    throw error;
  }
}

export const db = {
  persons: {
    getAll: (): Person[] => readCollection<Person>('persons'),
    save: (persons: Person[]): void => writeCollection('persons', persons),
    
    create: (name: string, email: string): Person => {
      const allPersons = readCollection<Person>('persons');
      const newPerson: Person = {
        id: allPersons.length > 0 ? Math.max(...allPersons.map(p => p.id)) + 1 : 1,
        name: name.trim(),
        email: email.trim(),
      };
      allPersons.push(newPerson);
      writeCollection('persons', allPersons);
      return newPerson;
    },
    
    update: (id: number, name: string, email: string): Person | null => {
      const allPersons = readCollection<Person>('persons');
      const index = allPersons.findIndex(p => p.id === id);
      
      if (index === -1) {
        return null;
      }
      
      allPersons[index].name = name.trim();
      allPersons[index].email = email.trim();
      writeCollection('persons', allPersons);
      return allPersons[index];
    },
    
    delete: (id: number): Person | null => {
      const allPersons = readCollection<Person>('persons');
      const index = allPersons.findIndex(p => p.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const deleted = allPersons.splice(index, 1)[0];
      writeCollection('persons', allPersons);
      return deleted;
    },
  },
  
  locations: {
    getAll: (): Location[] => readCollection<Location>('locations'),
    save: (locations: Location[]): void => writeCollection('locations', locations),
    
    getByDateRange: (startDate: string, endDate: string): Location[] => {
      const allLocations = readCollection<Location>('locations');
      return allLocations.filter(
        (loc) => loc.date >= startDate && loc.date <= endDate
      );
    },
    
    findByPersonAndDate: (personId: number, date: string): Location | undefined => {
      const allLocations = readCollection<Location>('locations');
      return allLocations.find(
        (loc) => loc.personId === personId && loc.date === date
      );
    },
    
    upsert: (location: Omit<Location, 'id'>): Location => {
      const allLocations = readCollection<Location>('locations');
      const existingIndex = allLocations.findIndex(
        (loc) => loc.personId === location.personId && loc.date === location.date
      );
      
      if (existingIndex >= 0) {
        allLocations[existingIndex] = {
          ...allLocations[existingIndex],
          location: location.location,
        };
        writeCollection('locations', allLocations);
        return allLocations[existingIndex];
      } else {
        const newLocation: Location = {
          id: allLocations.length > 0 ? Math.max(...allLocations.map(l => l.id)) + 1 : 1,
          personId: location.personId,
          date: location.date,
          location: location.location,
        };
        allLocations.push(newLocation);
        writeCollection('locations', allLocations);
        return newLocation;
      }
    },
  },
  
  standardLocations: {
    getAll: (): StandardLocation[] => readCollection<StandardLocation>('standardLocations'),
    save: (locations: StandardLocation[]): void => writeCollection('standardLocations', locations),
    
    create: (name: string): StandardLocation => {
      const allLocations = readCollection<StandardLocation>('standardLocations');
      const newLocation: StandardLocation = {
        id: allLocations.length > 0 ? Math.max(...allLocations.map(l => l.id)) + 1 : 1,
        name: name.trim(),
      };
      allLocations.push(newLocation);
      writeCollection('standardLocations', allLocations);
      return newLocation;
    },
    
    update: (id: number, name: string): StandardLocation | null => {
      const allLocations = readCollection<StandardLocation>('standardLocations');
      const index = allLocations.findIndex(loc => loc.id === id);
      
      if (index === -1) {
        return null;
      }
      
      allLocations[index].name = name.trim();
      writeCollection('standardLocations', allLocations);
      return allLocations[index];
    },
    
    delete: (id: number): StandardLocation | null => {
      const allLocations = readCollection<StandardLocation>('standardLocations');
      const index = allLocations.findIndex(loc => loc.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const deleted = allLocations.splice(index, 1)[0];
      writeCollection('standardLocations', allLocations);
      return deleted;
    },
  },
};
