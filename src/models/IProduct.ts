import { ICategory } from "./ICategory";
import { ISupplier } from "./ISupplier";

export interface IProduct {
    id: string;
    productName: string;
    supplier: ISupplier | null;
    category: ICategory;
    unitPrice: number;
    unitsInStock: number;
    unitsOnOrder: number;

    supplierId: string;
    categoryId: string;
}