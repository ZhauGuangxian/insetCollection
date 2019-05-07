

const state = {
    //暂时先通过token判断是否登录
    loginState:localStorage.getItem('token')?1:0,
    //userInfo
    userData:JSON.parse(sessionStorage.getItem('userData'))
}

export default state;