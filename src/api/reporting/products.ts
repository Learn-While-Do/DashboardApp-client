import api from "@/api/api";

import { AxiosResponse, AxiosError } from "axios";

import { IProduct } from "@/models/IProduct";


const URLS = {
  products: "products/",
};

export const loadProducts = (
  supplier__company_name: string,
  unit_price: string,
  search: string,
  page: string,
  page_size: string,
  order_by: string
) => {
  
  return new Promise((resolve, reject) => {        
    api
      .get(URLS.products, {
        params: {
          unit_price,
          supplier__company_name,
          search,
          page,
          page_size,
          order_by
        }
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("caught error in load products >> ", error);
      });
  });
};


export const addNewProduct = (newProductRecord: Partial<IProduct>) => {
  return new Promise((resolve, reject) => {
    api
      .post(
        URLS.products,
        {
          category: newProductRecord.categoryId,
          supplier: newProductRecord.supplierId,
          product_name: newProductRecord.productName,
          unit_price: newProductRecord.unitPrice,
          units_in_stock: newProductRecord.unitsInStock,
          units_on_order: newProductRecord.unitsOnOrder,
        }
      )
      .then((response: AxiosResponse) => {
        if (response.status === 201) {
          return resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        console.log("caught error in caught error in add new product >> >> ", error);
        return reject(error);
      });
  });
};

export const editRecordInProducts = (id: string, editedProduct: IProduct) => {
    
  return new Promise((resolve, reject) => {
    api
      .patch(URLS.products + id + "/", {
        unit_price: editedProduct.unitPrice,
        units_in_stock: editedProduct.unitsInStock,
        units_on_order: editedProduct.unitsOnOrder,
        supplier: editedProduct.supplier!.id,
      }) 
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        console.log("caught error in edit record in products >> ", error);
      });
  });
};

export const deleteRecordsInProducts = (id: string) => {
  return new Promise((resolve, reject) => {
    api
    .delete (URLS.products + id + '/')
    .then((response: AxiosResponse) => {
      if(response.status === 204) {
        resolve(response.data)
      } else {
        reject()
      }
    })
    .catch((error: AxiosError) => {
      console.log('caught error in delete record in products ==> ', error);
      reject(error);
    })
  })
}


export const getProductDetails = (productId: string) => {

  return new Promise((resolve, reject) => {
    api
      .get(URLS.products + productId + "/", {})
      .then((response: AxiosResponse) => {

        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("caught error in product details >> ", error);
      });
  });
};