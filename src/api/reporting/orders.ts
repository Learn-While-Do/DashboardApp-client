import api from "@/api/api";
import { IOrder } from "@/models/IOrder";

import { AxiosResponse, AxiosError } from "axios";

const URLS = {
  orders: "orders/",
};

export const loadOrders = (
  shipped_country: string,
  shipped_city: string,
  search: string,
  page: string,
  page_size: string,
  order_by: string
) => {
  return new Promise((resolve, reject) => {
    api
      .get(URLS.orders, {
        params: {
          shipped_country,
          shipped_city,
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
        console.log("caught error in load orders ==> ", error);
      });
  });
};

export const addNewOrder = (newOrderRecord: Partial<IOrder>) => {
  return new Promise((resolve, reject) => {
    api
      .post(URLS.orders, {
        customer: newOrderRecord.customerId,
        product: newOrderRecord.productId,
        order_date: new Date(),
        required_date: newOrderRecord.requiredDate,
        shipped_name: newOrderRecord.shippedName,
        shipped_address: newOrderRecord.shippedAddress,
        shipped_city: newOrderRecord.shippedCity,
        shipped_postal_code: newOrderRecord.shippedPostalCode,
        shipped_country: newOrderRecord.shippedCountry,
      })
      .then((response: AxiosResponse) => {
        if (response.status === 201) {
          return resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("caught error in add new order record ==> ", error);
      });
  });
};

export const editRecordInOrders = (id: string, editedOrder: IOrder) => {

  return new Promise((resolve, reject) => {
    api
    .patch(URLS.orders + id + '/', {
      shipped_name: editedOrder.shippedName,
      shipped_address: editedOrder.shippedAddress,
      shipped_city: editedOrder.shippedCity,
      shipped_country: editedOrder.shippedCountry,
      shipped_postal_code: editedOrder.shippedPostalCode
    })
    .then((response: AxiosResponse) => {
      if(response.status === 200) {
        resolve(response.data);
      } else {
        reject();
      }
    })
    .catch((error: AxiosError) => {
      console.log('caught error in edit record in orders ==> ', error);
      
    })
  })
}

export const deleteRecordsInOrders = (id: string) => {
  return new Promise((resolve, reject) => {
    api
    .delete (URLS.orders + id + '/')
    .then((response: AxiosResponse) => {
      if(response.status === 204) {
        resolve(response.data)
      } else {
        reject()
      }
    })
    .catch((error: AxiosError) => {
      console.log('caught error in delete record in orders ==> ', error);
      reject(error);
    })
  })
}

export const getOrderDetails = (orderId: string) => {

  return new Promise((resolve, reject) => {
    api
      .get(URLS.orders + orderId + "/", {})
      .then((response: AxiosResponse) => {

        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("caught error in order details >> ", error);
      });
  });
};




