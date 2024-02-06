import { db } from '@jshop/core';
import { notification } from 'antd';
import { doc, updateDoc } from 'firebase/firestore';

export async function requestSave(payload: any) {
  try {
    await updateDoc(doc(db, 'company', payload?.id), payload);
    notification.success({
      message: 'Success save setting',
    });
  } catch (err: any) {
    notification.error({
      message: err?.message,
    });
  }
}
