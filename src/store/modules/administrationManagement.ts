import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  unblockUser,
  updateUserStatus,
} from "@/api/admin/admin";

import { IUser } from "@/models/IUser";

import { Commit } from "vuex";

import { GlobalState } from "../types";
import { updateOwnProfile } from "@/api/admin/users";

export default {
  namespaced: true,
  state: {
    users: [],
  },

  mutations: {
    SET_USERS(state: GlobalState, context: IUser[]) {
      state.users = context;
    },

    SET_USER(state: GlobalState, context: IUser) {
      state.user = context;
    },

    ADD_USER(state: GlobalState, user: IUser) {
      user.is_blocked = false;
      user.is_active = true;
      user.passwd = "";
      state.users.push(user);
    },

    DELETE_USER(state: GlobalState, id: string) {
      state.users = state.users.filter((user) => {
        return user.id != Number(id);
      });
    },
    UNBLOCK_USER(state: GlobalState, selectedUsername: string) {
      state.users[
        state.users.findIndex((user) => user.username === selectedUsername)
      ].is_blocked = false;
    },
    UPDATE_USER_STATUS(state: GlobalState, payload: any) {
      let index = state.users.findIndex(
        (user) => user.username === payload.username
      );
      state.users[index].is_active = Boolean(payload.is_active);
    },

    UPDATE_OWN_PROFILE(state: GlobalState, payload: any) {
      state.user.username = payload.username;
      state.user.email = payload.email;
      state.user.last_name = payload.last_name;
      state.user.first_name = payload.first_name;
    },

  },

  actions: {
    setUsers({ commit }: { commit: Commit }) {
      getUsers()
        .then((data) => {
          commit("SET_USERS", data);
        })
        .catch(() => {
          return false;
        });
    },

    setUser({ commit }: { commit: Commit }, userId: string) {
      getUser(userId)
        .then((data) => {
          commit("SET_USER", data);
        })
        .catch(() => {
          return false;
        });
    },

    addUser({ commit }: any, user: Partial<IUser>) {
      return addUser(user)
        .then(() => {
          commit("ADD_USER", user);
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    deleteUser({ commit }: any, payload: Partial<IUser>) {
      return deleteUser(String(payload.id))
        .then(() => {
          commit("DELETE_USER", payload.id);
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    async unblockUser({ commit }: { commit: Commit }, payload: string) {
      return unblockUser(payload)
        .then(() => {
          commit("UNBLOCK_USER", payload);
          return true;
        })
        .catch((e: any) => {
          console.log("unblockUser is returning false ==>", e);
          return false;
        });
    },
    updateUserStatus({ commit }: { commit: Commit }, payload: Partial<IUser>) {
      return updateUserStatus(payload)
        .then(() => {
          commit("UPDATE_USER_STATUS", payload);
          return true;
        })
        .catch((e: any) => {
          console.log("updateUserStatus error ==>", e);
          return false;
        });
    },

    updateOwnProfile({ commit }: { commit: Commit }, payload: any) {
      return updateOwnProfile(payload)
        .then(() => {
          commit("UPDATE_OWN_PROFILE", payload);
          return true;
        })
        .catch((e: any) => {
          console.log("updateOwnProfile error ==>", e);
          return false;
        });
    },
  },

  getters: {
    getUsers(state: GlobalState) {
      return state.users;
    },
    getUser(state: GlobalState) {
      return state.user;
    },
  },
};
