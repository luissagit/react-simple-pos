import {
  Button, Card, Form, Modal, ModalProps, Popconfirm, Table, notification,
} from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { db, userState } from '@jshop/core';
import { IoReload, IoTrashBinSharp } from 'react-icons/io5';
import { TfiPencilAlt } from 'react-icons/tfi';

import {
  collection, doc, getDocs, orderBy, query, setDoc, where, writeBatch,
} from 'firebase/firestore';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import './index-table.less';
import { useNavigate } from 'react-router-dom';

interface FormProps {
  type?: string;
  data?: any;
}

interface RowActionProps {
  showUpdate?(row: any): boolean;
  showDelete?(row: any): boolean;
  additionalRenderAction?: any;
  onClickUpdate?(row: any): void;
}

interface Props {
  table: string;
  columns: ColumnsType<any>;
  FormComponent: any;
  filterColumns?(columns: ColumnsType<any>): ColumnsType<any>;
  rowActionProps?: RowActionProps;
  title: string;
  modalProps?: ModalProps;
  AdditionalToolbar?: any;
  customSubmitData?: (payload: any) => Promise<any>;
  getFormType?: (payload: any) => any;
  showCreate?: boolean;
  showMultiDelete?: (selectedRows: any[]) => boolean;
  tableProps?: TableProps<any>;
}

export function IndexTable(props: Props) {
  const {
    table,
    columns,
    FormComponent,
    filterColumns,
    rowActionProps = {},
    title,
    modalProps = {},
    AdditionalToolbar,
    customSubmitData,
    getFormType,
    showCreate = true,
    showMultiDelete,
    tableProps = {},
  } = props;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<any>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const navigate = useNavigate();

  const [userRecoil] = useRecoilState(userState);

  const isShowMultiDelete = showMultiDelete ? showMultiDelete(selectedRows) : true;

  const dataRef = collection(db, table);
  const [user] = useRecoilState(userState);

  async function handleGetData() {
    setLoading(true);
    try {
      const first = query(dataRef, orderBy('created_at', 'desc'), where('company.id', '==', user?.company?.id));
      const documentSnapshots = await getDocs(first);
      let items: any[] = [];
      documentSnapshots.forEach((document: any) => {
        const item = document.data();
        const resultItem = {
          ...item,
          id: document?.id,
        };
        items = [...items, resultItem];
      });
      setData(items);
    } catch (err: any) {
      notification.error({
        message: err?.message,
      });
      if (!userRecoil) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(params: any) {
    try {
      const batch = writeBatch(db);
      const dataIds = params?.map((item: any) => item?.id);
      dataIds.forEach((docId: string) => {
        batch.delete(doc(db, table, docId));
      });
      await batch.commit();
      await handleGetData();
      setSelectedRows([]);
    } catch (err: any) {
      notification.error({
        message: err?.message,
      });
    }
  }

  const [form] = Form.useForm();

  function handleCancel() {
    form.resetFields();
    setFormOpen(false);
  }

  async function handleSubmit() {
    try {
      setLoadingSubmit(true);
      await form.validateFields();
      const values = await form.getFieldsValue();
      const newValue = {};
      const transformedData = {
        ...values,
      };
      const userName = user?.email?.split('@')[0];
      if (values?.id) {
        Object.assign(transformedData, {
          edited_at: new Date().getTime(),
          editor_name: userName,
          editor_id: user?.uid,
        });
      }
      if (!values?.id) {
        Object.assign(transformedData, {
          created_at: new Date().getTime(),
          creator_name: userName,
          creator_id: user?.uid,
        });
      }
      Object.keys(transformedData).forEach((key: string) => {
        if (transformedData[key]) {
          Object.assign(newValue, { [key]: transformedData[key] });
        }
      });
      if (customSubmitData) await customSubmitData(newValue);
      else await setDoc(doc(db, table, values?.id ?? v4()), newValue);
      handleGetData();
      handleCancel();
    } catch (err: any) {
      notification.error({
        message: err?.message,
      });
    } finally {
      setLoadingSubmit(false);
    }
  }

  async function openForm(formProps: FormProps) {
    await form.resetFields();
    if (formProps?.data) {
      await form.setFieldsValue(formProps?.data);
    } else {
      await form.setFieldsValue({
        company: user?.company,
      });
    }
    setFormOpen(true);
    const type = formProps?.type;
    setFormType(type);
  }

  function renderAction(value: any, record: any) {
    const isShowUpdate = rowActionProps?.showUpdate ? rowActionProps?.showUpdate(record) : true;
    const isShowDelete = rowActionProps?.showDelete ? rowActionProps?.showDelete(record) : true;
    return (
      <div style={{ display: 'inline' }}>
        {isShowDelete && (
          <Popconfirm title="Are you sure want to delete item?" onConfirm={() => handleDelete([record])}>
            <Button danger size="small">
              <IoTrashBinSharp />
            </Button>
          </Popconfirm>
        )}
        {isShowUpdate && (
          <Button style={{ marginLeft: '10px' }} size="small" onClick={() => (rowActionProps?.onClickUpdate ? rowActionProps?.onClickUpdate(record) : openForm({ type: 'Edit', data: record }))}>
            <TfiPencilAlt />
          </Button>
        )}
        {rowActionProps?.additionalRenderAction}
      </div>
    );
  }

  const columnConfig: ColumnsType<any> = [
    {
      key: 'action',
      dataIndex: ['action'],
      render: renderAction,
      width: 100,
      fixed: true,
    },
    ...columns,
    {
      key: 'creator_name',
      dataIndex: ['creator_name'],
      title: 'Creator',
      width: 100,
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: ['created_at'],
      render(value) {
        return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';
      },
      width: 130,
    },
    {
      key: 'editor_name',
      dataIndex: ['editor_name'],
      title: 'Editor',
      width: 100,
    },
    {
      title: 'Edited At',
      key: 'edited_at',
      dataIndex: ['edited_at'],
      render(value) {
        return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';
      },
      width: 130,
    },
  ];

  useEffect(() => {
    handleGetData();
  }, [title]);

  useEffect(() => {
    if (getFormType) getFormType(formType);
  }, [formType]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRowsData: any[]) => {
      setSelectedRows(selectedRowsData);
    },
  };

  return (
    <Card title={<div style={{ textAlign: 'left', width: '100%' }}>{title}</div>}>
      {showCreate && (
      <Button onClick={() => openForm({ type: 'Create', data: null })}>
        Add
        {title}
      </Button>
      )}
      {AdditionalToolbar ? <AdditionalToolbar /> : null}
      {isShowMultiDelete && (
        <Popconfirm
          title="Are you sure want to delete item?"
          onConfirm={() => handleDelete(selectedRows)}
          disabled={selectedRows?.length === 0}
        >
          <Button danger size="small" style={{ marginLeft: '10px' }} disabled={selectedRows?.length === 0}>
            <IoTrashBinSharp />
          </Button>
        </Popconfirm>
      )}
      <Button size="small" style={{ marginLeft: '10px' }} onClick={handleGetData}>
        <IoReload />
      </Button>
      <Modal
        title={`${formType} ${title}`}
        open={formOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        {...modalProps}
        closable={!loadingSubmit}
        maskClosable={!loadingSubmit}
        okButtonProps={{ loading: loadingSubmit }}
        cancelButtonProps={{ disabled: loadingSubmit }}
      >
        <Form name={table} form={form} onFinish={handleSubmit} labelCol={{ span: 7 }} labelAlign="left">
          <FormComponent />
          <Form.Item name="company" hidden />
          <Form.Item name="created_at" hidden />
          <Form.Item name="id" hidden />
        </Form>
      </Modal>
      <Table
        className="index-table"
        style={{
          marginTop: '10px',
        }}
        size="small"
        columns={filterColumns ? filterColumns(columnConfig) : columnConfig}
        rowKey="id"
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ x: 'max-content' }}
        {...tableProps}
      />
    </Card>
  );
}
