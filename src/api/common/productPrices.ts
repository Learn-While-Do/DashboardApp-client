import api from "@/api/api";

import { AxiosResponse, AxiosError } from "axios";

const URLS = {
  productPrices: "product-price-filters/",
};

export const loadProductPrices = () => {
  return new Promise((resolve, reject) => {
    api
      .get(URLS.productPrices, {})
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("caught error in load productPrices >> ", error);
      });
  });
};