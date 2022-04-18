import { useEffect, useState } from 'react'
import { Pagination, Button, message, Divider, Alert } from 'antd';
import { RequestApi } from '../../request/api';

export default function ProductListEditRow() {

  const [rawData, setRawData] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [curPage, setCurpage] = useState<number>(1);
  const [totalItem, settotalItem] = useState<number>(1);
  const [currentdata, setCurrentdata] = useState<any[]>([])
  const pagesize = 6;

  const spliceResult = (result: any[], dataArray: object[]) => {
    for (let i = 0, len = dataArray.length; i < len; i += pagesize) {
      result.push(dataArray.slice(i, i + pagesize));
    }
  }

  //process data array according to the pagination
  useEffect(() => {
    //divide the original data array into small arrays, each small array contains the element of the current page
    //save the result to a state, set the initial page data to the 1 element of the result group
    //when page changes, set the data with the result element according to pages, 
    //since the state of the data changes, it render different data without sending ajax request
    RequestApi().then((res) => {
      let result: any[] = [];
      spliceResult(result, res.data);
      setData(result[curPage - 1])
      setCurrentdata(result);
      setRawData(res.data)
      settotalItem(res.data.length)
    }, (err) => { console.log(err) })
  }, [totalItem])

  //when click the page, get the page number and set the data according to the page
  const getPage = (e: number) => {
    setCurpage(e);
    setData(currentdata[e - 1])
  }

  //delete the row
  const deleteRow = (id: number) => {
    const newData = data.filter((dataObj) => {
      return dataObj.id !== id;
    })
    setData(newData)
  }

  const [editRow, setEditRow] = useState({ status: false, id: 0 })
  const editCurRow = (id: number) => {
    setEditRow({ status: true, id })
    const product = data.filter((o) => o.id === id)
    setProduct(product[0])
  }
  //save the value of the cell into product state when editing row, then replace it in the data array
  const [product, setProduct] = useState({
    id: 0,
    product_name: '',
    product_category: '',
    unit_price: ''
  })

  const saveRow = (id: number) => {
    setEditRow({ status: false, id: id })
    // setEditRow({status:false,id})
    data.forEach((dataObj) => {
      if (dataObj.id === product.id) {
        return { ...dataObj, ...product }
      }
    })
    setData(data);
    //set the product value to initial state after save the row to prevent its value being used by other row
    setProduct({
      id: 0,
      product_name: '',
      product_category: '',
      unit_price: ''
    })
  }

  const [addButton, setAddButton] = useState(false);
  const addProduct = () => {
    setAddButton(!addButton)
  }

  //add a new product means the raw data change, for pagination need to recalculate the result array
  const saveNewProduct = () => {
    if (product.unit_price === '' || product.product_category === '' || product.product_name === '') {
      message.error('Please check the product info you entered!')
    }
    else {
      let result: any[] = [];
      spliceResult(result, [...rawData, product])
      setRawData([...rawData, product])
      setCurrentdata(result);
      setData([...data, product])
      setAddButton(false)
    }
  }
  return (
    <div>
      <Alert
        banner={true}
        message="Important Informational"
        description="For this page, the product data IS received from the server. Single cell is NOT editable, but you can click the Edit button to edit the whole row."
        type="info"
        showIcon
      />
      <Divider />
      <Button className='primary' onClick={addProduct}>{addButton ? 'Cancel Add' : ' Add New Product'}</Button>
      <Divider />
      <table className="table">
        <thead>
          <tr className='tr'>
            <th className='th'>#</th>
            <th className='th'>Name</th>
            <th className='th'>Category</th>
            <th className='th'>Price</th>
            <th className='th'>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data: any) => {
            return <tr className='tr' key={data.id}>
              <td scope="row" className='td'>{data.id}</td>
              <td className='td'>{editRow.status && editRow.id === data.id ? <input type="text" defaultValue={data.product_name} onChange={(e) => setProduct({ ...product, id: data.id, product_name: e.target.value })} /> : <p>{data.product_name}</p>}</td>

              <td className='td'>{editRow.status && editRow.id === data.id ? <input type="text" defaultValue={data.product_category} onChange={(e) => setProduct({ ...product, id: data.id, product_category: e.target.value })} /> : <p>{data.product_category}</p>}</td>

              <td className='td'>{editRow.status && editRow.id === data.id ? <input type="text" defaultValue={data.unit_price} onChange={(e) => setProduct({ ...product, id: data.id, unit_price: e.target.value })} /> : <p>{data.unit_price}</p>}</td>
              <td className='td'>
                {editRow.id === data.id && (editRow.status) ? <Button size='small' onClick={() => saveRow(data.id)}>Save</Button> : <Button size='small' onClick={() => editCurRow(data.id)}>Edit</Button>}&nbsp;
                <Button size='small' onClick={() => deleteRow(data.id)}>DELETE</Button>
              </td>
            </tr>
          })}
          {addButton ? <tr className='tr'>
            <th className='th'>{rawData.length + 1}</th>
            <th className='th'><input type="text" onChange={(e) => setProduct({ ...product, id: rawData.length + 1, product_name: e.target.value })} /></th>
            <th className='th'><input type="text" onChange={(e) => setProduct({ ...product, id: rawData.length + 1, product_category: e.target.value })} /></th>
            <th className='th'><input type="text" onChange={(e) => setProduct({ ...product, id: rawData.length + 1, unit_price: e.target.value })} /></th>
            <th className='th'><Button size='small' onClick={saveNewProduct}>Save</Button></th>
          </tr> : null}
        </tbody>
      </table>
      <Pagination
        total={totalItem}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        defaultPageSize={pagesize}
        defaultCurrent={1}
        onChange={(e) => getPage(e)}
      />
    </div>
  )
}