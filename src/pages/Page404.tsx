import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Page404() {

  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => navigate('/Home'),2000)
  })
  return (
    <div>
      <h1>This page does not exist</h1>
    </div>
  )
}
