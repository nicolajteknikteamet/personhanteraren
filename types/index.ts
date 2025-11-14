export interface Person {
  id: number;
  name: string;
  email: string;
}

export interface Location {
  id: number;
  personId: number;
  date: string;
  location: string;
}

export interface WeekLocation {
  personId: number;
  personName: string;
  locations: {
    [date: string]: string;
  };
}
