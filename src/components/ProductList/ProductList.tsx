import React, { Fragment, useEffect, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, message, Button, Space, Row, Col, Alert } from 'antd';
import { AddNewProductApi, DeleteProduct, GetProductListNew, RequestApi, UpdateProduct } from '../../request/api';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar'
import QuickAddItem from '../QuickAddItem'
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { useNavigate } from 'react-router-dom';
import { NewProduct, Item } from '../../types/data';

interface fnPropInterface {
  (a: string, b?: string): void
}


const originData: Item[] = [];
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

//for each cell
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

//editable table from Antd
const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>(originData);
  const [editingKey, setEditingKey] = useState<string | number>('');
  const [isSearch, setisSearch] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const navigate = useNavigate();

  const handleDelete = (key: React.Key) => {
    DeleteProduct(key).then((res: any) => {
      if (res === true) {
        setData(data.filter(item => item.key !== key))
      }
    },
      (err) => console.log(err))
  };

  useEffect(() => {
    GetProductListNew().then((res: any) => {
      //replace the key of prodID to 'key'
      // const newRes = JSON.parse(JSON.stringify(res).replace(/id/g, 'key'))
      const item: Item[] = res.map((dataObj: any) => {
        if (dataObj.category_id) {
          // return { key: dataObj.id, title: dataObj.title, category_id: dataObj.category_id, price: dataObj.price, ...dataObj }
          return { key: dataObj.id, ...dataObj }
        }
        else {
          // return { key: dataObj.id, title: dataObj.title, category_id: "Undefined Category", price: dataObj.price, ...dataObj }
          return { key: dataObj.id, category_id: "Undefined Category", ...dataObj }
        }
      })
      setData(item)
    })
  }, [isSearch])

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ title: '', category_id: '', price: '', ...record });

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
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      //Prepare the updated product in require format
      const updatedItem: NewProduct = { title: newData[index].title, is_active: newData[index].is_active, price: newData[index].price, description: newData[index].description, category_id: newData[index].category_id }
      console.log(updatedItem);

      // update the product information to server
      UpdateProduct(newData[index].key, updatedItem).then((res) => {
        console.log('server msg', res);
        message.success('Edit Product Success!')
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'key',
      width: '10%',
      editable: false,
      sorter: (a: Item, b: Item) => a.key - b.key,
    },
    {
      title: 'Name',
      dataIndex: 'title',
      width: '25%',
      editable: true,
      render: (_: any, record: Item) => {
        return <a href='#' onClick={(e) => {
          e.preventDefault();
          navigate('/index/edit/' + record.key,
            {
              replace: false,
              state: data.filter((o) => o.key === record.key,)
            })
        }}>{record.title}</a>
      },
      sorter: (a: Item, b: Item) => a.title.localeCompare(b.title)
    },
    {
      title: 'Category ID',
      dataIndex: 'category_id',
      width: '25%',
      editable: true,
      // sorter: (a: Item, b: Item) => a.category_id.localeCompare(b.category_id)
      sorter: (a: Item, b: Item) => a.category_id - b.category_id,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '10%',
      editable: true,
      sorter: (a: Item, b: Item) => a.price - b.price,
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
            {/* <Typography.Link disabled={editingKey !== ''} onClick={() => navigate('/index/edit/' + record.key, { replace: false, state: data.filter((o) => o.key === record.key,) })}> */}
            <Typography.Link disabled={editingKey !== ''} onClick={() => navigate('/index/edit/' + record.key, { replace: false, state: record.key })}>
              {/* <Link to={`/index/edit/${record.key}`}>View Product Detail</Link> */}
              <Button size='small'>View/Edit Product Detail</Button>
            </Typography.Link>
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
        inputType: col.dataIndex === 'title' || 'category_id' ? 'string' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  //filter the data to match the product category and set the data array
  const searchProp: fnPropInterface = (arg, option) => {
    if (arg === '') {
      setisSearch(!isSearch)
    } else {
      //search by category ID
      const newData = option === 'Category' ? data.filter((data: Item) => {
        // return data.product_category.toLowerCase() === arg.toLowerCase()
        return data.category_id === parseInt(arg)
      }) : option === 'Title' ? data.filter((data: Item) => {
        return data.title.toLowerCase().match(arg.toLowerCase())
      }) : data.filter((data: Item) => {
        return data.key === parseInt(arg)
      })
      setData(newData);
      if (newData.length === 0) {
        message.error('no product found!')
        setisSearch(!isSearch);
      }
    }
  }
  //get new product from quick add item component
  const getNewProduct = (product: NewProduct): void => {
    // setData([...data, product])
    setIsAdding(false);
    AddNewProductApi(product).then((res: any) => {
      const newRes = { key: res.id, ...res }
      setData([...data, newRes])
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
      <Row justify='space-between' style={{ 'minHeight': '60px' }} align='middle'>
        <Col lg={{ span: 6 }}><SearchBar searchProp={(arg, option) => searchProp(arg, option)} /></Col>
        <Col><Button onClick={()=>navigate('/index/edit')}>Create product in Detail Mode</Button></Col>
        <Col lg={{ span: 14 }}>
          <Row justify='space-between'>
            <Col>
              {isAdding ?
                <Space size='large'>
                  <Button style={{ width: 150 }} onClick={() => setIsAdding(false)}>Cancel Adding</Button>
                </Space>
                : <Button style={{ width: 150 }} onClick={() => setIsAdding(true)}>Quick Add Product</Button>}
            </Col>
            <Col><QuickAddItem isAdding={isAdding} getNewProduct={(e: NewProduct) => getNewProduct(e)} /></Col>
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
            pageSize: 10
          }}
        />
      </Form>
    </Fragment>
  );
};

export default EditableTable