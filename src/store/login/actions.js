import * as types from './mutations_types';
const actions = {
    login_in:({commit})=>{
        commit(types.LOGIN_IN)
    },
    login_out:({commit})=>{
        commit(types.LOGIN_OUT)
    },
    get_user_success:({commit},data)=>{
        commit(types.GET_USER_SUCCESS,data)
    }
}
export default actions;