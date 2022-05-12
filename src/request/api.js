import request from './request'


export const RequestApi = () => request.get('/api/products')

export const LoginApi = (params) => request.post('/auth',params)

export const UpdateProduct = (params) => request.put('/api/productlist/update',params)

export const AddNewProductApi = (params) => request.post('/addproduct',params)

export const GetProductListNew = () => request.get('/api/products')