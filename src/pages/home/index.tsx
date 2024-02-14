import { getDetailData, submitData } from '@jshop/core';
import { userState } from '@jshop/core/states/user-state';
import {
  Button, Card, Form, Input, Spin, notification,
} from 'antd';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const defaultCompany = {
  code: '',
  name: '',
  address: '',
  contacts: [],
  use_tax: false,
  tax: null,
};

export function Home() {
  const navigate = useNavigate();
  const [userRecoil, setUserRecoil] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const userInformation = userRecoil ? JSON.parse(userRecoil?.user_information) : null;
  const isEmailVerified = userInformation?.emailVerified;
  const [isEmailSent, setIsEmailSent] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!userRecoil) {
      navigate('/login');
    }
  }, [userRecoil?.id]);

  async function handleVerifyEmail() {
    try {
      if (user) {
        await sendEmailVerification(user);
        notification.success({
          message: 'Email has been sent successfully!',
        });
        setIsEmailSent(true);
      }
    } catch (err: any) {
      notification.error({
        message: err?.message,
      });
    }
  }

  async function handleCreateCompany() {
    setLoading(true);
    const company = await submitData('company', defaultCompany);
    if (company) {
      await submitData('profile', {
        ...userRecoil,
        company: {
          id: company?.id,
          code: company?.code,
          name: company?.name,
          user_category: 'superadmin',
          approval_status: 'approved',
        },
      });
      const newUser = await getDetailData('profile', userRecoil?.id);
      if (newUser) {
        setUserRecoil(newUser);
      }
    }
    setLoading(false);
  }

  async function onSubmit() {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const company = await getDetailData('company', values?.company_id);
      await submitData('profile', {
        ...userRecoil,
        company: {
          id: company?.id,
          code: company?.code,
          name: company?.name,
          user_category: null,
          approval_status: 'waiting',
        },
      });
      const newUser = await getDetailData('profile', userRecoil?.id);
      if (newUser) {
        setUserRecoil(newUser);
      }
    } catch (err) {
      //
    }
    setLoading(false);
  }

  return (
    <Spin spinning={loading}>
      {!isEmailVerified && !isEmailSent && (
        <Card style={{ marginBottom: '10px' }}>
          Your email has not been verified.
          {' '}
          <span
            style={{ color: '#fa8c16', cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={handleVerifyEmail}
            onClick={handleVerifyEmail}
          >
            verify email now!
          </span>
        </Card>
      )}
      {userRecoil?.company?.approval_status === 'waiting' && (
        <Card>Your account is now waiting approval for company.</Card>
      )}
      {isEmailSent && (
        <Card>Please confirm email in your email!</Card>
      )}
      {!userRecoil?.company?.id && userRecoil?.id && (
        <div>
          <h2 style={{ textAlign: 'center' }}>
            You have not connected to any company, please connect to a company first!
          </h2>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <Card style={{ width: '300px' }} title="Create New Company">
              <Button style={{ width: '100%' }} onClick={handleCreateCompany}>
                Start A Company
              </Button>
            </Card>
            <Card style={{ width: '300px' }} title="Connect to Existing Company">
              <Form name="form_register_company" form={form} onFinish={onSubmit}>
                <Form.Item name="company_id" rules={[{ required: true }]}>
                  <Input placeholder="enter company id" />
                </Form.Item>
                <Button onClick={form.submit} style={{ marginTop: '5px', width: '100%' }}>
                  Request to connect
                </Button>
              </Form>
            </Card>
          </div>
        </div>
      )}
    </Spin>
  );
}
