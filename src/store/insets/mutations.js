const mutations={
    GET_HOME_NEWEST_INSET(state,data){
        state.newestInsetsHome = [...data];
    },
    GET_HOME_SUBSCRIBE_INSET(state,data){
        state.subscribeInsetsHome = [...data]
    },
    GET_HOME_RECOMMOND_INSET(state,data){
        state.recommondInsetsHome = [...data]
    }
}
export default mutations;