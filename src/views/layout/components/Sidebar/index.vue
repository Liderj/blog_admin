<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      const permission = ["/login", "/404", "/", "tree"];
      let newroutes = JSON.parse(JSON.stringify(this.$router.options.routes));
      console.log(newroutes);
      newroutes.forEach(item => {
        if (permission.indexOf(item.path) === -1) {
          item.hidden = true;
        }
        if (item.children) {
          item.children.forEach(e => {
            if (permission.indexOf(e.path) === -1) {
              e.hidden = true;
            } else {
              item.hidden = false;
            }
          });
        }
      });
      return newroutes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {
    console.log(this.$router);
  }
};
</script>
