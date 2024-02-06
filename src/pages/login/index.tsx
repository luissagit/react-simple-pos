import { Button, Card, Form, Input, notification } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { handleLogin } from './functions';

export function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(payload: any) {
    try {
      setLoading(true);
      await handleLogin(payload);
      navigate('/');
    } catch (err: any) {
      notification.error({
        message: err?.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function generateUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
  }

  useEffect(() => {
    generateUser();
  }, []);

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
