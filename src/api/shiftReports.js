import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const SHIFT_REPORTS_COLLECTION = 'shiftReports';

export async function getAllShiftReports() {
  const colRef = collection(db, SHIFT_REPORTS_COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getShiftReportsByHouse(houseNumber) {
  const colRef = collection(db, SHIFT_REPORTS_COLLECTION);
  const q = query(colRef, where('house', '==', String(houseNumber)));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getShiftReport(id) {
  const docRef = doc(db, SHIFT_REPORTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function createShiftReport(data) {
  const colRef = collection(db, SHIFT_REPORTS_COLLECTION);
  const docRef = doc(colRef);
  await setDoc(docRef, data);
  return docRef.id;
}

export async function updateShiftReport(id, data) {
  const docRef = doc(db, SHIFT_REPORTS_COLLECTION, id);
  await updateDoc(docRef, data);
}

export async function deleteShiftReport(id) {
  const docRef = doc(db, SHIFT_REPORTS_COLLECTION, id);
  await deleteDoc(docRef);
} 