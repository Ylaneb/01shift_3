import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const FORM_FIELDS_COLLECTION = 'formFields';

export async function getAllFormFields() {
  const colRef = collection(db, FORM_FIELDS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getFormField(id) {
  const docRef = doc(db, FORM_FIELDS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function createFormField(id, data) {
  const docRef = doc(db, FORM_FIELDS_COLLECTION, id);
  await setDoc(docRef, data);
}

export async function updateFormField(id, data) {
  const docRef = doc(db, FORM_FIELDS_COLLECTION, id);
  await updateDoc(docRef, data);
}

export async function deleteFormField(id) {
  const docRef = doc(db, FORM_FIELDS_COLLECTION, id);
  await deleteDoc(docRef);
} 