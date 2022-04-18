import React, { useState } from 'react';
import { Input, Select, Space } from 'antd';

//限定props类型
type FnProps = {
  searchProp(value:string, option:string): void;
};

export default function SearchBar(props:FnProps) {

  const [value, setValue] = useState<string>('')
  const [option, setOption] = useState<string>('Category');

  const { Option } = Select;

  const selectBefore = (
    <Select style={{ width: 150 }} defaultValue="Category" className="select-before" onSelect={(option: string) => setOption(option)
    }>
      <Option value="Category">Category</Option>
      <Option value="Product Name">Product Name</Option>
    </Select>
  )
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const search = () => {
    props.searchProp(value, option);
  }

  return (
    <Space direction="vertical">
      <Input addonBefore={selectBefore} placeholder={option==='Category'?'Search by Category':'Search Product Name'} onChange={(e) => inputHandler(e)} onPressEnter={search} />
    </Space>
  )
}
