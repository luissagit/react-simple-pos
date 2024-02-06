import { Button, Card, Checkbox, Form, Input, InputNumber, Modal, Space, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { doc, getDoc } from 'firebase/firestore';
import { db, companyState, userState } from '@jshop/core';
import { useRecoilState } from 'recoil';
import { submitTransformer } from './helpers';
import { requestSave } from './request';

export function Setting() {
  const { currentUser } = getAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const [, setSetting] = useRecoilState(companyState);
  const [userRecoil] = useRecoilState(userState);

  async function getDataSetting() {
    setLoading(true);
    try {
      const docRef = doc(db, 'company', userRecoil?.company?.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data: any = docSnap.data();
        form.setFieldsValue(data);
        setSetting(data);
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
      }
    } catch (err: any) {
      if (!currentUser) navigate('/login');
      notification.error({
        message: err?.message,
      });
    }
    setLoading(false);
  }

  async function handleSubmit() {
    setLoading(true);
    const payload = await form.getFieldsValue();
    const transformedPayload = submitTransformer(payload);
    await requestSave(transformedPayload);
    await getDataSetting();
    setLoading(false);
  }

  useEffect(() => {
    getDataSetting();
  }, []);

  async function handleClickSave() {
    modal.confirm({
      title: 'Are you sure we want to save settings?',
      onOk: async () => handleSubmit(),
    });
  }

  return (
    <div style={{ margin: '0 auto' }}>
      <Card style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }} title="Settings" loading={loading}>
        <Form
          name="setting"
          onFinish={handleSubmit}
          form={form}
          layout="horizontal"
          labelCol={{ xl: 4, md: 6, sm: 8 }}
          labelAlign="left"
        >
          <Form.Item name="id" hidden />
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} valuePropName="checked" name="use_tax">
            <Checkbox>Use Tax</Checkbox>
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldsValue }) => {
              const values = getFieldsValue();
              const useTax = values?.use_tax;
              if (useTax) {
                return (
                  <>
                    <Form.Item label="Tax Value" name={['tax', 'value']} rules={[{ required: true }]}>
                      <InputNumber addonAfter="%" />
                    </Form.Item>
                    <Form.Item label="Tax Name" name={['tax', 'name']} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </>
                );
              }
              return '';
            }}
          </Form.Item>
          <Form.List name="contacts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Type is required' }]}
                    >
                      <Input placeholder="Type. eg: phone" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Value is required' }]}
                    >
                      <Input />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Contact
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item wrapperCol={{ span: 24 }} label="Member Prefix Code" name="member_prefix">
            <Input />
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            loading={loading}
            type="primary"
            style={{ marginRight: '10px' }}
            key="login_button"
            onClick={handleClickSave}
          >
            Save
          </Button>
        </div>
      </Card>
      {contextHolder}
    </div>
  );
}
