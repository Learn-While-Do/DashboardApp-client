import { IOrder } from "@/models/IOrder";
import { IProduct } from "@/models/IProduct";
import { IUser } from "@/models/IUser";

export interface GlobalState{
    orders: any[];
    orderDetails: IOrder;
    products: any[];
    productDetails: IProduct;
    pages: number;
    pageNumber: number;
    count: number;
    numberOfPages: number;
    users: IUser [];
    user: IUser;
}