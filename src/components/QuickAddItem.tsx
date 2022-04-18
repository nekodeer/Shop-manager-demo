import React from 'react'
import { Input, Form, Button } from 'antd';
import {Item} from './ProductList/ProductList'

type AddItemProps = {
  isAdding: boolean,
  getNewProduct({}): void
}

export default function QuickAddItem(props: AddItemProps) {
  const [form] = Form.useForm();
  const { isAdding, getNewProduct } = props;
  
  //When finish, call the getNewProduct function passed from Product list components, and pass a Item as the arg
  const onFinish = (values: Item) => {
    getNewProduct({ key: Math.random() * 10000, product_name: values.product_name, product_category: values.product_category, unit_price: values.unit_price })
    form.resetFields();
  };

  return (
    <Form form={form} name="horizontal_product" layout="inline" onFinish={onFinish}>
      <Form.Item name='product_name' rules={[{ required: true, message: 'Please input product name!' }]}>
        <Input placeholder="Product Name" disabled={!isAdding} />
      </Form.Item>
      <Form.Item name='product_category' rules={[{ required: true, message: 'Please input product category!' }]}>
        <Input placeholder="Product Category" disabled={!isAdding} />
      </Form.Item>
      <Form.Item name='unit_price' rules={[{ required: true, message: 'Please input price!' }]}>
        <Input placeholder="Unit Price" disabled={!isAdding} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!isAdding}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
