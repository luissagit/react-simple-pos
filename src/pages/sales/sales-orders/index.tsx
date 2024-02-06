import { ColumnsType } from 'antd/es/table';
import { IndexTable, rupiah, userState } from '@jshop/core';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

function FormComponent() {
  return (
    <>
    </>
  );
}

export function SalesOrders() {
  const [user] = useRecoilState(userState);
  const showDeleteUpdate = ['superadmin', 'admin'].includes(user?.company?.user_category);
  const navigate = useNavigate();
  const columns: ColumnsType<any> = [
    {
      key: 'status',
      dataIndex: ['status'],
      title: 'Status',
    },
    {
      key: 'code',
      dataIndex: ['code'],
      title: 'Code',
    },
    {
      key: 'contact.name',
      dataIndex: ['contact', 'name'],
      title: 'Contact',
    },
    {
      key: 'total',
      dataIndex: ['net_price'],
      title: 'Total',
      render(value, record, index) {
        return rupiah(value);
      },
    },
    {
      key: 'payment',
      dataIndex: ['payment'],
      title: 'Payment',
      render(value, record, index) {
        return rupiah(value);
      },
    },
  ];

  return (
    <IndexTable
      rowActionProps={{
        showDelete(row) {
          if (row?.status === 'draft') return showDeleteUpdate;
          return false;
        },
        showUpdate(row) {
          if (row?.status === 'draft') return showDeleteUpdate;
          return false;
        },
        onClickUpdate(row) {
          navigate(`/point-of-sale/${row?.id}`);
        },
      }}
      showMultiDelete={(selectedData) => {
        let showDelete = true;
        selectedData?.forEach((item: any) => {
          if (item?.status !== 'draft') showDelete = false;
        });
        if (showDelete) return showDeleteUpdate;
        return false;
      }}
      title="Sales Orders"
      table="sales_orders"
      showCreate={false}
      columns={columns}
      FormComponent={FormComponent}
    />
  );
}
