import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNotesActions, useNotesState } from "../store/NotesContext";
import "./styles.css";

function useDebouncedEffect(effect, deps, delay = 500) {
  const callback = useRef(effect);
  useEffect(() => { callback.current = effect; }, [effect]);
  useEffect(() => {
    const handler = setTimeout(() => callback.current(), delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// PUBLIC_INTERFACE
export default function NoteEditor() {
  /** Editor for the selected note with autosave for title/content/tags. */
  const { notes, selectedId } = useNotesState();
  const { updateNote } = useNotesActions();
  const current = useMemo(() => notes.find((n) => n.id === selectedId) || null, [notes, selectedId]);

  const [title, setTitle] = useState(current ? current.title : "");
  const [content, setContent] = useState(current ? current.content : "");
  const [tagsInput, setTagsInput] = useState(current ? (current.tags || []).join(", ") : "");

  useEffect(() => {
    setTitle(current ? current.title : "");
    setContent(current ? current.content : "");
    setTagsInput(current ? (current.tags || []).join(", ") : "");
  }, [current?.id]);

  useDebouncedEffect(() => {
    if (!current) return;
    const updates = {
      title,
      content,
      tags: String(tagsInput || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    updateNote(current.id, updates);
  }, [title, content, tagsInput], 600);

  if (!current) {
    return (
      <div className="editor empty-state">
        <div className="muted">Select or create a note to start writing.</div>
      </div>
    );
  }

  return (
    <div className="editor">
      <input
        className="editor-title"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Note title"
      />
      <textarea
        className="editor-content"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Note content"
      />
      <div className="editor-footer">
        <input
          className="input"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          aria-label="Tags"
        />
        <div className="muted small">Autosaving… changes are stored automatically.</div>
      </div>
    </div>
  );
}
