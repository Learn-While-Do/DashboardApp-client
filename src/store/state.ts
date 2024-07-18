import { IOrder } from "@/models/IOrder";
import { GlobalState } from "./types";
import { IProduct } from "@/models/IProduct";

const state = (): GlobalState => {
    return {
        orders: [],
        orderDetails: {} as IOrder,
        products: [],
        productDetails: {} as IProduct
    }
}

export default state;