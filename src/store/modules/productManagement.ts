import { Commit } from "vuex";
import { loadProducts } from "@/api/reporting/products";
import { GlobalState } from "@/store/types";
import { IProduct } from "@/models/IProduct";

export default {
  namespaced: true,

  mutations: {
    SET_PRODUCTS(state: GlobalState, context: any) {
      state.products = context;
    },
    SET_PRODUCT_DETAILS(state: GlobalState, context: IProduct) {
      state.productDetails = context;
    },
    DELETE_PRODUCT(state: GlobalState, context: string) {      
      state.products = state.products.filter(x => x.id !== context);
    },
    UPDATE_PRODUCT(state: GlobalState, context: any) {      
      
      let index = state.products.findIndex(x => x.id === context.id)
      
      state.products[index] = {...state.products[index],
        unit_price: context.editedproduct.unitPrice,
        units_in_stock: context.editedproduct.unitsInStock,
        units_on_order: context.editedproduct.unitsOnOrder,
        supplier: context.editedproduct.supplier,
      }
    },
    POST_PRODUCT(state: GlobalState, context: any) {
      state.products.unshift(context.responseObject);
    }
  },
  actions: {
    async setProducts({ commit }: { commit: Commit }) {
      let data: any = await loadProducts();
      commit("SET_PRODUCTS", data);
      return data;
    },
    async setProductDetails({ commit }: { commit: Commit }, payload: IProduct) {
      commit("SET_PRODUCT_DETAILS", payload);
    },
    async deleteProduct({ commit }: { commit: Commit }, payload: string) {
      commit("DELETE_PRODUCT", payload);
    },
    async updateProduct({ commit }: { commit: Commit }, payload: any) {
      commit("UPDATE_PRODUCT", payload);
    },
    async postProduct({commit}: {commit: Commit}, payload: any) {
      commit("POST_PRODUCT", payload)
    }
  },

  getters: {
    getProducts(state: GlobalState) {
      return state.products;
    },
    getProductDetails(state: GlobalState) {
      return state.productDetails;
    },
  },
};
