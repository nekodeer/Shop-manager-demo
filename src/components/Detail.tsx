import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Descriptions, Divider, Input, Row, Col, Button, message } from 'antd';
import MyBreadcrumb from './Breadcrumb';
import {UpdateProduct} from '../request/api'
import UploadPic from './UploadPic';

interface IDetailItem {
  key: number,
  category_id: string | number,
  price: number,
  description: string,
  title: string,
  created_at?: string,
  updated_at?: string,
  is_active: number,
  product_image: string
}

export default function Detail() {
  const location: any = useLocation();
  const product = location.state[0];
  for (let i in product) {
    if (product[i] === null) {
      product[i] = 'unknown'
    }
  }
  const { key, category_id, price, description, title, created_at, updated_at, is_active, product_image } = product;

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [item, setItem] = useState<IDetailItem>(product)
  const [imgURL,setImgURL] = useState<string>('')
  const saveProduct = () => {
    setIsEdit(!isEdit);
    const updatedItem = { title: item.title, is_active: item.is_active, price: item.price, description: item.description, category_id: item.category_id }
    // update the product information to server
    UpdateProduct(item.key, updatedItem).then((res) => {
      console.log('server msg', res);
      message.success('Edit Product Success!')
    });
  }

  const updateProduct = <K extends keyof IDetailItem>(e: any, value: K) => {
    typeof (item[value]) === 'string' ? item[value] = e.target.value : item[value] = e.target.valueAsNumber;
    setItem(item)
  }

  const handlePicture = (picture:any) =>{
    console.log(picture);  
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
        {/* {Object.keys(item).map((key) => {
            return <Descriptions.Item label={key} key={key} labelStyle={{ 'fontWeight': '700' }}>{isEdit ? <Input type='text' defaultValue={item[key as keyof IDetailItem]} onChange={(e) => updateProduct(e, key as keyof IDetailItem)} /> : item[key as keyof IDetailItem]}</Descriptions.Item>
        })} */}
        <Descriptions.Item label="Title" >{isEdit ? <Input type='text' defaultValue={item.title} onChange={(e) => updateProduct(e, 'title')} /> : item.title}</Descriptions.Item>
        <Descriptions.Item label="Category ID" >
          {isEdit ? <Input type='number' defaultValue={item.category_id} onChange={(e) => updateProduct(e, 'category_id')} /> : item.category_id}
        </Descriptions.Item>
        <Descriptions.Item label="Unit Price $" >{isEdit ? <Input type='number' defaultValue={item.price} onChange={(e) => updateProduct(e, 'price')} /> : item.price}</Descriptions.Item>
        <Descriptions.Item label="is_active" >{isEdit ? <Input type='number' defaultValue={item.is_active} onChange={(e) => updateProduct(e, 'is_active')} /> : item.is_active}</Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {isEdit ? <Input type='text' defaultValue={item.description} onChange={(e) => updateProduct(e, 'description')} /> : item.description}
        </Descriptions.Item>
        <Descriptions.Item label="Create On" >{item.created_at}</Descriptions.Item>
        <Descriptions.Item label="Updated On" span={2}>{item.updated_at}</Descriptions.Item>
        <Descriptions.Item label="Picture" >
          <img style={{ 'maxHeight': '500px' }} src={product_image.length >= 1 ? imgURL : undefined} alt='picture'>
          </img>
         {isEdit?<UploadPic handlePicture={(pic)=>handlePicture(pic)}/>:null}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

