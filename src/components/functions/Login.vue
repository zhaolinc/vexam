<template>
<div class="loginpage">
  <div class="title">
    <h1 >在线考试</h1>
    <h1 style="margin-left: 50px">登陆系统界面</h1>
    <h2 style="margin-left: 100px">ONLINE EXAM SYSTEM</h2>
  </div>
  <div class="container">
    <el-form :model="form">
      <el-row>
        <el-col :span="6" :offset="6"  class="teacher change" :class="flag ? 'active' : 'noactive'" @click.native="change">教师</el-col>
        <el-col :span="6" class="admin change" :class="flag ? 'noactive' : 'active'" @click.native="change">管理员</el-col>
      </el-row>
      <el-row  class="myfrom">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input
            class="myinput"
            v-model="form.userno"
            :value="form.userno"
            autocomplete="off"
            placeholder="请输入账号">
          </el-input>
        </el-form-item>
      </el-row>
      <el-row  class="myfrom">
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            class="myinput"
            v-model="form.password"
            :value="form.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码">
          </el-input>
        </el-form-item>
      </el-row>
      <el-row  class="myfrom login" @click.native="submitForm">登录</el-row>
    </el-form>
  </div>

</div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form:{
        type: 2,
        userno:'admin',
        password:'admin'
      },
      code:'',
      formLabelWidth: '65px',
      flag: false
    }
  },
  methods: {
    change(){
      this.flag = !this.flag
      if (this.flag){
        this.form.type = 1;
      }else {
        this.form.type = 2;
      }
    },
    submitForm() {
      if (this.form.userno==''){
        this.$message.success("请输入账号!!!!");
      }
      if (this.form.password==''){
        this.$message.error("请输入密码")
      }
      this.axios.get('/exam/user/login',{
        params:{
          userno: this.form.userno,
          password: this.form.password,
          type: this.form.type
        }
      }).then(res=>{
        if (res.data!=''){
          sessionStorage.setItem('user', JSON.stringify(res.data));
          this.$router.push("/index")
          this.$message.success("登陆成功！！！")
        }else{
          this.$message.error("账号或密码错误！！！");
        }
      })
    }
  }
}
</script>

<style scoped>
.myinput>>>.el-input__inner{
  font-size: large !important;
  color: #2f2f2f !important;
  /*font-family: cursive !important;*/
  border: 0px;
  background-color: rgba(229, 235, 246, 0.0);
}
.active{
  background-color: #456FFF;
}
.noactive{
  background-color: rgba(229, 235, 246, 0.6);
}
.title{
  position: fixed;
  top: 5%;
  right: 10%;
  height: 20%;
  width: 30%;
  color: white;
  font-size: x-large;
  font-weight: bold;
  font-family: 华文隶书;
}
.loginpage{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: url('../../assets/login.jpg');
  background-size: cover;
}
.container{
  height: 247px;
  width: 400px;
}
.el-row{
  height: 40px;
}
.myfrom{
  margin-top: 15px;
  background-color: rgba(229, 235, 246, 0.7);
  border-radius: 50px;
  width: 90%;
  margin-left: 5%;
}
.yan{
  margin-top: 15px;
  width: 90%;
  margin-left: 5%;
}
.el-row .el-col{
  height: 100%;
}
.change{
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
}
.teacher{
  border-bottom-left-radius: 50px;
  border-top-left-radius: 50px;
}
.admin{
  border-bottom-right-radius: 50px;
  border-top-right-radius: 50px;
}
.login{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #456FFF;
  color: white;
  cursor: pointer;
}
</style>
