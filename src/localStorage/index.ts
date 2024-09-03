import { ILocalStorage } from "@/models/ILocalStorage";
import { reactive, watch } from "vue";
import dlv from "dlv";

const store = reactive<ILocalStorage>({
  logged: null,
});

export const save = (key: string, update: object) => {
  new Promise((resolve: Function): void => {
    localStorage.setItem(key, JSON.stringify({ [key]: update }));
    set(key, update);
    resolve();
  });
};

export const remove = (key: any) =>
  new Promise((resolve: Function): void => {
    localStorage.removeItem(key);
    unset(key);
    resolve();
  });

export const set = (key: string, update: any) => {
  //@ts-ignore
  store[key] = { ...store[key], ...update };
};

export const unset = (key: string) => {
  //@ts-ignore
  store[key] = null;
};

export const get = (path: string) => dlv(store, path);

export const load = (key: string) =>
  new Promise((resolve) => {
    try {
      const value = JSON.parse(localStorage.getItem(key)!)[key];
      set(key, value);
      resolve(get(key));
    } catch (error) {
      resolve(get(key));
    }
  });

export const authorize = (key: string, callback: Function) => {
    watch(
        // @ts-ignore
        () => store[key],
        (keyValue) => {
            callback(keyValue);
        }

    )
}
