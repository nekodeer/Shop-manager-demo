import React, { Fragment, useState} from 'react'

interface EditCellProps{
  value:{id:number,data:string},
  setState: (arg:string,id:number)=>void
}

export default function EditableCell(props:EditCellProps) {

  const {setState} = props

  const [isEdit,setEdit] = useState<boolean>(false)
  const [value,setValue] = useState(props.value.data)
  
  return (
    <Fragment>
      {isEdit?
      <input type='text' defaultValue={value} onBlur={(e) => {
        setEdit(false);
        setValue(e.target.value);
        setState(e.target.value,props.value.id) 
      }} autoFocus/>:
      <p onDoubleClick={() => setEdit(true)}>{value}</p>}
    </Fragment>
  )
}
