import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Descriptions, Divider, Input, Row, Col, Button, message } from 'antd';
import MyBreadcrumb from './Breadcrumb';

export default function Detail() {
  const location: any = useLocation();
  const product = location.state[0];
  const { key, product_name, category, unit_price, availableStock, description, totalStock, title, subTitle, createOn, discount,productMedia } = product;
  console.log(productMedia);
  
  // //below code get some part of the key and value from product object and combile them to a new object for mapping
  // const pick = (obj: any, arr: any) => arr.reduce((iter: any, val: any) => (val in obj && (iter[val] = obj[val]), iter), {})
  // let descriptionItem = pick(product, ['product_name', 'unit_price', 'discount', 'title', 'subTitle', 'description', ' createOn', 'availableStock', 'totalStock'])
  // descriptionItem = { ...descriptionItem, categoryId: category.categoryId, categoryName: category.categoryName, prodTypeId: category.prodTypeId }

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
    <div style={{'maxHeight':'80vh','overflow':'auto'}}>
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
        <Descriptions.Item label="Product Name" >{isEdit ? <Input type='text' defaultValue={product_name} onChange={(e) => updateProduct(e, 'product_name')} /> : product_name}</Descriptions.Item>
        <Descriptions.Item label="Unit Price $" >{isEdit ? <Input type='number' defaultValue={unit_price} onChange={(e) => updateProduct(e, 'unit_price')} /> : unit_price}</Descriptions.Item>
        <Descriptions.Item label="Discount" >{isEdit ? <Input type='number' defaultValue={discount} onChange={(e) => updateProduct(e, 'discount')} /> : discount}</Descriptions.Item>
        <Descriptions.Item label="Category ID" >
          {category ? isEdit ? <Input type='number' defaultValue={category.categoryId} onChange={(e) => updateProduct(e, 'categoryId')} /> : category.categoryId : `undefined`}
        </Descriptions.Item>
        <Descriptions.Item label="Category Name" >
          {category ? isEdit ? <Input type='text' defaultValue={category.categoryName} onChange={(e) => updateProduct(e, 'categoryName')} /> : category.categoryName : `undefined`}
        </Descriptions.Item>
        <Descriptions.Item label="Product Type Id">
          {category ? isEdit ? <Input type='number' defaultValue={category.prodTypeId} onChange={(e) => updateProduct(e, 'prodTypeId')} /> : category.prodTypeId : `undefined`}
        </Descriptions.Item>
        <Descriptions.Item label="Title" >{isEdit ? <Input type='text' defaultValue={title} onChange={(e) => updateProduct(e, 'title')} /> : title}</Descriptions.Item>
        <Descriptions.Item label="Sub Title" span={2}>
          {isEdit ? <Input type='text' defaultValue={subTitle} onChange={(e) => updateProduct(e, 'subTitle')} /> : subTitle}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={3}>
          {isEdit ? <Input type='text' defaultValue={description} onChange={(e) => updateProduct(e, 'description')} /> : description}
        </Descriptions.Item>
        <Descriptions.Item label="Picture" ><img src = {productMedia.length>=1?`https://storage.googleapis.com/luxe_media/wwwroot/${productMedia[0].url}`:undefined} alt='picture'></img></Descriptions.Item>
        <Descriptions.Item label="Create On" span={2}>{createOn}</Descriptions.Item>
        <Descriptions.Item label="Available Stock" >{isEdit ? <Input type='number' defaultValue={availableStock} onChange={(e) => updateProduct(e, 'availableStock')} /> : availableStock}</Descriptions.Item>
        <Descriptions.Item label="Total Stock" >{isEdit ? <Input type='number' defaultValue={totalStock} onChange={(e) => updateProduct(e, 'totalStock')} /> : totalStock}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

