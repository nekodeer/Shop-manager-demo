import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

interface IProp {
  handlePicture: (a: any) => void
}



export default function UploadPic(props:IProp) {

  // const [fileList, setFileList] = useState<any>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { handlePicture } = props
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  //limit the picture size
  function beforeUpload(file: File) {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 / 1024 < 200;
    if (!isLt2M) {
      message.error('Image must smaller than 200kb!');
    }
    // default return false, and pass the picture file to Detail components
    handlePicture(file); 
    return false
  }
  // const onChange = ({ fileList: newFileList }) => {
  // const onChange = (e: any) => {
  //   let newFileList: any = [...e.fileList];
  //   newFileList = newFileList.slice(-1);
  //   setFileList(newFileList)
  // };

  // const onPreview = async (file: any) => {
  //   let src = file.url;
  //   if (!src) {
  //     src = await new Promise(resolve => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj);
  //       reader.onload = () => resolve(reader.result);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src)!;
  //   imgWindow.document.write(image.outerHTML);
  // };


  // const customRequest = (option:any) => {
  //   const formData = new FormData();
  //   formData.append('_method', 'put');
  //   formData.append('product_image',option.file);  
  //   UpdateProduct(1,formData).then((res) => console.log(res)
  //   )
  // }
  return (
    <ImgCrop rotate>
      <Upload
        name='product_image'
        beforeUpload={beforeUpload}
        listType="picture-card"
        // fileList={fileList}
        // onChange={onChange}
        // onPreview={onPreview}
      // customRequest ={customRequest }
      >
        {imageUrl ? <img src={imageUrl} alt="" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </ImgCrop>
  );
}
