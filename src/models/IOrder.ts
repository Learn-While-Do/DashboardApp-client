import { ICustomer } from "./ICustomer";
import { IProduct } from "./IProduct";

export interface IOrder {
    id: string;
    orderDate: Date;
    customer: ICustomer;
    product: IProduct;
    requiredDate: string;
    shippedName: string;
    shippedAddress: string;
    shippedCity: string;
    shippedPostalCode: string;
    shippedCountry: string;

    customerId: string;
    productId: string;
}