import React from 'react'
import { Layout, Menu, Button, message, } from 'antd';
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { LoginApi } from '../request/api';
import { useEffect } from 'react';

export default function Home() {

  const { SubMenu } = Menu;
  const { Header, Content, Sider, Footer } = Layout;
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    navigate('/login')
  }
  // const testAxios = () => {
  //   LoginApi({ username: 'admin', password: '123456' }).then((res: any) => console.log(res), err => console.log(err))
  // }

  useEffect(() => {
    if (!localStorage.getItem('username')) {
      message.warning('Please login first!');
      setTimeout(() => {
        navigate('/login')
      }, 2000);
    }
  }, [localStorage])

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1" onClick={() => navigate('userProfile')}><span>{localStorage.getItem('username')}</span></Menu.Item>
          <Menu.Item key="2"><Button onClick={logOut}>Log Out</Button></Menu.Item>
          {/* <Menu.Item key="3"><Button onClick={testAxios}>Test</Button></Menu.Item> */}
        </Menu>
      </Header>
      <Layout style={{ overflow:'auto' }}>
        <Sider width={200} className="site-layout-background" breakpoint="lg" collapsedWidth="0">
          <Menu
            mode="inline"
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            theme="dark"
          >
            <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Manage Product">
              <Menu.Item key="1"><Link to='productlist'>Product List</Link></Menu.Item>
              <Menu.Item key="2"><Link to='productlist2'>Product Edit Both</Link></Menu.Item>
              <Menu.Item key="3"><Link to='productlist3'>Product Edit Cell </Link></Menu.Item>
              <Menu.Item key="4"><Link to='productlistEditRow'>Product Edit Row</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<UserOutlined />} title="User Profile">
              <Menu.Item key="21"><Link to='userProfile'>User Info</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center', backgroundColor: '#001529',color:'white' }} >Shop Manager @2022 Create by Lester</Footer>
    </Layout>
  )
}
