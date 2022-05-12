import { useEffect, useState } from 'react'
import { Pagination, Button, Input, Alert, Divider } from 'antd';
import { RequestApi } from '../../request/api';

interface ModifyRow{
  (id:number):void
}

type CellStatus={
  status?:boolean,
  id:number,
  name?:boolean,
  category?:boolean,
  price?:boolean
}

interface Product{
  id:number|string,
  product_name:string,
  product_category:string,
  unit_price:string
}

export default function ProductList2() {

  const [rawData, setRawData] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [curPage, setCurpage] = useState<number>(1);
  const [totalItem, settotalItem] = useState<number>(1);
  const [currentdata, setCurrentdata] = useState<any[]>([])
  const [pagesize,setPageSize] = useState<number>(10);

  const spliceResult = (result: any[], dataArray: object[]) => {
    for (let i = 0, len = dataArray.length; i < len; i += pagesize) {
      result.push(dataArray.slice(i, i + pagesize));
    }
  }

  //process data array according to the pagination
  // useEffect(() => {
  //   //divide the original data array into small arrays, each small array contains the element of the current page
  //   //save the result to a state, set the initial page data to the 1 element of the result group
  //   //when page changes, set the data with the result element according to pages, 
  //   //since the state of the data changes, it render different data without sending ajax request
  //   RequestApi().then((res) => {
  //     let result = [];
  //     for (let i = 0, len = res.data.length; i < len; i += pagesize) {
  //       result.push(res.data.slice(i, i + pagesize));
  //     }
  //     setData(result[curPage - 1])
  //     // setData(result)
  //     setCurrentdata(result);
  //     setRawData(res.data)
  //     settotalItem(res.data.length)
  //   }, (err) => { console.log(err) })
  // }, [totalItem])
  useEffect(() => {
    //divide the original data array into small arrays, each small array contains the element of the current page
    //save the result to a state, set the initial page data to the 1 element of the result group
    //when page changes, set the data with the result element according to pages, 
    //since the state of the data changes, it render different data without sending ajax request
    RequestApi().then((res: any) => {
      //replace the key of prodID to 'key'
      const newRes = JSON.parse(JSON.stringify(res).replace(/prodId/g, 'id'))
      const item: any = newRes.map((dataObj: any) => {
        if (dataObj.category) {
          return { id: dataObj.prodId, product_name: dataObj.title, product_category: dataObj.category.categoryName, unit_price: dataObj.price, ...dataObj }
        }
        else {
          return { id: dataObj.prodId, product_name: dataObj.title, product_category: "Undefined Category", unit_price: dataObj.price, ...dataObj }
        }
      })
      setData(item)
      let result: any[] = [];
      spliceResult(result, item);
      setData(result[curPage - 1])
      setCurrentdata(result);
      setRawData(item)
      settotalItem(item.length)
    }, (err) => { console.log(err) })
  }, [totalItem,pagesize])

  //when click the page, get the page number and set the data according to the page
  const getPage = (page: number,pageSize: number) => {
    setCurpage(page);
    setPageSize(pageSize);
    setData(currentdata[page - 1])
  }
  //delete the row
  const deleteRow:ModifyRow = (id) => {
    const newData = data.filter((dataObj) => {
      return dataObj.id !== id;
    })
    setData(newData)
  }

  // set the row editable,when click the edit Button save the product information
  const [editRow, setEditRow] = useState<CellStatus>({ status: false, name: false, category: false, price: false, id: 0 })
  const editCurRow:ModifyRow = (id) => {
    setEditRow({ status: true, name: true, category: true, price: true, id })
    const product = data.filter((o) => o.id === id)
    setProduct(product[0])
  }
  //save the value of the cell into product state when editing row, then replace it in the data array
  const [product, setProduct] = useState<Product>({
    id: 0,
    product_name: '',
    product_category: '',
    unit_price: ''
  })

  //save the row value. map the data array find the item via id, save product
  const saveRow:ModifyRow = (id) => {
    setEditRow({ status: false, name: false, category: false, price: false, id: id })
    const newData = data.map((dataObj) => {
      if (dataObj.id === product.id) {
       return { ...dataObj, ...product }
      }
      else{
        return dataObj
      }
    }) 
    console.log(newData); 
    setData(newData)
    //set the product value to initial state after save the row to prevent its value being used by other row
    setProduct({
      id: 0,
      product_name: '',
      product_category: '',
      unit_price: ''
    })
  }

  //set the default name,category, unitprice when double click the cell
  const cellHandler = (cell: CellStatus) => {
    // setEditRow({status:false,name:false,category:false,price:false,id:cell.id})
    //set the current value of this row to product infomation
    const newProduct = data.filter((o) => o.id === cell.id)
    setProduct(newProduct[0]);
    setEditRow({ ...editRow, ...cell })
  }
    //set the product when edit the cell input value
    const handleSetProduct = (e: any, id: number) => {
      //above and below are 2 different way to set the product. Below js will find the target row and set the input value according to the product key,since edit the table can get the original id it does not have to assign the ID to the product     
      product[e.target.dataset.attr as keyof Product] = e.target.value;
      setProduct({ ...product, id})
    }

  return (
    <div>
      <Alert
        banner={true}
        message="Important Information"
        description="For this page, the product data IS received from the server. You can double click each cell to edit, or you could also click the Edit button to edit the whole row"
        type="info"
        showIcon
      />
      <Divider />
      <table className="table">
        <thead>
          <tr className='tr'>
            <th className='th'>Product ID</th>
            <th className='th'>Product Name</th>
            <th className='th'>Product Category</th>
            <th className='th'>Unit Price</th>
            <th className='th'>Action</th>
          </tr>
        </thead>
        <tbody>
        {data.map((data) => {
            return <tr className='tr' key={data.id} onChange={(e) => handleSetProduct(e, data.id)}>
              <td scope="row" className='td'>{data.id}</td>

              <td className='td' onDoubleClick={() => cellHandler({ id: data.id, name: true, category: false, price: false })}>{editRow.name && editRow.id === data.id ? <Input size="middle" type="text" defaultValue={data.product_name} data-attr='product_name' onBlur={editRow.status ? () => null :
                () => saveRow(data.id)} /> : <p>{data.product_name}</p>}</td>

              <td className='td' onDoubleClick={() => cellHandler({ id: data.id, category: true, price: false, name: false })}>{editRow.category && editRow.id === data.id ? <Input size="middle" type="text" defaultValue={data.product_category} data-attr='product_category' onBlur={editRow.status ? () => null :
                () => saveRow(data.id)} /> : <p>{data.product_category}</p>}</td>

              <td className='td' onDoubleClick={() => cellHandler({ id: data.id, price: true, name: false, category: false })}>{editRow.price && editRow.id === data.id ? <Input size="middle" type="text" defaultValue={data.unit_price} data-attr='unit_price' onBlur={editRow.status ? () => null :
                () => saveRow(data.id)} /> : <p>{data.unit_price}</p>}</td>

              <td className='td'>
                {editRow.id === data.id && (editRow.status) ? <Button size="small" onClick={() => saveRow(data.id)}>Save</Button> : <Button size="small" onClick={() => editCurRow(data.id)}>Edit</Button>}&nbsp;
                <Button size="small" onClick={() => deleteRow(data.id)}>DELETE</Button>
              </td>
            </tr>
          })}
          {/* {data.map((data) => {
            return <tr className='tr' key={data.id}>
              <td scope="row" className='td'>{data.id}</td>

              <td className='td' onDoubleClick={() => cellHandler({ id: data.id, name: true, category: false, price: false })}>{editRow.name && editRow.id === data.id ? <Input size="middle" type="text" defaultValue={data.product_name} onChange={(e) => setProduct({ ...product, id: data.id, product_name: e.target.value })} onBlur={editRow.status ? () => null :
                () => saveRow(data.id)} /> : <p>{data.product_name}</p>}</td>

              <td className='td' onDoubleClick={() => cellHandler({ id: data.id, category: true, price: false, name: false })}>{editRow.category && editRow.id === data.id ? <Input size="middle" type="text" defaultValue={data.product_category} onChange={(e) => setProduct({ ...product, id: data.id, product_category: e.target.value })} onBlur={editRow.status ? () => null :
                () => saveRow(data.id)} /> : <p>{data.product_category}</p>}</td>

              <td className='td' onDoubleClick={() => cellHandler({ id: data.id, price: true, name: false, category: false })}>{editRow.price && editRow.id === data.id ? <Input size="middle" type="text" defaultValue={data.unit_price} onChange={(e) => setProduct({ ...product, id: data.id, unit_price: e.target.value })} onBlur={editRow.status ? () => null :
                () => saveRow(data.id)} /> : <p>{data.unit_price}</p>}</td>

              <td className='td'>
                {editRow.id === data.id && (editRow.status) ? <Button size="small" onClick={() => saveRow(data.id)}>Save</Button> : <Button size="small" onClick={() => editCurRow(data.id)}>Edit</Button>}&nbsp;
                <Button size="small" onClick={() => deleteRow(data.id)}>DELETE</Button>
              </td>
            </tr>
          })} */}
        </tbody>
      </table>
      <Pagination
        total={totalItem}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        defaultPageSize={10}
        defaultCurrent={1}
        onChange={(page,pageSize) => getPage(page,pageSize)}
      />
    </div>
  )
}