import React from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoginApi } from '../request/api';
import { Link } from 'react-router-dom';
import axios from 'axios';

//when submit the form, the values must contains the username and the password
type LoginDetail = {
  email: string,
  password: string
}

export default function Login() {

  const navigate = useNavigate();

  const onFinish = (values: LoginDetail) => {
    localStorage.clear()
    const params = { email: values.email, password: values.password }
    LoginApi(params).then((res: any) => {
      if (res.token) {
        const { token, user_id } = res.token
        const { created_at, email, role, updated_at } = res.user
        localStorage.setItem('email', email)
        localStorage.setItem('user_id', user_id)
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('created_at', created_at)
        localStorage.setItem('updated_at', updated_at)
        message.success('Login Success')
        setTimeout(() => navigate('/home'), 1500)
      } else {
        message.error('Something error occur, please try again later')
      }
    }, (err) => {
      console.log(err)
      message.error('Login Failed, check your username/password!')
    })
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
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input placeholder='Email' />
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
