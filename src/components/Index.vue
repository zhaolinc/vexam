<template>
  <el-container style="height: 100%">
    <el-header style="height: 60px;">
      <el-row style="height: 100%;width: 100%">
        <el-col :span="1" style="height: 100%">
          <el-image style="width: 60px; height: 60px"
                    :src="require('@/assets/logo.jpg')"
                    ></el-image>
        </el-col>
        <el-col :span="4" style="height: 100%">
          <el-image style="height: 60px"
                    :src="require('@/assets/logot.jpg')"
                    ></el-image>
        </el-col>
        <el-col :span="19" style="height: 100%;display: flex;align-items: center;justify-content: right">
          <el-avatar size="small" :src="userInfo.avatar" style="margin-right: 10px"></el-avatar>
          <el-dropdown style="height: 100%;display: flex;align-items: center;justify-content: right;font-size:large" @command="handleCommand">
            <span class="el-dropdown-link">
              {{userInfo.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container :style="defaultHeight">
      <el-aside width="180px" class="theme" style="height: 100%">
        <el-menu
          :default-active="activerouter"
           background-color="#304156"
           text-color="#fff"
           active-text-color="#fff"
           unique-opened
           router>
          <el-menu-item index="/class"><span class="iconfont icon-banjiguanli"></span>班级管理</el-menu-item>
          <el-menu-item index="/teacher"><span class="iconfont icon-guanli-jiaoshi"></span>教师管理</el-menu-item>
          <el-menu-item index="/student"><span class="iconfont icon-xueshengguanli" ></span>学生管理</el-menu-item>
          <el-menu-item index="/course"><span class="iconfont icon-kechengguanli_kechengguanli-21"></span>课程管理</el-menu-item>
          <el-menu-item index="/question"><span class="iconfont icon-tikuguanli"></span>题库管理</el-menu-item>
          <el-menu-item index="/paper"><span class="iconfont icon-shijuanguanli"></span>考试管理</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="height: 100%">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return{
      userInfo:{
        name:'游客登录'
      },
      activerouter: this.$router.path,
      defaultHeight:{
        height: ""
      }
    }
  },
  methods: {
    getHeight(){
      this.defaultHeight.height = window.innerHeight - 60 + 'px';
    },
    handleCommand(command){
      if (command=='logout'){
        this.logout()
      }
    },
    logout(){
      sessionStorage.setItem("user",null)
      this.$router.push("/")
    }
  },
  mounted() {
    var userInfo = sessionStorage.getItem('user');
    if (userInfo==null){
      this.$router.push("/")
    }
    this.userInfo= JSON.parse(userInfo);
    //设置页面路由
    let defaultMenu = window.location.hash.substr(
      window.location.hash.indexOf("/")
    );
    this.activerouter = defaultMenu;
  },
  created() {
    window.addEventListener("resize",this.getHeight);
    this.getHeight();
  }
}
</script>
<style scoped>
@import "../iconfont/iconfont.css";
.el-menu-item.is-active {
  background-color: #456FFF !important;
}
.theme{
  background-color: #304156;
  color: white;
}
.el-aside {
  color: #333;
}
.el-main{
  padding: 10px  20px !important;
  background: #eceeed;
  box-shadow: 0px 0px 5px 5px #c0c4c1 inset;
}
.el-menu-item span{
  margin-right: 10px;
  color: white;
  font-size: 15px;
}
.el-button{
  border-radius: 0px !important;
}
</style>
