'use client';

import { useState, useEffect } from 'react';
import { StandardLocation } from '@/types';
import styles from './admin.module.css';

export default function AdminPage() {
  const [standardLocations, setStandardLocations] = useState<StandardLocation[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newLocationName, setNewLocationName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchStandardLocations();
  }, []);

  async function fetchStandardLocations() {
    const response = await fetch('/api/standard-locations');
    const data = await response.json();
    setStandardLocations(data);
  }

  async function handleAdd() {
    if (!newLocationName.trim()) return;

    const response = await fetch('/api/standard-locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newLocationName }),
    });

    if (response.ok) {
      setNewLocationName('');
      setIsAdding(false);
      fetchStandardLocations();
    }
  }

  async function handleUpdate(id: number) {
    if (!editingName.trim()) return;

    const response = await fetch('/api/standard-locations', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name: editingName }),
    });

    if (response.ok) {
      setEditingId(null);
      setEditingName('');
      fetchStandardLocations();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this location?')) return;

    const response = await fetch(`/api/standard-locations?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchStandardLocations();
    }
  }

  function startEdit(location: StandardLocation) {
    setEditingId(location.id);
    setEditingName(location.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Standard Locations</h1>
        <p className={styles.subtitle}>Add, edit, or remove standard locations for the calendar</p>
      </div>

      <div className={styles.actions}>
        <a href="/" className={styles.backButton}>
          ← Back to Calendar
        </a>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className={styles.buttonPrimary}>
            + Add New Location
          </button>
        )}
      </div>

      {isAdding && (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Enter location name"
            className={styles.input}
            autoFocus
          />
          <div className={styles.formButtons}>
            <button onClick={handleAdd} className={styles.buttonPrimary}>
              Add
            </button>
            <button onClick={() => {
              setIsAdding(false);
              setNewLocationName('');
            }} className={styles.button}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.locationsList}>
        {standardLocations.length === 0 ? (
          <p className={styles.emptyMessage}>No standard locations yet. Add one to get started!</p>
        ) : (
          <ul className={styles.list}>
            {standardLocations.map((location) => (
              <li key={location.id} className={styles.listItem}>
                {editingId === location.id ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className={styles.input}
                      autoFocus
                    />
                    <div className={styles.itemButtons}>
                      <button onClick={() => handleUpdate(location.id)} className={styles.buttonPrimary}>
                        Save
                      </button>
                      <button onClick={cancelEdit} className={styles.button}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.itemContent}>
                    <span className={styles.locationName}>{location.name}</span>
                    <div className={styles.itemButtons}>
                      <button onClick={() => startEdit(location)} className={styles.buttonEdit}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(location.id)} className={styles.buttonDelete}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
