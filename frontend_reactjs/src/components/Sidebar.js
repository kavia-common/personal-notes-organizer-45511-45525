import React, { useMemo, useState } from "react";
import { useNotesActions, useNotesState } from "../store/NotesContext";
import "./styles.css";

// PUBLIC_INTERFACE
export default function Sidebar({ collapsed, onToggle }) {
  /** Sidebar shows search, tags filter, notes list, and new note button. */
  const { filtered, selectedId, query, filterTags, loading } = useNotesState();
  const { setQuery, setFilterTags, select, createNote, deleteNote } = useNotesActions();
  const [tagsInput, setTagsInput] = useState(filterTags.join(", "));

  const notes = useMemo(() => filtered, [filtered]);

  const handleTagsApply = () => {
    const tags = String(tagsInput || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFilterTags(tags);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="btn btn-secondary mobile-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? "☰" : "×"}
        </button>
        <button className="btn btn-primary" onClick={createNote}>+ New Note</button>
      </div>

      <div className="sidebar-controls">
        <input
          className="input"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes"
        />
        <div className="tag-filter">
          <input
            className="input"
            placeholder="Filter tags (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onBlur={handleTagsApply}
            aria-label="Filter tags"
          />
          <button className="btn btn-light" onClick={handleTagsApply}>Apply</button>
        </div>
      </div>

      <div className="notes-list" role="list" aria-busy={loading}>
        {loading && <div className="muted">Loading…</div>}
        {!loading && notes.length === 0 && <div className="muted">No notes found</div>}
        {notes.map((n) => (
          <div
            key={n.id}
            role="listitem"
            className={`note-item ${selectedId === n.id ? "active" : ""}`}
            onClick={() => select(n.id)}
          >
            <div className="note-item-main">
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-preview">{(n.content || "").slice(0, 80)}</div>
              {n.tags && n.tags.length > 0 && (
                <div className="note-tags">
                  {n.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <button
              className="icon-btn"
              title="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                // simple confirm
                if (window.confirm("Delete this note?")) deleteNote(n.id);
              }}
              aria-label="Delete note"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
