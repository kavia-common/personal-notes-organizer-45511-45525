import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import { NotesProvider, useNotesActions, useNotesState } from './store/NotesContext';

// PUBLIC_INTERFACE
function Layout() {
  /** Main layout controlling sidebar collapse and hash-based selection. */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { selectedId } = useNotesState();
  const { select } = useNotesActions();

  // Hash-based routing for selected note id. Example: #/note/<id>
  useEffect(() => {
    const applyFromHash = () => {
      const hash = window.location.hash || '';
      const m = hash.match(/#\/note\/(.+)/);
      if (m && m[1]) {
        select(m[1]);
      }
    };
    applyFromHash();
    window.addEventListener('hashchange', applyFromHash);
    return () => window.removeEventListener('hashchange', applyFromHash);
  }, [select]);

  // Keep URL hash in sync when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      if (window.location.hash) window.location.hash = '';
      return;
    }
    const desired = `#/note/${selectedId}`;
    if (window.location.hash !== desired) {
      window.location.hash = desired;
    }
  }, [selectedId]);

  return (
    <>
      <Header />
      <main className="layout" role="main">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
        <NoteEditor />
      </main>
    </>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root application entry wrapped with NotesProvider. */
  // Apply app background on body
  useEffect(() => {
    document.body.style.background = '#f9fafb';
    document.body.style.color = '#111827';
  }, []);

  return (
    <NotesProvider>
      <Layout />
    </NotesProvider>
  );
}

export default App;
