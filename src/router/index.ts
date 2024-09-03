import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import OrdersView from "@/views/reporting/screens/OrdersView.vue";
import OrderDetails from "@/views/reporting/details/OrderDetails.vue";

import ProductsView from "@/views/reporting/screens/ProductsView.vue";
import ProductDetails from "@/views/reporting/details/ProductDetails.vue";

import SuppliersView from "@/views/reporting/screens/SuppliersView.vue";
import DashboardView from "@/views/DashboardView.vue";
import CustomersView from "@/views/relations/screens/CustomersView.vue";
import AdminView from "@/views/administration/AdminView.vue";
import UserSettings from "@/views/administration/UserSettings.vue";

import { get as getFromStore} from '@/localStorage';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,

    children: [
      {
        path: "/orders",
        name: "orders",
        component: OrdersView,
        meta: { screen: "orders" },
      },
      {
        path: "/orders/:id",
        name: "order-details",
        component: OrderDetails,
        meta: { screen: "order-details" },
      },
      {
        path: "/products",
        name: "products",
        component: ProductsView,
        meta: { screen: "products" },
      },
      {
        path: "/products/:id",
        name: "product-details",
        component: ProductDetails,
        meta: { screen: "product-details" },
      },
      {
        path: "/suppliers",
        name: "suppliers",
        component: SuppliersView,
        meta: { screen: "suppliers" },
      },
      {
        path: "/customers",
        name: "customers",
        component: CustomersView,
        meta: { screen: "customers" },
      },
      {
        path: "/administration",
        name: "administration",
        component: AdminView,
        meta: { screen: "administration" },
        beforeEnter: (to: any, from: any, next: any) => {
          const isAdmin = getFromStore('logged.isAdmin');
          if (isAdmin) {
            next()
          }
        }
      },
      {
        path: "/user-settings",
        name: "user-settings",
        component: UserSettings,
        meta: { screen: "user-settings" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
