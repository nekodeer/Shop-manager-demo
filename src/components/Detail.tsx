import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Descriptions, Divider, Input, Row, Col, Button, message,Image } from 'antd';
import MyBreadcrumb from './Breadcrumb';
import { AddNewProductApi, UpdateProduct } from '../request/api'
import { IDetailItem } from '../types/data';
import { GetProductListNew } from '../request/api';
import UploadPic from './UploadPic';
import moment from 'moment';

export default function Detail() {
  // const location: any = useLocation();
  // const key: number = location.state;
  // const product = location.state[0];
  // console.log(product);
  const navigate = useNavigate()

  //Get the key from the params, if params does not exist which means it is not for a specific product hence in creating mode
  const params = useParams();
  const key = params.id;


  const [isEdit, setIsEdit] = useState<boolean>(false)
  // const [item, setItem] = useState<any>({})
  const [picture, setPicture] = useState<File>()
  const [imgURL, setImgURL] = useState<any>()
  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState<'' | 'error'>('')
  const [item, setItem] = useState<IDetailItem>({
    id:0,
    key: 0,
    category_id: '',
    price: '',
    description: '',
    title: '',
    created_at: '',
    updated_at: '',
    is_active: 0,
    product_image: ''
  })

  useEffect(() => {
    if (key !== null && key !== undefined) {
      GetProductListNew().then((res: any) => {
        const item = res.filter((item:IDetailItem) => item.id.toString() === key)
        setItem(item[0])
        refresh && setTimeout(() => setRefresh(false))
      }, (err) => {
        message.error(err)
      })
    }
  }, [refresh])

  // for (let i in item) {
  //   if (item[i] === null) {
  //     item[i] = 'unknown'
  //   }
  // }
  // const { key, product_image } = product;

  const formData: FormData = new FormData();
  const addFormData = () => {
    formData.append('title', item.title.toString())
    formData.append('price', item.price.toString())
    formData.append('description', item.description.toString())
    formData.append('is_active', item.is_active.toString())
    formData.append('category_id', item.category_id.toString())
    if (picture) {
      formData.append('product_image', picture)
    }
  }
  const saveProduct = () => {
    //when key is null means no parameters sent from the parent components, indicate is create product mode
    if (key === null || key === undefined) {
      if (item.title === '' || item.category_id === '') {
        message.error('At least you have to enter the product title and the category ID')
        setStatus('error')
      }
      else {
        addFormData();
        setIsEdit(!isEdit);
        setStatus('')
        AddNewProductApi(formData).then((res: any) => {
          setRefresh(true)
          message.success('Create product success!')
          navigate(`/home/edit/${res.id}`)
        })
      }
    }
    //edit the product
    else {
      setIsEdit(!isEdit);
      addFormData();
      formData.append('_method', 'put')
      // update the product information to server
      UpdateProduct(key, formData).then((res: any) => {
        console.log('server msg', res);
        message.success('Edit Product Success!')
        setRefresh(true)
        // navigate('/home/productlist')
      }, (err) => {
        message.error('something went wrong!', err)
      });
    }
  }

  const updateProduct = <K extends keyof IDetailItem>(e: any, value: K) => {
    typeof (item[value]) === 'string' ? item[value] = e.target.value : item[value] = e.target.valueAsNumber;
    setItem(item)
  }
  // below code is for uploading function which did not use the Antd 
  // //const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // const handleChange = (e: any) => {
  //   const file = e.target.files[0];
  //   setPicture(file)
  //   const reader = new FileReader();
  //   reader.onload = function () {
  //     const result = this.result;
  //     setImgURL(result)
  //   };
  //   reader.readAsDataURL(file)
  // }

  const handlePicture = (pictureFile: File) => {
    setPicture(pictureFile)
  }

  return (
    <div style={{ 'maxHeight': '80vh', 'overflow': 'auto' }}>
      <Row justify="space-between">
        <Col span={4}><MyBreadcrumb /></Col>
        <Col span={4}>{isEdit ? <Button onClick={saveProduct}>Save the product</Button> : <Button type='primary' onClick={() => setIsEdit(!isEdit)}>Edit Product Information</Button>}</Col>
      </Row>
      <Divider />
      <Descriptions title={key === null || key === undefined ? '' : `Product ID: ${key}`} layout="vertical" labelStyle={{ 'fontWeight': '700' }} bordered >
        <Descriptions.Item label="Title" >
          {isEdit ? <Input type='text' status={status} placeholder={status === 'error' ? 'Enter the title!' : ''} defaultValue={item.title} onChange={(e) => updateProduct(e, 'title')} /> : item.title}</Descriptions.Item>
        <Descriptions.Item label="Category ID" >
          {isEdit ? <Input type='number' status={status} placeholder={status === 'error' ? 'Enter the category ID!' : ''} defaultValue={item.category_id} onChange={(e) => updateProduct(e, 'category_id')} /> : item.category_id}
        </Descriptions.Item>
        <Descriptions.Item label="Unit Price $" >{isEdit ? <Input type='number' defaultValue={item.price} onChange={(e) => updateProduct(e, 'price')} /> : item.price}</Descriptions.Item>
        <Descriptions.Item label="is_active" >{isEdit ? <Input type='number' defaultValue={item.is_active} onChange={(e) => updateProduct(e, 'is_active')} /> : item.is_active}</Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {isEdit ? <Input type='text' defaultValue={item.description} onChange={(e) => updateProduct(e, 'description')} /> : item.description}
        </Descriptions.Item>
        <Descriptions.Item label="Create On" >{item.created_at?moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a'):''}</Descriptions.Item>
        <Descriptions.Item label="Updated On" span={2}>{moment(item.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</Descriptions.Item>
        <Descriptions.Item label="Picture" >
        {item.product_image === ''? null:<Image style={{ 'maxHeight': '200px' }} src={`https://app.spiritx.co.nz/storage/${item.product_image}`} alt='picture'>
          </Image>}
          {/* <br />
          {isEdit?<input type="file" onChange={handleChange} name="file" />:null} */}
        </Descriptions.Item>
        {isEdit ? <Descriptions.Item label="Upload A New Picture" >
          <UploadPic handlePicture={(pic) => handlePicture(pic)} />
        </Descriptions.Item> : null}
      </Descriptions>
    </div>
  )
}

