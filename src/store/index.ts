import { createStore } from 'vuex'
import state from './state'
import { GlobalState } from './types'
import orderManagement from './modules/orderManagement';
import productManagement from './modules/productManagement';
import paginationManagement from './modules/paginationManagement';
import administrationManagement from './modules/administrationManagement';

const store = createStore<GlobalState>({
  state,
  modules: {
    orderManagement,
    productManagement,
    paginationManagement,
    administrationManagement
  }
})

export default store;
