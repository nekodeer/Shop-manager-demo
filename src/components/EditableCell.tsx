import React, { Fragment, useState} from 'react'

export default function EditableCell(props:any) {

  const {setState} = props

  const [isEdit,setEdit] = useState(false)
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
