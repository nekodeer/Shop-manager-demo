import request from './request'

//product related api
export const RequestApi = () => request.get('/api/products')

export const LoginApi = (params) => request.post('/api/login',params)

export const UpdateProduct = (id,params) => request.post(`/api/product/${id}`,params)

export const AddNewProductApi = (params) => request.post('/api/products',params)

export const GetProductListNew = () => request.get('/api/products') 

export const UpdatePassword = (params) => request.put('/api/user-updatepassword',params)

export const DeleteProduct = (id) => request.delete(`/api/product/${id}`,id) 

//timesheet related api
export const GetTimesheet = (user_id) => request.get(`/api/timesheet/${user_id}`)

export const DeleteTimesheet = (id) => request.delete(`/api/timesheet/${id}`)

export const UpdateTimesheet = (id,params) => request.put(`/api/timesheet/${id}`,params)

export const CreateTimeSlot = (params)=> request.post('/api/timesheet',params)