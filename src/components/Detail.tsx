import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Descriptions, Divider, Input, Row, Col, Button, message } from 'antd';
import MyBreadcrumb from './Breadcrumb';

interface IDetailItem {
  key: number,
  categoryId?: string | number,
  categoryName?: string,
  prodTypeId?: number | string,
  product_name: string,
  unit_price: number,
  availableStock: number,
  description: string,
  totalStock: number,
  title: string,
  subTitle: string,
  createOn: string,
  discount: number,
  productMedia: Array<object>
}

export default function Detail() {
  const location: any = useLocation();
  const product = location.state[0];
  const { key, product_name, category, unit_price, availableStock, description, totalStock, title, subTitle, createOn, discount, productMedia } = product;

  let categoryId = 'unknown';
  let categoryName = 'unknown';
  let prodTypeId = 'unknown';

  if (category !== null) {
    categoryId= category.categoryId;
    categoryName= category.categoryName;
    prodTypeId= category.prodTypeId;
  }
  const newProduct: any = { key, product_name, categoryId, categoryName, prodTypeId, unit_price, availableStock, description, totalStock, title, subTitle, createOn, discount, productMedia }
  // //below code get some part of the key and value from product object and combine them to a new object for mapping
  // const pick = (obj: any, arr: any) => arr.reduce((iter: any, val: any) => (val in obj && (iter[val] = obj[val]), iter), {})
  // let descriptionItem = pick(product, ['product_name', 'unit_price', 'discount', 'title', 'subTitle', 'description', ' createOn', 'availableStock', 'totalStock'])
  // descriptionItem = { ...descriptionItem, categoryId: category.categoryId, categoryName: category.categoryName, prodTypeId: category.prodTypeId }

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [item, setItem] = useState<IDetailItem>(newProduct)
  const saveProduct = () => {
    setIsEdit(!isEdit);
    message.info('Update Success, plz check log for the updated product')
    console.log(item);
  }


  const updateProduct = <K extends keyof IDetailItem>(e: any, value: K) =>{
    typeof (item[value]) === 'string' ? item[value] = e.target.value : item[value] = e.target.valueAsNumber;
    setItem(item)
  }

  return (
    <div style={{ 'maxHeight': '80vh', 'overflow': 'auto' }}>
      <Row justify="space-between">
        <Col span={4}><MyBreadcrumb /></Col>
        <Col span={4}>{isEdit ? <Button onClick={saveProduct}>Save the product</Button> : <Button type='primary' onClick={() => setIsEdit(!isEdit)}>Edit Product Information</Button>}</Col>
      </Row>
      <Divider />
      <Descriptions title={`Product ID: ` + key} layout="vertical" labelStyle={{ 'fontWeight': '700' }} bordered >
        {/* below code map the description item object, the problem here is it cannot set the style for some certain line */}
        {/* {Object.keys(descriptionItem).map((key) => {
          console.log(key);

          if (key === 'description') {
            return <Descriptions.Item label={key} key={key} span={3} labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='text' defaultValue={descriptionItem[key]} onChange={(e) => updateProduct(e, key)} /> : descriptionItem[key]}</Descriptions.Item>
          }
          else if (key === 'subTitle') {
            return <Descriptions.Item label={key} key={key} span={2} labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='text' defaultValue={descriptionItem[key]} onChange={(e) => updateProduct(e, key)} /> : descriptionItem[key]}</Descriptions.Item>
          }
          else {
            return <Descriptions.Item key={key} label={key} labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='text' defaultValue={descriptionItem[key]} onChange={(e) => updateProduct(e, key)} /> : descriptionItem[key]}</Descriptions.Item>
          }
        })} */}
        <Descriptions.Item label="Product Name" >{isEdit ? <Input type='text' defaultValue={item.product_name} onChange={(e) => updateProduct(e, 'product_name')} /> : item.product_name}</Descriptions.Item>
        <Descriptions.Item label="Unit Price $" >{isEdit ? <Input type='number' defaultValue={item.unit_price} onChange={(e) => updateProduct(e, 'unit_price')} /> : item.unit_price}</Descriptions.Item>
        <Descriptions.Item label="Discount" >{isEdit ? <Input type='number' defaultValue={item.discount} onChange={(e) => updateProduct(e, 'discount')} /> : item.discount}</Descriptions.Item>
        <Descriptions.Item label="Category ID" >
          {isEdit ? <Input type='number' defaultValue={item.categoryId} onChange={(e) => updateProduct(e, 'categoryId')} /> : item.categoryId}
        </Descriptions.Item>
        <Descriptions.Item label="Category Name" >
          {isEdit ? <Input type='text' defaultValue={item.categoryName} onChange={(e) => updateProduct(e, 'categoryName')} /> : item.categoryName}
        </Descriptions.Item>
        <Descriptions.Item label="Product Type Id">
          {isEdit ? <Input type='number' defaultValue={item.prodTypeId} onChange={(e) => updateProduct(e, 'prodTypeId')} /> : item.prodTypeId}
        </Descriptions.Item>
        <Descriptions.Item label="Title" >{isEdit ? <Input type='text' defaultValue={item.title} onChange={(e) => updateProduct(e, 'title')} /> : item.title}</Descriptions.Item>
        <Descriptions.Item label="Sub Title" span={2}>
          {isEdit ? <Input type='text' defaultValue={item.subTitle} onChange={(e) => updateProduct(e, 'subTitle')} /> : item.subTitle}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={3}>
          {isEdit ? <Input type='text' defaultValue={item.description} onChange={(e) => updateProduct(e, 'description')} /> : item.description}
        </Descriptions.Item>
        <Descriptions.Item label="Picture" ><img style={{ 'maxHeight': '500px' }} src={productMedia.length >= 1 ? `https://storage.googleapis.com/luxe_media/wwwroot/${productMedia[0].url}` : undefined} alt='picture'></img></Descriptions.Item>
        <Descriptions.Item label="Create On" span={2}>{item.createOn}</Descriptions.Item>
        <Descriptions.Item label="Available Stock" >{isEdit ? <Input type='number' defaultValue={item.availableStock} onChange={(e) => updateProduct(e, 'availableStock')} /> : item.availableStock}</Descriptions.Item>
        <Descriptions.Item label="Total Stock" >{isEdit ? <Input type='number' defaultValue={item.totalStock} onChange={(e) => updateProduct(e, 'totalStock')} /> : item.totalStock}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

