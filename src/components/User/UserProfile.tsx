import React from 'react'
import { Avatar, Descriptions, Input, Form, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UpdatePassword } from '../../request/api';
import moment from 'moment';

export default function UserProfile() {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  const onFinish = (values: any) => {
    UpdatePassword({password:values.password}).then((res) => {
      message.success(`Status: ${res}, password updated`)
    })
  };
  
  return (
    <div>
      <Descriptions title="User Info" layout="vertical" bordered>

        <Descriptions.Item label="Avatar"><Avatar shape="square" size="large" icon={<UserOutlined />} /></Descriptions.Item>
        <Descriptions.Item label="UserName">{localStorage.email}</Descriptions.Item>
        <Descriptions.Item label="User ID">{localStorage.user_id}</Descriptions.Item>
        <Descriptions.Item label="Created On" span={3}>
          {moment(localStorage.created_at).format('MMMM Do YYYY, h:mm:ss a')}
        </Descriptions.Item>
        <Descriptions.Item label="Updated On" span={3}>
          {moment(localStorage.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
        </Descriptions.Item>
        <Descriptions.Item label="Edit Password">
          <Form
            {...formItemLayout}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
            labelAlign='left'
            style={{'maxWidth':'500px'}}
          >

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  pattern:RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$"),
                  message: 'Password should be at least 8 digits and contain at least 1 letter'
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  pattern:RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$"),
                  message: 'Password should be at least 8 digits and contain at least 1 letter'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}
