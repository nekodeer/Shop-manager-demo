import React, { Fragment, useEffect, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, message, Button, Space, Row, Col, Alert } from 'antd';
import { AddNewProductApi, RequestApi, UpdateProduct } from '../../request/api';
import SearchBar from '../SearchBar'
import QuickAddItem from '../QuickAddItem'
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

export interface Item {
  key: string | number;
  product_name: string;
  product_category: string;
  unit_price: number;
}

interface fnPropInterface {
  (a: string, b?: string): void
}

interface getProduct{
  (product:Item):void
}

interface ProductObj {
  product_name: string;
  product_category: string;
  unit_price: number;
  id: string | number;
}

const originData: Item[] = [];
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
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
  const [data, setData] = useState<Item[]>(originData);
  const [editingKey, setEditingKey] = useState<string | number>('');
  const [searchData, setSearchData] = useState<boolean>(false);
  const [initData, setInitData] = useState<Item[]>(originData);
  const [isAdding, setIsAdding] = useState<boolean>(false)
  // const [newProduct, setNewProduct] = useState<object>({})
  const handleDelete = (key: React.Key) => {
    setData(data.filter(item => item.key !== key))
  };

  useEffect(() => {
    RequestApi().then(res => {
      const item = res.data.map((dataObj: ProductObj) => ({ ...dataObj, key: dataObj.id }))
      setData(item)
      setInitData(item)
    })
  }, [searchData])

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ product_name: '', product_category: '', unit_price: '', ...record });

    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        //update the product information to server
        UpdateProduct({ ...item, id: item.key }).then((res) => {
          message.success(res.data.productCheck.update + res.data.token)
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'product_name',
      width: '30%',
      editable: true,
      sorter: (a: Item, b: Item) => a.product_name.localeCompare(b.product_name)
    },
    {
      title: 'Category',
      dataIndex: 'product_category',
      width: '30%',
      editable: true,
      sorter: (a: Item, b: Item) => a.product_category.localeCompare(b.product_category)
    },
    {
      title: 'Price',
      dataIndex: 'unit_price',
      width: '15%',
      editable: true,
      sorter: (a: Item, b: Item) => a.unit_price - b.unit_price,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      responsive: ['md'] as Breakpoint[],
      render: (_: any, record: Item) => {
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
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              <Button size='small'>Edit</Button>
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
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'product_name' || 'product_category' ? 'string' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  //filter the data to match the product category and set the data array
  const searchProp: fnPropInterface = (arg, option) => {
    if (arg === '') {
      setSearchData(!searchData)
    } else {
      const newData = option === 'Category' ? initData.filter((data: Item) => {
        return data.product_category.toLowerCase() === arg.toLowerCase()
      }) : initData.filter((data: Item) => {
        return data.product_name.toLowerCase().match(arg.toLowerCase())
      })
      setData(newData);
      if (newData.length === 0) {
        message.error('no product found!')
        setSearchData(!searchData);
      }
    }
  }
  //get new product from quick add item component
  const getNewProduct:getProduct = (product) => {
    setData([...data, product])
    setIsAdding(false);
    AddNewProductApi(product).then((res) => {
      message.info(res.data.productCheck.update)
    })
  }

  return (
    <Fragment>
      <Alert
        banner={true}
        description="For this page, the product data IS received from the server. Single cell is NOT editable, but you can click the Edit button to edit the whole row."
        type="info"
        showIcon
      />
        <Row justify='space-between' style={{'minHeight':'60px'}} align='middle'>
          <Col lg={{ span: 6 }}><SearchBar searchProp={(arg, option) => searchProp(arg, option)} /></Col>
          <Col lg={{ span: 14 }}>
            <Row justify='space-between'>
              <Col>
                {isAdding ?
                  <Space size='large'>
                    <Button style={{ width: 150 }} onClick={() => setIsAdding(false)}>Cancel Adding</Button>
                  </Space>
                  : <Button style={{ width: 150 }} onClick={() => setIsAdding(true)}>Quick Add Product</Button>}
              </Col>
              <Col><QuickAddItem isAdding={isAdding} getNewProduct={(e: Item) => getNewProduct(e)} /></Col>
            </Row>
          </Col>
        </Row>
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
            pageSize: 7
          }}
        />
      </Form>
    </Fragment>
  );
};

export default EditableTable