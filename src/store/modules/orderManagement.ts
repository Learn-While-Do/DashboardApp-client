import { loadOrders } from "@/api/reporting";
import { GlobalState } from "../types";
import { Commit } from "vuex";
import { getOrderDetails } from "@/api/reporting/orders";
import { IOrder } from "@/models/IOrder";

export default {
  namespaced: true,

  mutations: {
    SET_ORDERS(state: GlobalState, context: any) {
      state.orders = context;
    },
    SET_ORDER_DETAILS(state: GlobalState, context: IOrder) {
      state.orderDetails = context
    },
    DELETE_ORDER(state: GlobalState, context: string) {
      state.orders = state.orders.filter(x => x.id !== context)
    },
    UPDATE_ORDER(state: GlobalState, context: any) {
      let index = state.orders.findIndex(x => x.id === context.id)

      state.orders[index] = {...state.orders[index],
        shipped_address: context.editedOrder.shippedAddress,
        shipped_city: context.editedOrder.shippedCity,
        shipped_country: context.editedOrder.shippedCountry,
        shipped_name: context.editedOrder.shippedName,
        shipped_postal_code: context.editedOrder.shippedPostalCode,
      }
    },
    POST_ORDER(state: GlobalState, context: any) {
      state.orders.unshift(context.responseObject);
    }
  },
  actions: {
    async setOrders({ commit }: { commit: Commit }) {
      let data = await loadOrders();
      commit("SET_ORDERS", data);
      return data;
    },
    async setOrderDetails ({commit}: {commit: Commit}, payload: IOrder) {
      commit('SET_ORDER_DETAILS', payload)
    },
    async deleteOrder({commit}: {commit: Commit}, payload: string) {
      commit("DELETE_ORDER", payload)
    },
    async updateOrder({commit}: {commit: Commit}, payload: any) {
      commit("UPDATE_ORDER", payload)
    },
    async postOrder({commit}: {commit: Commit}, payload: any) {
      commit("POST_ORDER", payload)
    }
  },
  getters: {
    getOrders(state: GlobalState) {
      return state.orders;
    },
    getOrderDetails(state: GlobalState) {
      return state.orderDetails;
    }
  },
};
