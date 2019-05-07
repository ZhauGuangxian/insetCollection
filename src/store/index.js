import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import login from './login';
import inset from './insets';
const store = new Vuex.Store({
    modules:{
        login,
        inset
    }
})
export default store;