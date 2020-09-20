import axios from "axios";

let config = {
  baseUrl: "/api",
  transformRequest: [
    function(data) {
      let ret = "";
      for (let it in data) {
        ret +=
          encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
      }
      ret = ret.substring(0, ret.length - 1);
      return ret;
    }
  ],
  transformResopnse: [
    function(data) {
      return data;
    }
  ],
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  },
  timeout: 10000,
  responseType: "json"
};

axios.interceptors.request.use(
  function(config) {
    let token = localStorage.getItem("token");
    if (typeof token == "string" && token != "") {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  function(error) {
    console.log(error);
  }
);

axios.interceptors.response.use(function(res) {
  //相应拦截器
  return res.data;
});

export function fetchGet(url) {
  return axios.get(url, config);
}

export function fetchPost(url, data) {
  return axios.post(url, data, config);
}
