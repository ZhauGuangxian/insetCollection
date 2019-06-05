const actions = {
    get_home_newest_inset:({commit},data)=>{
        commit('GET_HOME_NEWEST_INSET',data)
    },
    //GET_HOME_SUBSCRIBE_INSET
    //GET_HOME_RECOMMOND_INSET
    get_home_subscribe_inset:({commit},data)=>{
        commit('GET_HOME_SUBSCRIBE_INSET',data)
    },
    get_home_recommond_inset:({commit},data)=>{
        commit('GET_HOME_RECOMMOND_INSET',data)
    }
}

export default actions