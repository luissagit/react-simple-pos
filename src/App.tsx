import { ConfigProvider, Layout } from 'antd';
import './App.css';
import { MenuHeader, theme } from '@jshop/core';
import {
  Brand,
  Contact,
  Home,
  Login,
  PointOfSale,
  ProductCategory,
  ProductMaster,
  ProductVariant,
  Register,
  SalesOrders,
  Setting,
  User,
} from '@jshop/pages';
import { Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider theme={theme}>
      <RecoilRoot>
        <Layout style={{ minHeight: '100vh' }}>
          <MenuHeader />
          <Content style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/brand" element={<Brand />} />
              <Route path="/product-category" element={<ProductCategory />} />
              <Route path="/product-master" element={<ProductMaster />} />
              <Route path="/product-variant" element={<ProductVariant />} />
              <Route path="/stock-opname" element={<ProductVariant isStockOpname />} />
              <Route path="/user" element={<User />} />
              <Route path="/point-of-sale" element={<PointOfSale />} />
              <Route path="/point-of-sale/:id" element={<PointOfSale />} />
              <Route path="/sales-orders" element={<SalesOrders />} />
            </Routes>
          </Content>
        </Layout>
      </RecoilRoot>
    </ConfigProvider>
  );
}

export default App;
