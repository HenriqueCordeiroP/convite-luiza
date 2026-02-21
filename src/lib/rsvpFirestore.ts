import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from './firebase';

interface RsvpData {
  name?: string;
  hasGuest?: boolean;
  guestName?: string;
  declined?: boolean;
}

export interface RsvpDoc {
  id: string;
  name: string;
  hasGuest: boolean;
  guestName: string;
  declined?: boolean;
  createdAt?: { seconds: number } | null;
}

export async function saveRsvpToFirestore(data: RsvpData): Promise<void> {
  await addDoc(collection(db, 'rsvps'), {
    name: data.name ?? '',
    hasGuest: data.hasGuest ?? false,
    guestName: data.guestName ?? '',
    declined: data.declined ?? false,
    createdAt: serverTimestamp(),
  });
}

export async function getAllRsvps(): Promise<RsvpDoc[]> {
  const snapshot = await getDocs(collection(db, 'rsvps'));
  const docs = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      name: (d.name as string) ?? '',
      hasGuest: (d.hasGuest as boolean) ?? false,
      guestName: (d.guestName as string) ?? '',
      declined: (d.declined as boolean) ?? false,
      createdAt: d.createdAt ?? null,
    };
  });
  docs.sort((a, b) => {
    const tA = a.createdAt?.seconds ?? 0;
    const tB = b.createdAt?.seconds ?? 0;
    return tA - tB;
  });
  return docs;
}
