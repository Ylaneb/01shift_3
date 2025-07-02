import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export async function getUser(uid) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
}

export async function createUser(uid, data) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(userRef, data);
}

export async function updateUser(uid, data) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, data);
}

export async function deleteUser(uid) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await deleteDoc(userRef);
} 