<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in paths"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import role from "../../../../mock/role";

export default {
  created() {
    this.initpaths();
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  data() {
    //网上找的 加的
    return {
      roles: "",
      paths: null
    };
  },
  methods: {
    initpaths() {
      this.roles = JSON.stringify(sessionStorage.getItem("roles"));
      let userRoles = this.roles;
      const pathsTemp = this.permission_routes;
      this.paths = [];
      pathsTemp.map((value, index) => {
        let addThisCatalog = false; //表示是否添加这一个下拉菜单  -> 最外面那个      (如果它里面的页面都没权限访问的话就不添加)
        if (index == 0 || index == 1 || index == 2) {  //页面的前三个路由是全局共有的
          this.paths.push(value);
        } else {
          let valueChildren = [];
          value.children.map(item => {
            //对一级下拉框的孩子进行遍历  ->遍历他的二级下拉框
            let hasAttr = "roles" in item.meta;
            if (hasAttr == true || hasAttr == "true") {
              //如果有这个对象     --->表示标明了对象
              item.meta.roles.map(itemRoles => {
                //遍历 每一张页面的roles属性数组
                let tempItemRoles = '"' + itemRoles + '"'; //  ---> 页面角色和用户权限取出来的时候 页面权限没有引号 用户权限有引号  ->所以这一步给界面的权限加引号
                if (tempItemRoles == userRoles) {
                  //判断 这个 页面的属性数组里面有没有当前用户的角色  如果有就把他添加到路由里面去
                  valueChildren.push(item);
                  addThisCatalog = true;
                }
              });
            }
          });

          if (addThisCatalog == true) {
            value.children = valueChildren;
            this.paths.push(value);
          }
        }
      });
    }
  }
};
</script>
