import axios, {Axios, AxiosError, AxiosResponse} from "axios";
import { authorize } from "@/localStorage";
import { ILoginData } from "@/models/ILoginData";

import { remove as removeFromStore } from "@/localStorage";
import router from "@/router";

axios.defaults.headers.common['Content-Type'] = 'application/json';

const axiosInstance = axios.create()

const baseURL = process.env.VUE_APP_BASE_URL;

const api = (axios: Axios) => {
    
    const controller = new AbortController();

    authorize('logged', (loginData: ILoginData) => {
        if(loginData) {
            axios.defaults.headers.common['Authorization'] = "Bearer " + loginData.access_token;
            axios.defaults.baseURL =  baseURL + '/api';
        }
    })

    axios.interceptors.response.use(
        (response: AxiosResponse) => {
            return response
        },
        (error: AxiosError) => {
            if(error.message === "Network Error" && !error.response) {
                console.log("Newwork error ==> ", error);
            }
            if(error.response!.status === 401) {
                console.log('401 error ==> ', error);
                removeFromStore('logged');
                alert('Your session is going to be closed now, please login again!')

                router.push({
                    name: 'dashboard'
                })
            }
        }
    )

    const cancelRequests = () => {
        console.log("Cancelling API requests");
        controller.abort();
    }


    return {
        get: <T>(url: string, config: any) => axios.get<T>(url, {signal: controller.signal, ...config}),
        post: <T>(url: string, body: object) => axios.post<T>(url, body),
        put: <T>(url: string, body: object) => axios.put<T>(url, body),
        patch: <T>(url: string, body: object) => axios.patch<T>(url, body),
        delete: <T>(url: string) => axios.delete<T>(url),
        cancel: () => cancelRequests()
    };
};

export default api(axiosInstance);