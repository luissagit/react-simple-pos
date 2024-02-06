import { Form, Input, InputNumber } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CreatableSelectPaginate, IndexTable, rupiah } from '@jshop/core';

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
      <Form.Item label="Price/Unit" name="price_per_unit" rules={[{ required: true }]}>
        <InputNumber addonBefore="Rp." />
      </Form.Item>
      <Form.Item label="UoM" name="uom" rules={[{ required: true }]}>
        <CreatableSelectPaginate table="uom" />
      </Form.Item>
      <Form.Item name="id" hidden noStyle />
      <Form.Item name="created_at" hidden noStyle />
      <Form.Item name="updated_at" hidden noStyle />
      <Form.Item name="creator_name" hidden noStyle />
    </>
  );
}

export function ProductCategory() {
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
      key: 'uom.name',
      dataIndex: ['uom', 'name'],
      title: 'UoM',
    },
    {
      key: 'price_per_unit',
      dataIndex: ['price_per_unit'],
      title: 'Price/Unit',
      render(value) {
        return rupiah(value ?? 0);
      },
    },
  ];

  return (
    <IndexTable title="Product Category" table="product_category" columns={columns} FormComponent={FormComponent} />
  );
}
