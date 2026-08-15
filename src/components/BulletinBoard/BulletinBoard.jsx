import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './BulletinBoard.module.css';

function BulletinBoard() {
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState('');
  const [noteText, setNoteText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const colors = [
    '--color-bg-beige',
    '--color-bg-peach',
    '--color-bg-sage',
    '--color-bg-mint',
    '--color-bg-lavender',
  ];

  // Fetch notes from Supabase
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bulletin_board_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !noteText.trim()) {
      alert('Please fill in both name and note fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bulletin_board_notes')
        .insert([
          {
            name: name.trim(),
            content: noteText.trim(),
          },
        ])
        .select();

      if (error) throw error;

      setNotes([data[0], ...notes]);
      setName('');
      setNoteText('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get random color for each note
  const getColorForNote = (index) => {
    return colors[index % colors.length];
  };

  return (
    <div className={styles.bulletinBoard}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Your Opinion Matters</h1>
          <p>Share your feedback and see what others think!</p>
        </div>

        {/* Form Section */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h2>Add Your Note</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength="50"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="note">Your Feedback</label>
                <textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write your feedback here..."
                  rows="4"
                  maxLength="300"
                />
                <span className={styles.charCount}>{noteText.length}/300</span>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Note
              </button>
              {submitted && <p className={styles.successMsg}>Note added! 🎉</p>}
            </form>
          </div>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search notes by content or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <p className={styles.searchInfo}>
              Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Board Display */}
        <div className={styles.boardSection}>
          <h2>Board</h2>
          {loading ? (
            <p className={styles.loadingMsg}>Loading notes...</p>
          ) : filteredNotes.length === 0 ? (
            <p className={styles.emptyMsg}>
              {notes.length === 0
                ? 'No notes yet. Be the first to share your feedback!'
                : 'No notes match your search.'}
            </p>
          ) : (
            <div className={styles.notesGrid}>
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className={styles.noteCard}
                  style={{
                    backgroundColor: `var(${getColorForNote(index)})`,
                  }}
                >
                  <div className={styles.noteContent}>{note.content}</div>
                  <div className={styles.noteName}>— {note.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulletinBoard;
