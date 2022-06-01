export interface IDetailItem {
  id:number|string,
  key: number|string,
  category_id: string | number,
  price: number|string,
  description: string,
  title: string,
  created_at?: string,
  updated_at?: string,
  is_active: number|string,
  product_image: string
}

export interface ITimeSlot {
  start: string,
  end: string,
  task_id: number,
  comments: string
}

export type NewProduct = {
  title:string;
  category_id:string|number;
  price:string|number;
  is_active?: number;
  description:string
}

export interface Item {
  key: number,
  category_id: number,
  price: number,
  description: string,
  title: string,
  created_at?: string,
  updated_at?: string,
  is_active?: number,
  product_image?: string
}

//for productlist combine, editrow, components
export interface Product {
  id: number | string;
  product_name: string;
  product_category: string;
  unit_price: string;
}

