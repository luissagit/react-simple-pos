import { db, rupiah } from '@jshop/core';
import {
  Button,
  Card, Form, InputNumber, notification,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import {
  collection, getDocs, orderBy, query, where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { IoTrashBinSharp } from 'react-icons/io5';
import useScanDetection from 'use-scan-detection-react18';
import { v4 } from 'uuid';

interface Props {
  value?: any;
  onChange?(value: any): void;
}

export function FormProductLine(props: Props) {
  const { value, onChange } = props;
  const [dataLine, setDataLine] = useState<any>([]);

  function onChangeQty(qty: number, record: any) {
    const newDataLine = dataLine?.map((item: any) => {
      if (item?.key === record?.key) {
        const pricePerUnit = record?.price_per_unit ?? 0;
        const netPrice = pricePerUnit * qty ?? 0;
        return {
          ...item,
          net_price: netPrice,
          qty,
        };
      }
      return item;
    });
    if (onChange) onChange(newDataLine);
  }

  function handleDelete(record: any) {
    const newDataLine = dataLine?.filter((item: any) => item?.key !== record?.key);
    if (onChange) onChange(newDataLine);
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Action',
      key: 'action',
      render(value, record, index) {
        return (
          <Button danger size="small" onClick={() => handleDelete(record)}>
            <IoTrashBinSharp />
          </Button>
        );
      },
    },
    {
      title: 'ID',
      key: 'product.code',
      dataIndex: ['product', 'code'],
    },
    {
      title: 'Brand',
      key: 'brand.name',
      dataIndex: ['brand', 'name'],
    },
    {
      title: 'Master',
      key: 'product_master.name',
      dataIndex: ['product_master', 'name'],
    },
    {
      title: 'Product',
      key: 'product.name',
      dataIndex: ['product', 'name'],
    },
    {
      title: 'Qty',
      key: 'qty',
      dataIndex: ['qty'],
      render(value, record, index) {
        return <InputNumber onChange={(value) => onChangeQty(value, record)} value={value} />;
      },
    },
    {
      title: 'UoM',
      key: 'uom.code',
      dataIndex: ['uom', 'code'],
    },
    {
      title: 'Price/Unit',
      key: 'price_per_unit',
      dataIndex: ['price_per_unit'],
      render(item: number) {
        return rupiah(item ?? 0);
      },
    },
    {
      title: 'Net Price',
      key: 'net_price',
      dataIndex: ['net_price'],
      render(item: number) {
        return rupiah(item ?? 0);
      },
    },
  ];

  useEffect(() => {
    if (value) {
      const newValue = value?.map((item: any) => ({
        ...item,
        key: item?.id ?? item?.key ?? v4(),
      }));
      setDataLine(newValue);
    }
  }, [value]);

  async function getDataProduct(code: any) {
    try {
      const dataRef = collection(db, 'product_variant');
      const first = query(dataRef, orderBy('created_at', 'desc'), where('code', '==', code));
      const documentSnapshots = await getDocs(first);
      let data: any;
      documentSnapshots.forEach((document: any) => {
        const item = document.data();
        data = {
          ...item,
          id: document?.id,
        };
      });
      if (data?.id) {
        const newData = {
          product: data,
          qty: 1,
          uom: data?.uom,
          price_per_unit: data?.price_per_unit,
          net_price: data?.price_per_unit,
          brand: data?.brand,
          product_master: data?.product_master,
        };
        const newList = [
          ...dataLine,
          newData,
        ];
        if (onChange) onChange(newList);
      } else {
        notification.error({
          message: 'Item not found',
        });
      }
    } catch (err: any) {
      console.log(err);
      notification.error({
        message: err?.message,
      });
    }
  }

  useScanDetection({
    onComplete: getDataProduct,
  });

  return (
    <Card style={{ height: '80vh' }}>
      <Table
        columns={columns}
        pagination={false}
        dataSource={dataLine}
        size="small"
      />
    </Card>
  );
}
