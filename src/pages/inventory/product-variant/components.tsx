import { db } from '@jshop/core';
import { InputNumber, Spin, notification } from 'antd';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function StockOpname({ record }: any) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  async function onKeyDown(event: any) {
    try {
      setLoading(true);
      if (event?.key?.toLowerCase().includes('enter')) {
        event.preventDefault();
        const newValue = event.target.value;
        await setDoc(doc(db, 'product_variant', record?.id), {
          ...record,
          stock_available: newValue,
        });
        setValue(newValue);
      }
    } catch (err: any) {
      notification.error({
        message: err?.message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setValue(record?.stock_available ?? 0);
  }, [record?.stock_available]);
  return (
    <Spin spinning={loading}>
      <InputNumber value={value ?? 0} onKeyDown={onKeyDown} />
    </Spin>
  );
}
