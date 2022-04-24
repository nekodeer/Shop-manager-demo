import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Descriptions, Divider, Input, Row, Col, Button, message } from 'antd';
import MyBreadcrumb from './Breadcrumb';

export default function Detail() {
  const location: any = useLocation();
  const product = location.state[0];
  const { key, product_name, category, unit_price, availableStock, description, totalStock, title, subTitle, createOn, discount } = product;
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [item, setItem] = useState(product)
  const saveProduct = () => {
    setIsEdit(!isEdit);
    message.info('Update Success, plz check log for the updated product')
    console.log(item);
  }
  const updateProduct = (e: any, value: string) => {
    if (value === 'categoryId' || value === 'categoryName' || value === 'prodTypeId') {
      typeof (item.category[value]) === 'string' ? item.category[value] = e.target.value : item.category[value] = parseFloat(e.target.value);
      if (item[value]) {
        typeof (item[value]) === 'string' ? item[value] = e.target.value : item[value] = parseFloat(e.target.value);
      }
    }
    else {
      typeof (item[value]) === 'string' ? item[value] = e.target.value : item[value] = parseFloat(e.target.value);
    }
  }

  return (
    <div>
      <Row justify="space-between">
        <Col span={4}><MyBreadcrumb /></Col>
        <Col span={4}>{isEdit ? <Button onClick={saveProduct}>Save the product</Button> : <Button type='primary' onClick={() => setIsEdit(!isEdit)}>Edit Product Information</Button>}</Col>
      </Row>
      <Divider />
      <Descriptions title={`Product ID: ` + key} layout="vertical" bordered>
        <Descriptions.Item label="Product Name" labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='text' defaultValue={product_name} onChange={(e) => updateProduct(e, 'product_name')} /> : product_name}</Descriptions.Item>
        <Descriptions.Item label="Unit Price $" labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='number' defaultValue={unit_price} onChange={(e) => updateProduct(e, 'unit_price')} /> : unit_price}</Descriptions.Item>
        <Descriptions.Item label="Discount" labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='number' defaultValue={discount} onChange={(e) => updateProduct(e, 'discount')} /> : discount}</Descriptions.Item>
        <Descriptions.Item label="Category ID" labelStyle={{ 'fontWeight': '700' }}>
          {category ? isEdit ? <Input type='number' defaultValue={category.categoryId} onChange={(e) => updateProduct(e, 'categoryId')} /> : category.categoryId : `undefined`}
        </Descriptions.Item>
        <Descriptions.Item label="Category Name" labelStyle={{ 'fontWeight': '700' }}>
          {category ? isEdit ? <Input type='text' defaultValue={category.categoryName} onChange={(e) => updateProduct(e, 'categoryName')} /> : category.categoryName : `undefined`}
        </Descriptions.Item>
        <Descriptions.Item label="Product Type Id" labelStyle={{ 'fontWeight': '700' }}>
          {category ? isEdit ? <Input type='number' defaultValue={category.prodTypeId} onChange={(e) => updateProduct(e, 'prodTypeId')} /> : category.prodTypeId : `undefined`}
        </Descriptions.Item>
        <Descriptions.Item label="Title" labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='text' defaultValue={title} onChange={(e) => updateProduct(e, 'title')} /> : title}</Descriptions.Item>
        <Descriptions.Item label="Sub Title" labelStyle={{ 'fontWeight': '700' }} span={2}>
          {isEdit ? <Input type='text' defaultValue={subTitle} onChange={(e) => updateProduct(e, 'subTitle')} /> : subTitle}
        </Descriptions.Item>
        <Descriptions.Item label="Description" labelStyle={{ 'fontWeight': '700' }} span={3}>
          {isEdit ? <Input type='text' defaultValue={description} onChange={(e) => updateProduct(e, 'description')} /> : description}
        </Descriptions.Item>
        <Descriptions.Item label="Create On" labelStyle={{ 'fontWeight': '700' }}>{createOn}</Descriptions.Item>
        <Descriptions.Item label="Available Stock" labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='number' defaultValue={availableStock} onChange={(e) => updateProduct(e, 'availableStock')} /> : availableStock}</Descriptions.Item>
        <Descriptions.Item label="Total Stock" labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='number' defaultValue={totalStock} onChange={(e) => updateProduct(e, 'totalStock')} /> : totalStock}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

