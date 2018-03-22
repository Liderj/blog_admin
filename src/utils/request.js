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
      config.headers["X-Token"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
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
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    if (res.code !== 200) {
      Message({
        message: res.error,
        type: "error",
        duration: 5 * 1000
      });

      // 520:Token 过期了;
      if (res.code === 520) {
        MessageBox.confirm("登录已超时，重新登录", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          store.dispatch("FedLogOut").then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        });
      }
      return Promise.reject("error");
    } else {
      return response.data;
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
