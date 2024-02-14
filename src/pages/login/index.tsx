import {
  Button, Card, Form, Input, notification,
} from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  companyState, getDetailData, submitData, userState,
} from '@jshop/core';
import { handleLogin } from './functions';

export function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [, setCompanyRecoil] = useRecoilState(companyState);
  const [, setUserRecoil] = useRecoilState(userState);

  async function generateSetting(dataUser: any) {
    if (dataUser?.uid) {
      const detailUser = await getDetailData('profile', dataUser?.uid);
      const detailCompany = await getDetailData('company', detailUser?.company?.id);
      await submitData('profile', {
        id: detailUser?.id,
        ...detailUser,
        company: { ...detailUser?.company, ...detailCompany },
        user_information: JSON.stringify(dataUser),
      });
      const newUser = await getDetailData('profile', dataUser?.uid);
      const userCategory = newUser?.company?.user_category;
      if (['superadmin', 'admin'].includes(userCategory)) navigate('/sales-orders');
      else if (userCategory === 'cashier') navigate('/point-of-sale');
      else if (userCategory === 'warehouse') navigate('/product-variant');
      else navigate('/');
      setUserRecoil(newUser);
      setCompanyRecoil(detailCompany);
    }
  }

  async function handleSubmit(payload: any) {
    try {
      setLoading(true);
      const response = await handleLogin(payload);
      await generateSetting(response);
    } catch (err: any) {
      notification.error({
        message: err?.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ margin: '0 auto' }}>
      <Card style={{ maxWidth: '300px', margin: '0 auto' }} title="Login">
        <Form name="login" onFinish={handleSubmit} form={form} layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            loading={loading}
            type="primary"
            style={{ marginRight: '10px' }}
            key="login_button"
            onClick={form.submit}
          >
            Login
          </Button>
          {!loading && (
            <Link to="/register">
              <span>Register instead</span>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
