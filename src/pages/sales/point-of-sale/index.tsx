import {
  Col, Form, Row,
} from 'antd';
import { companyState, getDetailData } from '@jshop/core';
import { useRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { FormPayment, FormProductLine } from './components';

export function PointOfSale() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [companyRecoil] = useRecoilState(companyState);

  async function getData(dataId: string) {
    const response = await getDetailData('sales_orders', dataId);
    if (response?.id) form.setFieldsValue(response);
  }

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);
  return (
    <Form name="point_of_sale" form={form} labelCol={{ span: 7 }} labelAlign="left">
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24} md={24} lg={16} xxl={16}>
          <Form.Item shouldUpdate noStyle>
            {({ setFieldsValue }) => {
              function onChange(items: any[]) {
                const taxValue = companyRecoil?.tax?.value ?? 0;
                let subTotal = 0;
                items?.forEach((item: any) => {
                  subTotal += item?.net_price ?? 0;
                });
                const ppn = ((subTotal * taxValue) / 100) ?? 0;
                const netPrice = subTotal + ppn;
                setFieldsValue({
                  sub_total: subTotal,
                  net_price: netPrice,
                  ppn,
                });
              }
              return (
                <Form.Item
                  name={['product_lines']}
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (value?.length > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Please provide item!'));
                      },
                    }),
                  ]}
                >
                  <FormProductLine onChange={onChange} />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xxl={8}>
          <FormPayment />
        </Col>
      </Row>
    </Form>
  );
}
