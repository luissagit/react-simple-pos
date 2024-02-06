import { Button, Card, Form, Input, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@jshop/core';
import { handleRegister } from './functions';

export function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(payload: any) {
    try {
      setLoading(true);
      const user = await handleRegister(payload);
      notification.success({
        message: `User ${user?.email} has been successfully registered`,
      });
      await setDoc(doc(db, 'profile', user?.uid), {
        name: user?.email,
        email: user?.email,
        user_information: JSON.stringify(user),
        company: null,
        id: user?.uid,
        created_at: new Date().getTime(),
      });
      navigate('/login');
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
      <Card style={{ maxWidth: '300px', margin: '0 auto' }} title="Register">
        <Form name="register" onFinish={handleSubmit} form={form} layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords does'nt match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Button
            loading={loading}
            type="primary"
            style={{ marginRight: '10px' }}
            key="register_button"
            onClick={form.submit}
          >
            Sign up
          </Button>
          {!loading && (
            <Link to="/login">
              <span>Login instead</span>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
