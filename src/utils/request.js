import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "../store";
import { getToken } from "@/utils/auth";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["Authorization"] = "bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // Token 过期了;
    if (res.code == 405) {
      MessageBox.alert("登录已超时，重新登录", {
        confirmButtonText: "确定",
        callback: () => {
          store.dispatch("FedLogOut").then(() => {
            location.reload();
          });
        }
      });
      return Promise.reject("error");
    }
    if (res.code == 400) {
      Message({
        message: res.message,
        type: "error",
        duration: 5 * 1000
      });
    }
    if (res.code == 403) {
      Message({
        message: res.message,
        type: "error",
        duration: 3 * 1000
      });
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
