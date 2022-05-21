import React, { useState } from 'react'
import { Input, Space, Button, Form, message } from 'antd';
import { CreateTimeSlot } from '../../../request/api';
interface ITimeSlot {
  start: string,
  end: string,
  task_id: number,
  comments: string
}
interface IProps {
  setRefresh: (a: boolean) => void
}
export default function AddTimeslot(props:IProps) {
  const [form] = Form.useForm();
  const {setRefresh} = props
  const onFinish = (values: any) => {
    console.log('Success:', values);
    const params: ITimeSlot = { start: values.startTime, end: values.endTime, task_id: Number(values.taskId), comments: values.comments }
    form.resetFields();
    setRefresh(true)
    CreateTimeSlot(params).then((res) =>{
      message.success('Create Timeslot Success!')
      console.log(res);  
    },(err) => message.error('something wrong!', err))
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Space direction="horizontal" >
      <Form
        form={form}
        name="basic"
        layout='inline'
        labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="startTime"
          rules={[{ required: true, message: 'Please fill all input place!' }]}
        >
          <Input placeholder="start time" />
        </Form.Item>
        <Form.Item
          name="endTime"
          rules={[{ required: true, message: 'Please fill all input place!' }]}
        >
          <Input placeholder="end time" />
        </Form.Item>
        <Form.Item
          name="taskId"
          rules={[{ required: true, message: 'Please fill all input place!' }]}
        >
          <Input placeholder="task id" />
        </Form.Item>
        <Form.Item
          name="comments"
          rules={[{ required: true, message: 'Please fill all input place!' }]}
        >
          <Input placeholder="comments" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Add New Time Slot
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
