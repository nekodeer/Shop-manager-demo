import React from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoginApi } from '../request/api';
import { Link } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate();

  const onFinish = (values: any) => {
    localStorage.clear()
    LoginApi({username:values.username, password:values.password}).then((res: any) => {
      if (res.code === '0000') {
        const {token,verifySuccess, userInfo} = res.data       
        if (verifySuccess) {
          const {username,email,address} = userInfo
          localStorage.setItem('username', username)
          localStorage.setItem('email', email)
          localStorage.setItem('address', address)
          localStorage.setItem('token',token)
          message.success('Login Sunccess')
          console.log(localStorage);
          
          setTimeout(() => navigate('/home'), 1500)
        }else{
          message.error('Login Failed, try again!')
        }
      }
    },
      err => console.log(err))
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    localStorage.clear()
  }

  return (
    <div className='loginBox'>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder='username' />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder='password' />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Link to='/register'>Not having an account? Click to Register</Link>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
