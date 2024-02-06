import { Form, Input, InputNumber } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  CreatableSelectPaginate, IndexTable, SelectPaginate, rupiah,
} from '@jshop/core';

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
      <Form.Item shouldUpdate noStyle>
        {({ setFieldsValue }) => {
          function onChange(value: any) {
            setFieldsValue({
              uom: value?.uom ?? null,
              price_per_unit: value?.price_per_unit ?? null,
            });
          }
          return (
            <Form.Item label="Category" name="product_category" rules={[{ required: true }]}>
              <SelectPaginate table="product_category" onChange={onChange} />
            </Form.Item>
          );
        }}
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

export function ProductMaster() {
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
      key: 'product_category.name',
      dataIndex: ['product_category', 'name'],
      title: ' Category',
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
    <IndexTable
      title="Product Master"
      table="product_master"
      columns={columns}
      FormComponent={FormComponent}
      modalProps={{
        width: 500,
      }}
    />
  );
}
