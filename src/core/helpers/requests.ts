import { db } from '@jshop/core';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { v4 } from 'uuid';

export async function getDetailData(table: string, id: string) {
  try {
    const docRef = doc(db, table, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data: any = docSnap.data();
      return data;
    }
    return null;
  } catch (err: any) {
    return null;
  }
}

export async function submitData(table: string, values: any) {
  try {
    const newValues = {
      ...values,
      id: values?.id ?? v4(),
    };
    await setDoc(doc(db, table, newValues?.id), newValues);
    return newValues;
  } catch (err) {
    return null;
  }
}
