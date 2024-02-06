import { IndexTable, userState } from '@jshop/core';
import { Form, Select, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRecoilState } from 'recoil';

const approvalStatusOptions = [
  { label: 'Approve', value: 'approved' },
  { label: 'Reject', value: 'rejected' },
  { label: 'Waiting', value: 'waiting' },
];

const userCategoryOptions = [
  { label: 'Super Admin', value: 'superadmin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Cashier', value: 'cashier' },
  { label: 'Warehouse', value: 'warehouse' },
];

export function FormComponent() {
  return (
    <>
      <Form.Item name={['company', 'approval_status']} label="Approval Status">
        <Select options={approvalStatusOptions} />
      </Form.Item>
      <Form.Item name={['company', 'user_category']} label="User Category">
        <Select options={userCategoryOptions} />
      </Form.Item>
      <Form.Item name="user_information" hidden />
      <Form.Item name="email" hidden />
      <Form.Item name="name" hidden />
    </>
  );
}

function renderApprovalStatus(value: string) {
  let color = 'default';
  if (value === 'approved') color = 'success';
  if (value === 'rejected') color = 'error';
  return <Tag color={color}>{value ?? 'waiting'}</Tag>;
}

export function User() {
  const [userRecoil] = useRecoilState(userState);
  const columnConfig: ColumnsType<any> = [
    {
      title: 'Status',
      key: 'company.approval_status',
      dataIndex: ['company', 'approval_status'],
      render: renderApprovalStatus,
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: ['name'],
    },
    {
      title: 'Email',
      key: 'name',
      dataIndex: ['name'],
    },
    {
      title: 'User Category',
      key: 'company.user_category',
      dataIndex: ['company', 'user_category'],
    },
  ];

  return (
    <IndexTable
      rowActionProps={{
        showDelete(row) {
          if (row?.id === userRecoil?.id) return true;
          return false;
        },
        showUpdate(row) {
          if (row?.id === userRecoil?.id || userRecoil?.company?.user_category === 'superadmin') return true;
          return false;
        },
      }}
      title="User Profile"
      table="profile"
      columns={columnConfig}
      FormComponent={FormComponent}
    />
  );
}
