'use client';

import { useState, useEffect } from 'react';
import { Person } from '@/types';
import styles from './persons.module.css';

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingEmail, setEditingEmail] = useState('');
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPersons();
  }, []);

  async function fetchPersons() {
    const response = await fetch('/api/persons');
    const data = await response.json();
    setPersons(data);
  }

  async function handleAdd() {
    if (!newPersonName.trim() || !newPersonEmail.trim()) return;

    const response = await fetch('/api/persons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newPersonName, email: newPersonEmail }),
    });

    if (response.ok) {
      setNewPersonName('');
      setNewPersonEmail('');
      setIsAdding(false);
      fetchPersons();
    }
  }

  async function handleUpdate(id: number) {
    if (!editingName.trim() || !editingEmail.trim()) return;

    const response = await fetch('/api/persons', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name: editingName, email: editingEmail }),
    });

    if (response.ok) {
      setEditingId(null);
      setEditingName('');
      setEditingEmail('');
      fetchPersons();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this person? This will also remove all their location data.')) return;

    const response = await fetch(`/api/persons?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchPersons();
    }
  }

  function startEdit(person: Person) {
    setEditingId(person.id);
    setEditingName(person.name);
    setEditingEmail(person.email);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName('');
    setEditingEmail('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Persons</h1>
        <p className={styles.subtitle}>Add, edit, or remove persons from the system</p>
      </div>

      <div className={styles.actions}>
        <a href="/" className={styles.backButton}>
          ← Back to Calendar
        </a>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className={styles.buttonPrimary}>
            + Add New Person
          </button>
        )}
      </div>

      {isAdding && (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            placeholder="Enter person name"
            className={styles.input}
            autoFocus
          />
          <input
            type="email"
            value={newPersonEmail}
            onChange={(e) => setNewPersonEmail(e.target.value)}
            placeholder="Enter email address"
            className={styles.input}
          />
          <div className={styles.formButtons}>
            <button onClick={handleAdd} className={styles.buttonPrimary}>
              Add
            </button>
            <button onClick={() => {
              setIsAdding(false);
              setNewPersonName('');
              setNewPersonEmail('');
            }} className={styles.button}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.personsList}>
        {persons.length === 0 ? (
          <p className={styles.emptyMessage}>No persons yet. Add one to get started!</p>
        ) : (
          <ul className={styles.list}>
            {persons.map((person) => (
              <li key={person.id} className={styles.listItem}>
                {editingId === person.id ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className={styles.input}
                      autoFocus
                    />
                    <input
                      type="email"
                      value={editingEmail}
                      onChange={(e) => setEditingEmail(e.target.value)}
                      className={styles.input}
                    />
                    <div className={styles.itemButtons}>
                      <button onClick={() => handleUpdate(person.id)} className={styles.buttonPrimary}>
                        Save
                      </button>
                      <button onClick={cancelEdit} className={styles.button}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.itemContent}>
                    <div className={styles.personInfo}>
                      <span className={styles.personName}>{person.name}</span>
                      <span className={styles.personEmail}>{person.email}</span>
                    </div>
                    <div className={styles.itemButtons}>
                      <button onClick={() => startEdit(person)} className={styles.buttonEdit}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(person.id)} className={styles.buttonDelete}>
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
