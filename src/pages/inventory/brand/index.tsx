import { Form, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IndexTable } from '@jshop/core';

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
      <Form.Item name="id" hidden noStyle />
      <Form.Item name="created_at" hidden noStyle />
      <Form.Item name="updated_at" hidden noStyle />
      <Form.Item name="creator_name" hidden noStyle />
    </>
  );
}

export function Brand() {
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
  ];

  return <IndexTable title="Brand" table="brand" columns={columns} FormComponent={FormComponent} />;
}
