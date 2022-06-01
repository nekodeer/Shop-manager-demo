import { DeleteTimesheet, GetTimesheet, UpdateTimesheet } from '../../../request/api'
import AddTimeSlot from './AddTimeslot'
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Space, Button, message, Divider, Select } from 'antd';
import {ITimeSlot} from '../../../types/data'

interface ITimeSheetItem {
  key: number;
  start: string;
  task_id:number;
  end: number;
  status: string;
  comments?: string
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: ITimeSheetItem;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>();
  const [editingKey, setEditingKey] = useState<string | number>('');
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const params = Number(localStorage.getItem('user_id'))
    GetTimesheet(params).then((res: any) => {
      console.log(res);  
      const newRes: ITimeSheetItem[] = res.map((resObj: any) => {
        Object.keys(resObj).forEach((item) => {
          if (resObj[item] === "" || resObj[item] === null || resObj[item] === undefined) {
            resObj[item] = 'Unknown';
          }
        });
        return { ...resObj, key: resObj.id }
      })
      setData(newRes)
      refresh && setTimeout(() => setRefresh(false))
    }, (err) => { throw new Error(err) }
    )
  }, [refresh])

  const isEditing = (record: ITimeSheetItem) => record.key === editingKey;

  const edit = (record: Partial<ITimeSheetItem> & { key: React.Key }) => {
    form.setFieldsValue({ start: '', end: '', id: '', status: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  //select status
  const { Option } = Select;
  const [selectStatus, setSelectStatus] = useState('')
  function handleSelect(value: string) {
    setSelectStatus(value)
    console.log(`selected ${value}`);
  }
  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as ITimeSheetItem;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        newData[index].status = selectStatus
          setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      const updatedTimesheet:ITimeSlot = {
        start: newData[index].start,
        end: newData[index].end,
        task_id: Number(newData[index].task_id),
        comments: newData[index].comments
      }
      UpdateTimesheet(key, updatedTimesheet).then((res: any) => {
        message.success('Update success', res)
      }, (err) => message.error('something went wrong!', err))

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  //delete the time slot then refresh the page
  const handleDelete = (key: React.Key) => {
    DeleteTimesheet(key).then((res: any) => {
      setRefresh(true)
    }, (err) => message.error('something went wrong!', err)
    )
  };

  const columns = [
    {
      title: 'Task id',
      dataIndex: 'task_id',
      width: '10%',
      sorter: (a:ITimeSheetItem, b:ITimeSheetItem) => a.task_id-b.task_id,
      editable: true,
    },
    {
      title: 'start',
      dataIndex: 'start',
      width: '20%',
      editable: true,
    },
    {
      title: 'end',
      dataIndex: 'end',
      width: '20%',
      editable: true,
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   width: '15%',
    //   editable: true,
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '15%',
      render: (_: any, record: ITimeSheetItem) => {
        const editable = isEditing(record);

        // return editable ? (
        //   <span>
        //     <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
        //       Saveid
        //     </Typography.Link>
        //     <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
        //       <a>Cancel</a>
        //     </Popconfirm>
        //   </span>
        // ) : (
        //   <Space size='large'>
        //    <select name="" id=""></select>
        //   </Space>
        // );
        return editable ? (<Select defaultValue={record.status} onSelect={handleSelect}>
          <Option value="new">new</Option>
          <Option value="confirmed">confirmed</Option>
        </Select>) : (<span>
          {record.status}
        </span>)
      },
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      width: '15%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: ITimeSheetItem) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size='large'>
            <Typography.Link disabled={editingKey !== ''} onClick={() => {
              edit(record);
              // set the select state to the default value of this row
              setSelectStatus(record.status)
              }}>
              Edit
            </Typography.Link>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <Button size='small'>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ITimeSheetItem) => ({
        record,
        inputType: col.dataIndex === 'task_id' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  //pass the refresh state to AddTimeslot component, wait for child component send the state back
  const onSetRefresh = (refresh: boolean) => {
    setRefresh(refresh);
  }

  return (
    <Fragment>
      <AddTimeSlot setRefresh={onSetRefresh} />
      <Divider />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </Fragment>
  );
};

export default () => <EditableTable />;
