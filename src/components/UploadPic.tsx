import React, { useState } from 'react';
import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';

interface IProp {
  handlePicture: (a: any) => void
}

//limit the picture size
function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 / 1024 < 200;
  if (!isLt2M) {
    message.error('Image must smaller than 200kb!');
  }
  return isJpgOrPng && isLt2M;
}

export default function UploadPic(props: IProp) {

  const [fileList, setFileList] = useState<any>([]);
  const { handlePicture } = props
  // const onChange = ({ fileList: newFileList }) => {
  const onChange = (e: any) => {
    let newFileList = [...e.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList)
    handlePicture(newFileList)
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src)!;
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotate>
      <Upload
        beforeUpload={beforeUpload}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < 5 && '+ Upload'}
      </Upload>
    </ImgCrop>
  );
}
