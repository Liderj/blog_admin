import Vue from "vue";
import Router from "vue-router";

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  { path: "/404", component: () => import("@/views/404"), hidden: true },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    name: "主页",
    hidden: true,
    children: [
      { path: "dashboard", component: () => import("@/views/dashboard/index") }
    ]
  },
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/p_list",
    name: "权限管理",
    meta: { title: "权限管理", icon: "example" },
    children: [
      {
        path: "p_list",
        name: "权限列表",
        component: () => import("@/views/permission/index"),
        meta: { title: "权限列表", icon: "tree" }
      },
      {
        path: "p_roles",
        name: "角色列表",
        component: () => import("@/views/permission/roles"),
        meta: { title: "角色列表", icon: "tree" }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/user/users",
    name: "用户管理",
    meta: { title: "用户管理", icon: "example" },
    children: [
      {
        path: "users",
        name: "用户列表",
        component: () => import("@/views/user/index"),
        meta: { title: "用户列表", icon: "tree" }
      },
      {
        path: "admin",
        name: "管理员列表",
        component: () => import("@/views/user/admin"),
        meta: { title: "管理员列表", icon: "tree" }
      }
    ]
  },
  {
    path: "/post",
    component: Layout,
    redirect: "/post/posts",
    name: "博客管理",
    meta: { title: "博客管理", icon: "example" },
    children: [
      {
        path: "categories",
        name: "文章分类",
        component: () => import("@/views/post/category"),
        meta: { title: "文章分类", icon: "tree" }
      },
      {
        path: "posts",
        name: "博客列表",
        component: () => import("@/views/post/index"),
        meta: { title: "博客列表", icon: "tree" }
      },
      {
        path: "top_10",
        name: "热推博文",
        component: () => import("@/views/post/top_10"),
        meta: { title: "热推博文", icon: "tree" }
      }
    ]
  },
  {
    path: "/comment",
    component: Layout,
    redirect: "/comment/c_index",
    name: "评论管理",
    meta: { title: "评论/回复管理", icon: "example" },
    children: [
      {
        path: "c_index",
        name: "评论列表",
        component: () => import("@/views/comment/index"),
        meta: { title: "评论列表", icon: "tree" }
      },
      {
        path: "keywords",
        name: "敏感字",
        component: () => import("@/views/comment/keywords"),
        meta: { title: "敏感字", icon: "tree" }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  mode: "history", //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
