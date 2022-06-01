import { useEffect, useState } from 'react'
import EditableCell from '../EditableCell';
import { Pagination, Divider, Alert } from 'antd';

export default function ProductList3() {
  const inventory =
    [
      {
        "id": 1,
        "product_name": "Weetabix",
        "product_category": "Cereal",
        "unit_price": "501",
      },
      {
        "id": 2,
        "product_name": "Colgate Toothpaste",
        "product_category": "Toiletries",
        "unit_price": "119",
      },
      {
        "id": 3,
        "product_name": "Imperial Leather Soap",
        "product_category": "Toiletries",
        "unit_price": "235",
      },
      {
        "id": 4,
        "product_name": "Sunlight Detergent",
        "product_category": "Toiletries",
        "unit_price": "401",
      },
      {
        "id": 5,
        "product_name": "Frost hunger",
        "product_category": "Sword",
        "unit_price": "321",
      },
      {
        "id": 6,
        "product_name": "Zhen yao",
        "product_category": "Sword",
        "unit_price": "243",
      }
      ,
      {
        "id": 7,
        "product_name": "Moonlight De",
        "product_category": "Toiletries",
        "unit_price": "135",
      },
      {
        "id": 8,
        "product_name": "Nobrand",
        "product_category": "Cereal",
        "unit_price": "666",
      },
      {
        "id": 9,
        "product_name": "ssd",
        "product_category": "Cereal",
        "unit_price": "676",
      },
      {
        "id": 10,
        "product_name": "appe",
        "product_category": "Sword",
        "unit_price": "897",
      }
    ];


  const [rawdata, setrawData] = useState(inventory)
  const [data, setData] = useState(rawdata)
  const [curPage, setCurpage] = useState(1);
  const pagesize = 4;
  //process data array according to the pagination
  useEffect(() => {
    //divide the original data array into small arrays, each small array contains the element of the current page
    //everytime current page changes, render the array according to the current page value
    let result = [];
    for (var i = 0, len = rawdata.length; i < len; i += pagesize) {
      result.push(rawdata.slice(i, i + pagesize));
    }
    setData(result[curPage - 1]);;
  }, [curPage])

  const getPage = (e: number) => {
    setCurpage(e);
  }

  //set the product name of a certain cell
  const setNameState = (productName: string, id: number) => {
    const newData = [...data];
    // newData[id - 1].product_name = productName;
    newData.forEach((o) => {
      if (o.id === id) {
        o.product_name = productName
      }
    })
    setData(newData);
    console.log(newData);
  }
  //set the product category of a certain cell
  const setCatState = (category: string, id: number) => {
    const newData = [...data];
    // newData[id - 1].product_category = category;
    newData.forEach((o) => {
      if (o.id === id) {
        o.product_category = category
      }
    })
    setData(newData);
    console.log(data);
  }
  //set the product price of a certain cell
  const setPriceState = (unitPrice: string, id: number) => {
    const newData = [...data];
    // newData[id - 1].unit_price = unitPrice.toString();
    newData.forEach((o) => {
      if (o.id === id) {
        o.unit_price = unitPrice
      }
    })
    setData(newData);
    console.log(data);
  }

  //delete the row
  const deleteRow = (id: number) => {
    const newData = data.filter((dataObj) => {
      return dataObj.id !== id;
    })
    setData(newData)
  }

  return (
    <div>
      <Alert
        banner={true}
        message="Important Information"
        description="Only for this page, the product data is NOT received from the server. The product data was stored in the component state. You can double click each cell to edit. If you edit the product information, it does not actually send a request to server"
        type="info"
        showIcon
      />
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
          {data.map((data) => {
            return <tr className='tr' key={data.id}>
              <td scope="row" className='td'>{data.id}</td>
              <td className='td'>
                <EditableCell value={{ data: data.product_name, id: data.id }} setState={setNameState} />
              </td>
              <td className='td'><EditableCell value={{ data: data.product_category, id: data.id }} setState={setCatState} /></td>
              <td className='td'><EditableCell value={{ data: data.unit_price, id: data.id }} setState={setPriceState} /></td>
              <td className='td'>
                <button className='primary' onClick={() => deleteRow(data.id)}>DELETE</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
      <Pagination
        total={inventory.length}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        defaultPageSize={pagesize}
        defaultCurrent={1}
        onChange={(e) => getPage(e)}
      />
    </div>
  )
}
