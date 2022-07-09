<template>
  <div style="display: flex;flex-direction: column;height: 100%">
    <!--功能-->
    <div class="function">
      <div>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addbtn" class="function_addbtn">增加</el-button>
      </div>
      <div style="width: 600px;">
        <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="教师编号" value="1"></el-option>
            <el-option label="教师姓名" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search" style="background: #456FFF;color: white"></el-button>
        </el-input>
      </div>
    </div>
    <!--老师列表-->
    <el-table
      v-loading="loading"
      :data="teacherList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="avatar"
        label="头像"
        width="80px"
      >
        <template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        prop="name"
        label="教师姓名"
      ></el-table-column>

      <el-table-column
        fixed
        prop="userno"
        label="教师编号"
      ></el-table-column>

      <el-table-column
        prop="gender"
        label="性别"
      >
        <template slot-scope="scope">
          {{scope.row.gender == 0 ? '女' : '男'}}
        </template>
      </el-table-column>

      <el-table-column
        prop="phone"
        label="电话"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="电子邮箱"
      >
      </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
      ><template slot-scope="scope">
        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="del(scope.row)" type="text" size="small" style="color: red">删除</el-button>
      </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="block" style="margin-top:15px;">
      <el-pagination
        align='right'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,5,10,12,15]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="teacherList.length">
      </el-pagination>
    </div>


    <el-dialog :title="title" :visible.sync="addEditVisable">
      <el-form :model="form">
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="exam/fileUpload/image"
            :on-change="handleChange"
            list-type="picture"
            :limit= "1"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="名字"  :label-width="formLabelWidth">
          <el-input v-model="form.name" :value="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师编号" v-if="title=='修改教师信息'? false : true" :label-width="formLabelWidth">
          <el-input v-model="form.userno" :value="form.userno" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="密码"  :label-width="formLabelWidth">
          <el-input v-model="form.password" :value="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select   v-model="form.gender" :placeholder="form.gender=='0' ? '女' : '男'">
            <el-option  label="男" value="1"></el-option>
            <el-option  label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" >
          <el-input v-model="form.phone" :value="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" >
          <el-input v-model="form.email" :value="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEditVisable = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Teacher",
  data() {
    return {
      /*分页参数*/
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 12, // 每页的数据条数

      title: "新增教师",
      loading: true,
      addEditVisable: false,
      teacherList:[],
      fileList:[],
      form: {
        userno:'',
        password:'123456',
        avatar: '',
        name:'',
        gender:'',
        phone:'',
        email:'',
        type: 1,
        classname:'',
      },
      select: '',
      searchInput: '',
      formLabelWidth: '120px',
    }
  },
  methods: {
    getTeacherList(){
      this.loading = true
      if (this.searchInput==''){
        this.axios.get(`/exam/user/getAllStuT`,{
          params:{
            type: 1
          }
        }).then((res) => {
          this.teacherList = res.data
          this.loading = false
        })
      }else {
        this.axios.get(`/exam/user/getAllStuT`,{
          params:{
            select: this.select,
            searchInput: this.searchInput,
            type: 1
          }
        }).then((res) => {
          this.teacherList = res.data
          this.loading = false
        })
      }
    },

    search(){
      this.getTeacherList();
    },
    addbtn(){//添加按钮
      this.title = "新增教师"
      this.addEditVisable = true
    },
    handleChange(file){
      this.form.avatar = this.$global.imageurl+file.name
    },
    //模态框确认
    confirm(){//模态框确认按钮
      if (this.title=="新增教师"){
        if (this.form.userno != ''){
          this.axios.post(`/exam/user/insert`,this.form)
            .then(res=>{
              if(res != 0){
                this.$message({
                  showClose: true,
                  message: "新增成功!!!",
                  type: 'success'
                });
                this.$refs.upload.submit()
                this.getTeacherList()
              }else {
                this.$message({
                  showClose: true,
                  message: "新增失败!!!",
                  type: 'error'
                });
              }
              this.addEditVisable = false
            }),err=>{
            this.$message({
              showClose: true,
              message: err,
              type: 'error'
            });
          }
        }else {

        }
        this.getTeacherList()
      }else if(this.title=="修改教师信息"){
        console.log(this.form)
        this.axios.post(`/exam/user/update1`,this.form)
          .then(res=>{
            if (res!=0){
              this.$refs.upload.submit()
              this.$message({
                showClose: true,
                message: "修改成功！！！",
                type: 'success'
              });
              this.getTeacherList()
            }else {
              this.$message({
                showClose: true,
                message: "修改失败！",
                type: 'error'
              });
            }
            this.getTeacherList()
            this.addEditVisable = false
          }),err=>{
          this.$message({
            showClose: true,
            message: err,
            type: 'error'
          });
        }
      }

    },
    edit(row) {
      this.title = "修改教师信息"
      this.form = row; //updateClassInfo
      this.addEditVisable = true
    },
    del(row) {
      this.axios.get('/exam/user/delete',{
        params: {
          userno: row.userno
        }
      }).then(res => {
          if (res!=0){
            this.$message({
              showClose: true,
              message: "删除成功!!!",
              type: 'success'
            });
            this.getTeacherList()
          }else {
            this.$message({
              showClose: true,
              message: "删除失败!!!",
              type: 'error'
            });
          }
        },err => {
        this.$message({
          showClose: true,
          message: err,
          type: 'error'
        });
        }
      )
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  },
  mounted() {
    this.getTeacherList()
  },
  filters: {
    genderTrans: function(gender) {
      switch (parseInt(gender)) {
        case 0:
          return '女'
        case 1:
          return '男'
        default :
          return '男'
      }
    },
  },
}
</script>

<style scoped>
.function{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  padding: 0px 10px 10px 10px;
}
.function_addbtn{
  height: 37px;
  width: 100px;
  margin-top: 1px;
  margin-left: 20px;
  margin-right: 10px;
  background: #456FFF;
  color: white
}
.el-select{
  width: 140px !important;
}
.upload-demo{
  width: auto;
}
.el-button{
  border-radius: 0px !important;
}
</style>
