import { companyState, getDetailData, submitData } from '@jshop/core';
import { userState } from '@jshop/core/states/user-state';
import {
  Avatar, Button, Menu, MenuProps, Popconfirm, notification,
} from 'antd';
import { Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

export function MenuHeader() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [companyRecoil, setCompanyRecoil] = useRecoilState(companyState);
  const [userRecoil, setUserRecoil] = useRecoilState(userState);
  const [user, setUser] = useState<any>(null);

  async function handleLogout() {
    signOut(auth)
      .then(() => {
        navigate('/login');
        setCompanyRecoil(null);
        setUserRecoil(null);
      })
      .catch((error) => {
        notification.error({
          message: error?.message,
        });
      });
  }

  const items: MenuProps['items'] = [
    {
      key: 'inventory',
      label: 'Inventory',
      children: [
        {
          key: 'brand',
          label: <Link to="/brand">Brand</Link>,
        },
        {
          key: 'product-category',
          label: <Link to="/product-category">Product Category</Link>,
        },
        {
          key: 'product-master',
          label: <Link to="/product-master">Product Master</Link>,
        },
        {
          key: 'product-variant',
          label: <Link to="/product-variant">Product Variant</Link>,
        },
        {
          key: 'stock-opname',
          label: <Link to="/stock-opname">Stock Opname</Link>,
        },
      ],
    },
    {
      key: 'sales',
      label: 'Sales',
      children: [
        {
          key: 'point-of-sale',
          label: <Link to="/point-of-sale">Point of Sale</Link>,
        },
        {
          key: 'sales-orders',
          label: <Link to="/sales-orders">Sales Orders</Link>,
        },
      ],
    },
    {
      key: 'company',
      label: 'Company',
      children: [
        {
          key: 'setting',
          label: <Link to="/setting">Setting</Link>,
        },
        {
          key: 'user',
          label: <Link to="/user">User</Link>,
        },
        {
          key: 'contact',
          label: <Link to="/contact">Contact</Link>,
        },
      ],
    },
  ].map((item: any) => {
    if (userRecoil?.company?.user_category === 'cashier' && item?.key !== 'sales') return null;
    if (userRecoil?.company?.user_category === 'warehouse' && item?.key !== 'inventory') return null;
    if (userRecoil?.company?.approval_status !== 'approved') return null;
    if (!userRecoil?.company?.user_category) return null;
    return item;
  }).filter(Boolean);

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
      setUserRecoil(newUser);
      setCompanyRecoil(detailCompany);
    }
  }

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (dataUser) => {
      if (dataUser) {
        generateSetting(dataUser);
        setUser(dataUser);
      } else {
        handleLogout();
      }
    });
    return () => unregisterAuthObserver();
  }, []);

  const { pathname } = window.location;
  const module = pathname.substring(1);

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#873800',
        color: 'white',
      }}
    >
      <div className="left-side">
        <Title style={{ color: 'white' }}>{companyRecoil?.name ?? 'JSHOP'}</Title>
      </div>
      {userRecoil?.company?.id && user?.emailVerified && (
        <Menu
          selectedKeys={[module]}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
            background: '#873800',
            marginLeft: '20px',
          }}
        />
      )}
      {userRecoil && (
        <Popconfirm title="Are you sure want to logout" onConfirm={handleLogout}>
          <Button ghost style={{ color: 'white', border: 'none' }}>
            <Avatar style={{ marginRight: '10px' }}>{userRecoil?.name?.substring(0, 1)}</Avatar>
            Logout
          </Button>
        </Popconfirm>
      )}
    </Header>
  );
}
