import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { getNotesService, searchNotes } from "../services/NotesService";

const NotesStateContext = createContext(null);
const NotesDispatchContext = createContext(null);

const initialState = {
  notes: [],
  filtered: [],
  selectedId: null,
  query: "",
  filterTags: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.error };
    case "SET_NOTES": {
      const filtered = searchNotes(action.notes, state.query, state.filterTags);
      return { ...state, loading: false, error: null, notes: action.notes, filtered };
    }
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "SET_QUERY": {
      const filtered = searchNotes(state.notes, action.query, state.filterTags);
      return { ...state, query: action.query, filtered };
    }
    case "SET_FILTER_TAGS": {
      const filtered = searchNotes(state.notes, state.query, action.tags || []);
      return { ...state, filterTags: action.tags || [], filtered };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provides notes state and actions to children components. */
  const [state, dispatch] = useReducer(reducer, initialState);
  const service = useMemo(() => getNotesService(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const items = await service.list();
        if (!mounted) return;
        dispatch({ type: "SET_NOTES", notes: items });
        if (items.length > 0) {
          dispatch({ type: "SELECT", id: items[0].id });
        }
      } catch (e) {
        dispatch({ type: "SET_ERROR", error: e.message || "Failed to load notes" });
      }
    })();
    return () => { mounted = false; };
  }, [service]);

  const actions = useMemo(() => {
    return {
      // PUBLIC_INTERFACE
      async createNote() {
        /** Create a new blank note and select it. */
        const n = await service.create({ title: "Untitled", content: "", tags: [] });
        const notes = await service.list();
        dispatch({ type: "SET_NOTES", notes });
        dispatch({ type: "SELECT", id: n.id });
        return n;
      },
      // PUBLIC_INTERFACE
      async deleteNote(id) {
        /** Delete a note by id and manage selection. */
        await service.remove(id);
        const notes = await service.list();
        dispatch({ type: "SET_NOTES", notes });
        if (notes.length > 0) {
          const next = notes[0].id;
          dispatch({ type: "SELECT", id: next });
          return;
        }
        dispatch({ type: "SELECT", id: null });
      },
      // PUBLIC_INTERFACE
      async updateNote(id, updates) {
        /** Update a note by id; partial updates allowed. */
        await service.update(id, updates);
        const notes = await service.list();
        dispatch({ type: "SET_NOTES", notes });
      },
      // PUBLIC_INTERFACE
      select(id) {
        /** Select a note by id. */
        dispatch({ type: "SELECT", id });
      },
      // PUBLIC_INTERFACE
      setQuery(q) {
        /** Set search query for filtering notes. */
        dispatch({ type: "SET_QUERY", query: q });
      },
      // PUBLIC_INTERFACE
      setFilterTags(tags) {
        /** Set tag filters for notes list. */
        dispatch({ type: "SET_FILTER_TAGS", tags });
      },
    };
  }, [service]);

  return (
    <NotesStateContext.Provider value={state}>
      <NotesDispatchContext.Provider value={actions}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useNotesState() {
  /** Access notes state from context. */
  const ctx = useContext(NotesStateContext);
  if (!ctx) throw new Error("useNotesState must be used within NotesProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function useNotesActions() {
  /** Access notes actions from context. */
  const ctx = useContext(NotesDispatchContext);
  if (!ctx) throw new Error("useNotesActions must be used within NotesProvider");
  return ctx;
}
