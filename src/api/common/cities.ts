import api from "@/api/api";

import { AxiosResponse, AxiosError } from "axios";

const URLS = {
  cities: "city-filters/",
};

export const loadCities = () => {
  return new Promise((resolve, reject) => {
    api
      .get(URLS.cities, {})
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("caught error in load cities >> ", error);
      });
  });
};