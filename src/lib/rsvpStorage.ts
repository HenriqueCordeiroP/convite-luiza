import { RSVP_STORAGE_KEY, type RsvpStorage } from '@/components/shared/constants';
import { saveRsvpToFirestore } from './rsvpFirestore';

/** Gera UUID de forma segura - Safari iOS pode não ter crypto.randomUUID */
function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // fallthrough
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getStorage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // Safari privado pode lançar ao acessar localStorage
  }
  return null;
}

function getSessionStorage(): Storage | null {
  try {
    if (typeof sessionStorage !== 'undefined') return sessionStorage;
  } catch {
    // ignore
  }
  return null;
}

function readFromStorage(storage: Storage): RsvpStorage | null {
  try {
    const raw = storage.getItem(RSVP_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as RsvpStorage;
    return (data?.confirmed || data?.declined) ? data : null;
  } catch {
    return null;
  }
}

export function getStoredRsvp(): RsvpStorage | null {
  const storage = getStorage();
  if (storage) {
    const data = readFromStorage(storage);
    if (data) return data;
  }
  // Fallback: sessionStorage (Safari privado - ao menos funciona na sessão)
  const session = getSessionStorage();
  if (session) return readFromStorage(session);
  return null;
}

/** Garante que o RSVP armazenado tenha um senderId; retorna o atualizado. */
export function ensureSenderId(rsvp: RsvpStorage): RsvpStorage {
  if (rsvp.senderId) return rsvp;
  const senderId = generateId();
  const updated = { ...rsvp, senderId };
  const storage = getStorage() ?? getSessionStorage();
  if (storage) {
    try {
      storage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}

function writeToStorage(data: RsvpStorage): boolean {
  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(RSVP_STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      // Safari privado: localStorage pode lançar
    }
  }
  const session = getSessionStorage();
  if (session) {
    try {
      session.setItem(RSVP_STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      // ignore
    }
  }
  return false;
}

export function saveRsvp(data: Omit<RsvpStorage, 'confirmed' | 'senderId'> & { confirmed: true }) {
  const existing = getStoredRsvp();
  const senderId = existing?.senderId ?? generateId();
  const full: RsvpStorage = { ...data, confirmed: true, declined: false, senderId };
  writeToStorage(full);

  saveRsvpToFirestore(data).catch(() => {
    // fire-and-forget: Firestore failure doesn't affect local UX
  });
}

export function saveDecline(data: { name?: string }) {
  const existing = getStoredRsvp();
  const senderId = existing?.senderId ?? generateId();
  const full: RsvpStorage = { confirmed: false, declined: true, name: data.name, senderId };
  writeToStorage(full);

  saveRsvpToFirestore({ ...data, declined: true }).catch(() => {
    // fire-and-forget
  });
}
