import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Message {
  id: string;
  text: string;
  guestName?: string;
  senderId?: string;
  /** Se true ou ausente, o nome aparece no mural. Se false, mostra "Anônimo" publicamente (o nome continua salvo). */
  showNameOnWall?: boolean;
  createdAt: Timestamp | null;
}

const messagesRef = collection(db, 'messages');

export async function sendMessage(
  text: string,
  guestName?: string,
  senderId?: string,
  showNameOnWall = true,
): Promise<void> {
  await addDoc(messagesRef, {
    text,
    guestName: guestName ?? '',
    senderId: senderId ?? '',
    showNameOnWall,
    createdAt: serverTimestamp(),
  });
}

export async function deleteMessage(docId: string): Promise<void> {
  await deleteDoc(doc(db, 'messages', docId));
}

export function subscribeToMessages(
  callback: (messages: Message[]) => void,
): () => void {
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        text: d.text as string,
        guestName: (d.guestName as string) || undefined,
        senderId: (d.senderId as string) || undefined,
        showNameOnWall: d.showNameOnWall === false ? false : true,
        createdAt: (d.createdAt as Timestamp) ?? null,
      };
    });
    callback(messages);
  });
}
