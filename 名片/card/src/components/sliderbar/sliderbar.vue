<!-- 左侧导航组件 -->
<!-- 使用说明：<side-bar></side-bar> -->
<template>
    <div id="sidebar-wrap" :class="{ collapsed: toggSiderBar }">
        <h3 class="logo">{{toggSiderBar ? '名片': wz_name}}</h3>
        <el-menu background-color="#324157" text-color="#ddd" :default-active="$route.path" :unique-opened="isUnique" :router="isRouter"  :collapse="toggSiderBar">           
            <template v-for="item in menu" v-if='group_id==1'>
                <el-submenu v-if="item.children.length !== 0" :index="item.router" :key="item.router">
                    <template slot="title">
                        <i :class="item.icon" style='font-size:20px'></i>
                        <span slot="title">{{langType === 'en'? item.name_en: item.name}}</span>
                    </template>
                    <el-menu-item v-for="child in item.children" :index="child.router" :key="child.router">
                        <i :class="child.icon" style='font-size:20px'></i>
                       <span slot="title">{{langType === 'en'? child.name_en: child.name}}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="item.router" :key="item.router">
                    <i :class="item.icon" style='font-size:20px'></i>
                    <span slot="title">{{langType === 'en'? item.name_en: item.name}}</span>
                </el-menu-item>
            </template>

            <template v-for="item in menu2" v-if='group_id!=1'>
                <el-submenu v-if="item.children.length !== 0" :index="item.router" :key="item.router">
                    <template slot="title">
                        <i :class="item.icon" style='font-size:20px'></i>
                        <span slot="title">{{langType === 'en'? item.name_en: item.name}}</span>
                    </template>
                    <el-menu-item v-for="child in item.children" :index="child.router" :key="child.router">
                        <i :class="child.icon" style='font-size:20px'></i>
                       <span slot="title">{{langType === 'en'? child.name_en: child.name}}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="item.router" :key="item.router">
                    <i :class="item.icon" style='font-size:20px'></i>
                    <span slot="title">{{langType === 'en'? item.name_en: item.name}}</span>
                </el-menu-item>
            </template>            
        </el-menu>        
    </div>
</template>
<script>
export default {
  name: "sidebar",
  data() {
    return {
      wz_name: "",
      isMusicOn: false,
      isUnique: true,
      isRouter: true,
      //id是否为1
      group_id: "",
      //侧边栏数据
      menu: [
        {
          name: "用户管理",
          name_en: "Users",
          router: "",
          icon: "iconfont icon-user",
          children: [
            {
              name: "用户管理",
              name_en: "Users",
              router: "/user",
              icon: "iconfont icon-user"
            },
            {
              name: "角色管理",
              name_en: "Users",
              router: "/role",
              icon: "iconfont icon-user_role",
              meta: {
                show: true
              }
            }
          ]
        },
        {
          name: "运营管理",
          name_en: "operation",
          router: "/weather",
          icon: "iconfont icon-yunying",
          children: [
            {
              name: "企业管理",
              name_en: "operation",
              router: "/company",
              icon: "iconfont icon-web-icon-"
            },
            {
              name: "产品管理",
              name_en: "operation",
              router: "/products",
              icon: "iconfont icon-weibiaoti35"
            }
          ]
        },
        {
          name: "系统管理",
          name_en: "system",
          router: "/cube",
          icon: "iconfont icon-xitong",
          children: [
            {
              name: "站点设置",
              name_en: "system",
              router: "/set",
              icon: "iconfont icon-zhandianpeizhi"
            },
            {
              name: "日志列表",
              name_en: "system",
              router: "/log",
              icon: "iconfont icon-rizhiguanli"
            }
          ]
        }
      ],
      menu2: [
        {
          name: "用户管理",
          name_en: "Users",
          router: "",
          icon: "iconfont icon-user",
          children: [
            {
              name: "用户管理",
              name_en: "Users",
              router: "/user",
              icon: "iconfont icon-user"
            }
          ]
        },
        {
          name: "运营管理",
          name_en: "operation",
          router: "/weather",
          icon: "iconfont icon-yunying",
          children: [
            {
              name: "企业管理",
              name_en: "operation",
              router: "/company",
              icon: "iconfont icon-web-icon-"
            },
            {
              name: "产品管理",
              name_en: "operation",
              router: "/products",
              icon: "iconfont icon-weibiaoti35"
            }
          ]
        }
      ]
    };
  },
  computed: {
    toggSiderBar() {
      return this.$store.state.isCollapse;
    },
    langType() {
      return this.$i18n.locale;
    }
  },
  created() {
    this.wz_name = localStorage.getItem("wz_name");
    this.token = localStorage.getItem("token");
    this.$axios
      .get("/api/admin/permlist", {
        headers: {
          Authorization: "Bearer " + this.token,
          Accept: "application/vnd.myapp.v1+json"
        }
      })
      .then(res => {
        console.log(res)
        this.group_id = res.data.group_id;
        localStorage.setItem("id", res.data.group_id);
      });
  },
  methods: {}
};
</script>
<style scoped lang="less">
#sidebar-wrap {
  width: 240px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 5;
  /* 图标动画 */
  .imgWrap {
    text-align: center;
    position: absolute;
    bottom: 30px;
    width: 100%;
    .gif {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .logo {
    // width:239px;
    color: #fff;
    text-align: center;
    background: #324157;
    padding: 18px 0;
    margin: 0;
  }
}

// 动态改变左侧导航包裹层宽度
#sidebar-wrap.collapsed {
  transition: all 0.3s;
  width: 64px;
}
.el-menu {
  height: 100%;
}

// 美化左侧导航的留白
.el-submenu .el-menu-item {
  padding: 0 50px;
  min-width: 239px;
  padding-left: 40px !important;
}
</style>
