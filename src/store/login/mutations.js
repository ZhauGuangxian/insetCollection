import * as types from './mutations_types';

const mutations = {
    [types.LOGIN_IN](state){
        state.loginState = 1;
    },
    [types.LOGIN_OUT](state){
        state.loginState = 0;
        localStorage.removeItem('token');
        sessionStorage.removeItem('userData');
    },
    [types.GET_USER_SUCCESS](state,data){
        state.userData = {...data};
        sessionStorage.setItem('userData',JSON.stringify({...data}));
    }
}
export default mutations;