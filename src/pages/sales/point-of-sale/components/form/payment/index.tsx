import { companyState, db, rupiah, userState } from '@jshop/core';
import {
  Button,
  Card, Descriptions, DescriptionsProps, Form, FormInstance, InputNumber, Spin, notification,
} from 'antd';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';

export function FormPayment() {
  const [user] = useRecoilState(userState);
  const [company] = useRecoilState(companyState);
  const [loading, setLoading] = useState(false);
  const items: DescriptionsProps['items'] = [
    {
      key: 'sub_total',
      label: 'Subtotal',
      span: 24,
      children: (
        <Form.Item shouldUpdate noStyle>
          {({ getFieldsValue }) => {
            const values = getFieldsValue();
            return (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {rupiah(values?.sub_total ?? 0)}
              </div>
            );
          }}
        </Form.Item>
      ),
    },
    {
      key: 'ppn',
      label: 'PPN',
      span: 24,
      children: (
        <Form.Item shouldUpdate noStyle>
          {({ getFieldsValue }) => {
            const values = getFieldsValue();
            return (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {rupiah(values?.ppn ?? 0)}
              </div>
            );
          }}
        </Form.Item>
      ),
    },
    {
      key: 'net_price',
      label: 'Net Price',
      span: 24,
      children: (
        <Form.Item shouldUpdate noStyle>
          {({ getFieldsValue }) => {
            const values = getFieldsValue();
            return (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {rupiah(values?.net_price ?? 0)}
              </div>
            );
          }}
        </Form.Item>
      ),
    },
    {
      key: 'payment',
      label: 'Payment',
      span: 24,
      contentStyle: { padding: 0 },
      children: (
        <Form.Item name="payment">
          <InputNumber style={{ width: '100%', fontSize: 26, textAlign: 'right' }} />
        </Form.Item>
      ),
    },
    {
      key: 'change_due',
      label: 'Change Due',
      span: 24,
      children: (
        <Form.Item shouldUpdate noStyle>
          {({ getFieldsValue }) => {
            const values = getFieldsValue();
            const payment = values?.payment ?? 0;
            const netPrice = values?.net_price ?? 0;
            const changeDue = payment - netPrice;
            return (
              <div style={{ textAlign: 'right', width: '100%' }}>
                {rupiah(changeDue ?? 0)}
              </div>
            );
          }}
        </Form.Item>
      ),
    },
  ];

  async function handleSubmit(form: FormInstance, status: string) {
    try {
      setLoading(true);
      await form.validateFields();
      const values = form.getFieldsValue();
      const payment = values?.payment ?? 0;
      const netPrice = values?.net_price ?? 0;
      const changeDue = payment - netPrice;
      const uuid = values?.id ?? v4();
      const newValue = {
        ...values,
        id: uuid,
        code: `SSO${uuid?.substr((uuid?.length ?? 0) - 5)?.toUpperCase()}`,
        status,
        company,
        change_due: changeDue ?? 0,
      };
      const userName = user?.email?.split('@')[0];
      if (values?.id) {
        Object.assign(newValue, {
          edited_at: new Date().getTime(),
          editor_name: userName,
          creator_id: user?.uid ?? user?.id,
        });
      }
      if (!values?.id) {
        Object.assign(newValue, {
          created_at: new Date().getTime(),
          creator_name: userName,
          creator_id: user?.uid ?? user?.id,
        });
      }
      if (status === 'posted' && (!values?.payment)) {
        notification.error({ message: 'Please input payment!' });
        return;
      }
      if (status === 'posted' && values?.payment < values?.net_price) {
        notification.error({ message: 'Payment couldnot less than total sales' });
        return;
      }
      await setDoc(doc(db, 'sales_orders', newValue?.id ?? v4()), newValue);
      form.resetFields();
    } catch (err: any) {
      notification.error({ message: err?.errorFields?.[0]?.errors?.[0] ?? err?.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Spin spinning={loading}>
      <Card
        style={{ height: '80vh' }}
        actions={[
          <Form.Item shouldUpdate noStyle key="action">
            {(form) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button onClick={() => handleSubmit(form, 'posted')} key="post" style={{ fontSize: 26, padding: 0, height: '50px' }}>POST</Button>
                <Button onClick={() => handleSubmit(form, 'draft')} key="save_draft" style={{ fontSize: 26, padding: 0, height: '50px' }}>SAVE DRAFT</Button>
              </div>
            )}
          </Form.Item>,
        ]}
      >
        <Descriptions
          items={items}
          contentStyle={{ fontSize: 24 }}
          labelStyle={{ fontSize: 20 }}
          bordered
        />
        <Form.Item name="sub_total" noStyle />
        <Form.Item name="ppn" noStyle />
        <Form.Item name="net_price" noStyle />
        <Form.Item name="id" noStyle />
        <Form.Item name="company" hidden />
        <Form.Item name="created_at" hidden />
        <Form.Item name="creator_name" hidden />
        <Form.Item name="creator_id" hidden />
      </Card>
    </Spin>
  );
}
