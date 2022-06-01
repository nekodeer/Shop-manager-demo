import { Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function MyBreadcrumb() {
  const navigate = useNavigate();
  return (
    <Breadcrumb separator=">">
      <Breadcrumb.Item href="#" onClick={(e) => {e.preventDefault();navigate('/index')}}>index</Breadcrumb.Item>
      <Breadcrumb.Item href="#" onClick={(e) => {e.preventDefault();navigate('/index/productlist')}}>Product List</Breadcrumb.Item>
      <Breadcrumb.Item>Product Info</Breadcrumb.Item>
    </Breadcrumb>
  )
}
