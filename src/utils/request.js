import axios from "axios";

const axiosCreateConfig = {
  timeout: 30000
};

const request = axios.create(axiosCreateConfig);

request.interceptors.request.use(
  config => {
    // 转大写
    const method = config.method.toUpperCase();
    // 获取data参数
    const data = config.data;
    if (method === "UPLOAD") {
      config["body"] = data;
      config["method"] = "POST";
      config["headers"]["Accept"] = "*/*";
      config["headers"]["x-provider"] = "set";
      delete config["headers"]["Content-Type"];
      config["headers"]["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  async error => {
    error.error = callback => {
      typeof callback === "function" && callback();
    };
    return Promise.reject(error);
  }
);

export default request;
