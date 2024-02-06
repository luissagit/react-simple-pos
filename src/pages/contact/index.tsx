import { Form, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IndexTable, rupiah } from '@jshop/core';

function FormComponent() {
  return (
    <>
      <Form.Item
        label="Code"
        name="code"
        rules={[{ required: true }]}
        normalize={(value) => (value ? value?.toUpperCase() : '')}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true }]}
        normalize={(value) => (value ? value?.toUpperCase() : '')}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="id" hidden noStyle />
      <Form.Item name="created_at" hidden noStyle />
      <Form.Item name="updated_at" hidden noStyle />
      <Form.Item name="creator_name" hidden noStyle />
      <Form.Item name="total_spend" hidden noStyle />
    </>
  );
}

export function Contact() {
  const columns: ColumnsType<any> = [
    {
      key: 'code',
      dataIndex: ['code'],
      title: 'Code',
    },
    {
      key: 'name',
      dataIndex: ['name'],
      title: 'Name',
    },
    {
      key: 'total_spend',
      dataIndex: ['total_spend'],
      title: 'Total Spend',
      render(value) {
        return rupiah(value ?? 0);
      },
    },
    {
      key: 'phone',
      dataIndex: ['phone'],
      title: 'Phone',
    },
    {
      key: 'address',
      dataIndex: ['address'],
      title: 'Address',
    },
  ];

  return <IndexTable title="Contact" table="contact" columns={columns} FormComponent={FormComponent} />;
}
