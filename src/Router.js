import { Navigate } from "react-router-dom";
import Detail from "./components/Detail"
import EditableTable from "./components/ProductList/ProductList"
import ProductList2 from "./components/ProductList/ProductListCombine"
import ProductListEditRow from "./components/ProductList/ProductListEdieRow"
import ProductListEditableCell from "./components/ProductList/ProductListEditableCell"
import Timesheet from "./components/User/Timesheet/Timesheet";
import UserProfile from "./components/User/UserProfile"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Page404 from "./pages/Page404"
import Register from "./pages/Register"

const route = [
  {
    path: '/',
    element: <Navigate to="/home" />
  },
  {
    path: '/login',
    element: <Login />
  },{
    path: '/register',
    element: <Register />
  },
  {
    path: '/home',
    element: <Home />,
    children: [{
      path: 'productlist',
      element: <EditableTable />
    }, {
      path: 'productlist2',
      element: <ProductList2 />
    }, {
      path: 'productlist3',
      element: <ProductListEditableCell />
    }, {
      path: 'productlistEditRow',
      element: <ProductListEditRow />
    },{
      path:'userProfile',
      element: <UserProfile/>
    },{
      path:'edit/:id',
      element:<Detail/>
    },{
      path:'timesheet',
      element:<Timesheet/>
    }]
  },{
    path:'*',
    element: <Page404/>
  }]

export default route