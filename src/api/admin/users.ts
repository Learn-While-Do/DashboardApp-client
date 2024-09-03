import { ILoginCredentials } from "@/models/ILoginCredentials";
import axios from "axios";

export const authenticate = (creds: ILoginCredentials) => {
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const baseUrl = process.env.VUE_APP_BASE_URL;

  return axios
    .post(
      baseUrl + "/api/token/",
      {
        username: creds.username,
        password: creds.password,
      },
      {}
    )
    .then((response) => {
      return response.status === 200
        ? Promise.resolve(response)
        : Promise.reject();
    })
    .catch((error) => {
      if (error.message === "Netword Error") return error.message;
      return error.response;
    });
};
