import {
  Button, Form, Input, InputNumber, Space,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  CreatableSelectPaginate, IndexTable, SelectPaginate, db, rupiah,
} from '@jshop/core';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { doc, writeBatch } from 'firebase/firestore';
import { v4 } from 'uuid';
import { StockOpname } from './components';

function FormComponent() {
  return (
    <>
      <Form.Item label="Brand" name="brand">
        <SelectPaginate table="brand" />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ setFieldsValue }) => {
          function onChange(value: any) {
            setFieldsValue({
              uom: value?.uom ?? null,
              price_per_unit: value?.price_per_unit ?? null,
              product_master: null,
            });
          }
          return (
            <Form.Item label="Category" name="product_category" rules={[{ required: true }]}>
              <SelectPaginate table="product_category" onChange={onChange} />
            </Form.Item>
          );
        }}
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ setFieldsValue, getFieldsValue }) => {
          const values = getFieldsValue();
          function onChange(value: any) {
            setFieldsValue({
              uom: value?.uom ?? null,
              price_per_unit: value?.price_per_unit ?? null,
              product_category: value?.product_category ?? null,
            });
          }
          function transformOptions(options: any[]) {
            return options
              ?.map((item: any) => {
                if (values?.product_category
                  && values?.product_category?.id === item?.product_category?.id) {
                  return item;
                }
                if (!values?.product_category) return item;
                return null;
              })
              .filter(Boolean);
          }
          return (
            <Form.Item label="Product Master" name="product_master" rules={[{ required: true }]}>
              <SelectPaginate table="product_master" onChange={onChange} transformOptions={transformOptions} />
            </Form.Item>
          );
        }}
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldsValue }) => {
          const values = getFieldsValue();
          const variants = values?.variants ?? [];
          const lastVariant = variants?.[(variants?.length ?? 0) - 1];
          const defaultUom = lastVariant?.uom ?? values?.product_master?.uom;
          const defaultPrice = lastVariant?.price_per_unit
           ?? values?.product_master?.price_per_unit;

          if (values?.id) {
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
              </>
            );
          }
          return (
            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'code']}
                        rules={[{ required: true, message: 'Code is required' }]}
                        normalize={(value) => (value ? value?.toUpperCase() : '')}
                      >
                        <Input placeholder="type code" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Name is required' }]}
                        normalize={(value) => (value ? value?.toUpperCase() : '')}
                      >
                        <Input placeholder="type name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'price_per_unit']}
                        rules={[{ required: true, message: 'Price is required' }]}
                      >
                        <InputNumber placeholder="price/unit" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'uom']}
                        rules={[{ required: true, message: 'UoM is required' }]}
                      >
                        <CreatableSelectPaginate table="uom" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ uom: defaultUom, price_per_unit: defaultPrice })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Varian
                  </Button>
                </>
              )}
            </Form.List>
          );
        }}
      </Form.Item>
      <Form.Item name="id" hidden noStyle />
      <Form.Item name="created_at" hidden noStyle />
      <Form.Item name="updated_at" hidden noStyle />
      <Form.Item name="creator_name" hidden noStyle />
    </>
  );
}

interface Props {
  isStockOpname?: boolean;
}

export function ProductVariant(props: Props) {
  const { isStockOpname = false } = props;
  const [formType, setFormType] = useState<any>(null);
  const columns: ColumnsType<any> = [
    {
      key: 'code',
      dataIndex: ['code'],
      title: 'Code',
      width: 150,
      fixed: 'left',
    },
    {
      key: 'name',
      dataIndex: ['name'],
      title: 'Name',
      width: 240,
      ellipsis: true,
      fixed: 'left',
    },
    {
      key: 'brand.name',
      dataIndex: ['brand', 'name'],
      title: 'Brand',
      width: 100,
    },
    {
      key: 'product_category.name',
      dataIndex: ['product_category', 'name'],
      title: ' Category',
      width: 150,
    },
    {
      key: 'product_master.name',
      dataIndex: ['product_master', 'name'],
      title: ' Master',
      width: 150,
    },
    {
      key: 'stock_available',
      dataIndex: ['stock_available'],
      title: 'Available',
      render(value: any, record: any) {
        if (isStockOpname) return <StockOpname record={record} />;
        return (value ?? 0).toLocaleString('ID-id');
      },
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

  async function createProductVariant(payload: any) {
    const batch = writeBatch(db);
    for (const variant of payload?.variants ?? []) {
      const ref = doc(db, 'product_variant', v4());
      batch.set(ref, {
        brand: payload?.brand ?? null,
        company: payload?.company ?? null,
        created_at: payload?.created_at ?? null,
        creator_name: payload?.creator_name ?? null,
        product_category: payload?.product_category ?? null,
        product_master: payload?.product_master ?? null,
        uom: variant?.uom ?? null,
        code: variant?.code ?? null,
        name: variant?.name ?? null,
        price_per_unit: variant?.price_per_unit ?? null,
      });
    }
    await batch.commit();
  }

  return (
    <IndexTable
      showCreate={!isStockOpname}
      showMultiDelete={() => !isStockOpname}
      customSubmitData={formType?.toLowerCase() === 'create' ? createProductVariant : undefined}
      getFormType={setFormType}
      title={isStockOpname ? 'Stock Opname' : 'Product Variant'}
      table="product_variant"
      columns={columns}
      FormComponent={FormComponent}
      filterColumns={(columnConfig) => {
        if (isStockOpname) return columnConfig?.filter((item: any) => item?.key !== 'action');
        return columnConfig;
      }}
      modalProps={{
        width: 800,
      }}
      {...(isStockOpname
        ? {
          tableProps: {
            rowSelection: undefined,
          },
        }
        : {})}
    />
  );
}
