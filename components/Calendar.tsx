'use client';

import { useState, useEffect } from 'react';
import { Person, Location } from '@/types';
import styles from './Calendar.module.css';

interface CalendarProps {
  persons: Person[];
}

export default function Calendar({ persons }: CalendarProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [selectedCell, setSelectedCell] = useState<{ personId: number; date: string } | null>(null);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    fetchLocations();
  }, [currentWeekStart]);

  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function getWeekDates(): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  async function fetchLocations() {
    const weekDates = getWeekDates();
    const startDate = formatDate(weekDates[0]);
    const endDate = formatDate(weekDates[6]);

    const response = await fetch(`/api/locations?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    setLocations(data);
  }

  function getLocationForPersonAndDate(personId: number, date: string): string {
    const location = locations.find(
      (loc) => loc.personId === personId && loc.date === date
    );
    return location?.location || '-';
  }

  function previousWeek() {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  }

  function nextWeek() {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  }

  function currentWeek() {
    setCurrentWeekStart(getMonday(new Date()));
  }

  async function handleLocationUpdate() {
    if (!selectedCell || !newLocation.trim()) return;

    await fetch('/api/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personId: selectedCell.personId,
        date: selectedCell.date,
        location: newLocation,
      }),
    });

    setSelectedCell(null);
    setNewLocation('');
    fetchLocations();
  }

  const weekDates = getWeekDates();
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Personhanteraren</h1>
        <p className={styles.subtitle}>Soundforce Personnel Location Calendar</p>
      </div>

      <div className={styles.controls}>
        <button onClick={previousWeek} className={styles.button}>
          ← Previous Week
        </button>
        <button onClick={currentWeek} className={styles.buttonPrimary}>
          Current Week
        </button>
        <button onClick={nextWeek} className={styles.button}>
          Next Week →
        </button>
      </div>

      <div className={styles.weekInfo}>
        Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      <div className={styles.calendarWrapper}>
        <table className={styles.calendar}>
          <thead>
            <tr>
              <th className={styles.nameColumn}>Person</th>
              {weekDates.map((date, index) => (
                <th key={index} className={styles.dayColumn}>
                  <div className={styles.dayHeader}>
                    <div className={styles.dayName}>{dayNames[index]}</div>
                    <div className={styles.dayDate}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr key={person.id}>
                <td className={styles.nameCell}>{person.name}</td>
                {weekDates.map((date, index) => {
                  const dateStr = formatDate(date);
                  const location = getLocationForPersonAndDate(person.id, dateStr);
                  return (
                    <td
                      key={index}
                      className={styles.locationCell}
                      onClick={() => setSelectedCell({ personId: person.id, date: dateStr })}
                    >
                      {location}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <div className={styles.modal} onClick={() => setSelectedCell(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Update Location</h2>
            <p>
              Person: {persons.find((p) => p.id === selectedCell.personId)?.name}
            </p>
            <p>Date: {selectedCell.date}</p>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter location"
              className={styles.input}
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button onClick={handleLocationUpdate} className={styles.buttonPrimary}>
                Save
              </button>
              <button onClick={() => setSelectedCell(null)} className={styles.button}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
