import React from 'react'
import { Avatar,Descriptions } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function UserProfile() {
  return (
    <div>
      <Descriptions title="User Info" layout="vertical" bordered>
        
        <Descriptions.Item label="Avatar"><Avatar shape="square" size="large" icon={<UserOutlined />} /></Descriptions.Item>
        <Descriptions.Item label="UserName">{localStorage.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{localStorage.email}</Descriptions.Item>
        <Descriptions.Item label="Address" span={1}>
          {localStorage.address}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}
