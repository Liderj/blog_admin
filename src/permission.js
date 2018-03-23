import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { Message } from "element-ui";
import { getToken } from "@/utils/auth"; // 验权

const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (!store.getters.user) {
        store
          .dispatch("GetInfo")
          .then(res => {
            next();
          })
          .catch(() => {
            store.dispatch("FedLogOut").then(() => {
              Message.error("获取用户失败,请重新登录");
              NProgress.done();
              next({ path: "/login" });
            });
          });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
