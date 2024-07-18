import { createStore } from 'vuex'
import state from './state'
import { GlobalState } from './types'
import orderManagement from './modules/orderManagement';
import productManagement from './modules/productManagement';

const store = createStore<GlobalState>({
  state,
  modules: {
    orderManagement: orderManagement,
    productManagement: productManagement
  }
})

export default store;
