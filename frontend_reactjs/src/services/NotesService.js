//
// NotesService provides a consistent CRUD interface for notes,
// backed by localStorage by default, or a REST API if REACT_APP_API_BASE is set.
//
/**
 * A Note structure:
 * {
 *   id: string,
 *   title: string,
 *   content: string,
 *   tags: string[],
 *   createdAt: number,
 *   updatedAt: number
 * }
 */

const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * Utility to normalize and deduplicate tags
 * @param {string[]|string} tags
 * @returns {string[]}
 */
export function normalizeTags(tags) {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : String(tags).split(","); 
  return Array.from(
    new Set(
      list
        .map((t) => String(t).trim().toLowerCase())
        .filter((t) => t.length > 0)
    )
  );
}

/**
 * Simple fuzzy search: search in title/content/tags
 * @param {Array} notes
 * @param {string} query
 * @param {string[]} filterTags
 * @returns {Array}
 */
export function searchNotes(notes, query = "", filterTags = []) {
  const q = String(query || "").trim().toLowerCase();
  const ftags = normalizeTags(filterTags);

  return notes.filter((n) => {
    const haystack =
      `${n.title || ""} ${n.content || ""} ${(n.tags || []).join(" ")}`.toLowerCase();
    const matchQuery = q ? haystack.includes(q) : true;
    const matchTags =
      ftags.length > 0 ? ftags.every((t) => (n.tags || []).map((x) => x.toLowerCase()).includes(t)) : true;
    return matchQuery && matchTags;
  });
}

// Storage keys
const LS_KEY = "notes_app_items_v1";

/**
 * LocalStorage-based service
 */
class LocalStorageNotesService {
  _readAll() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  _writeAll(notes) {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  }

  // PUBLIC_INTERFACE
  async list() {
    /** List all notes from localStorage. */
    return this._readAll().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // PUBLIC_INTERFACE
  async get(id) {
    /** Get a single note by id. */
    return this._readAll().find((n) => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  async create(note) {
    /** Create a new note in localStorage. */
    const now = Date.now();
    const toCreate = {
      id: cryptoRandomId(),
      title: note.title || "",
      content: note.content || "",
      tags: normalizeTags(note.tags || []),
      createdAt: now,
      updatedAt: now,
    };
    const items = this._readAll();
    items.push(toCreate);
    this._writeAll(items);
    return toCreate;
  }

  // PUBLIC_INTERFACE
  async update(id, updates) {
    /** Update a note by id with partial fields. */
    const items = this._readAll();
    const idx = items.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    const now = Date.now();
    const updated = {
      ...items[idx],
      ...updates,
      tags: updates.tags ? normalizeTags(updates.tags) : items[idx].tags,
      updatedAt: now,
    };
    items[idx] = updated;
    this._writeAll(items);
    return updated;
  }

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Delete a note by id. */
    const items = this._readAll();
    const remaining = items.filter((n) => n.id !== id);
    this._writeAll(remaining);
    return { success: true };
  }
}

/**
 * REST-backed service. Expects the following endpoints at API_BASE:
 * - GET    /notes
 * - POST   /notes
 * - GET    /notes/:id
 * - PUT    /notes/:id
 * - DELETE /notes/:id
 */
class RestNotesService {
  async _fetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  // PUBLIC_INTERFACE
  async list() {
    /** List all notes from REST API. */
    return this._fetch(`/notes`);
  }

  // PUBLIC_INTERFACE
  async get(id) {
    /** Get a single note by id via REST API. */
    return this._fetch(`/notes/${encodeURIComponent(id)}`);
  }

  // PUBLIC_INTERFACE
  async create(note) {
    /** Create a new note via REST API. */
    const body = {
      ...note,
      tags: normalizeTags(note.tags || []),
    };
    return this._fetch(`/notes`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // PUBLIC_INTERFACE
  async update(id, updates) {
    /** Update a note by id via REST API. */
    const body = {
      ...updates,
      ...(updates.tags ? { tags: normalizeTags(updates.tags) } : {}),
    };
    return this._fetch(`/notes/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  // PUBLIC_INTERFACE
  async remove(id) {
    /** Delete a note by id via REST API. */
    await this._fetch(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
    return { success: true };
  }
}

/**
 * Generate a cryptographically strong pseudo-random ID (fallback to Math.random if needed).
 */
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

// PUBLIC_INTERFACE
export function getNotesService() {
  /** Returns a NotesService instance based on environment configuration. */
  if (API_BASE && API_BASE.trim().length > 0) {
    return new RestNotesService();
  }
  return new LocalStorageNotesService();
}
