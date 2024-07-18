import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import OrdersView from "@/views/reporting/screens/OrdersView.vue";
import OrderDetails from "@/views/reporting/details/OrderDetails.vue";

import ProductsView from "@/views/reporting/screens/ProductsView.vue";
import ProductDetails from '@/views/reporting/details/ProductDetails.vue';

import SuppliersView from "@/views/reporting/screens/SuppliersView.vue";
import DashboardView from "@/views/DashboardView.vue";
import CustomersView from "@/views/relations/screens/CustomersView.vue";

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
        path: '/orders/:id',
        name: 'order-details',
        component: OrderDetails,
        meta: {screen: 'order-details'}
      },
      {
        path: "/products",
        name: "products",
        component: ProductsView,
        meta: { screen: "products" },
      },
      {
        path: '/products/:id',
        name: 'product-details',
        component: ProductDetails,
        meta: { screen: 'product-details' },
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
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
