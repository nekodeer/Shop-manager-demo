import  { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import route from './Router'
import { message } from 'antd';

export default function App() {

  const element = useRoutes(route);
  
  return (
    <div>{element}</div>
  )
}

