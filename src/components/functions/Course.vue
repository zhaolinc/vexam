<template>
  <div style="display: flex;flex-direction: column;height: 100%">
    <!--    功能-->
    <div class="function">
      <div>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addbtn" class="function_addbtn">增加</el-button>
      </div>
      <div style="width: 600px;">
        <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="课程邀请码" value="1"></el-option>
            <el-option label="课程名称名称" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="this.getcourseList" style="background: #456FFF;color: white"></el-button>
        </el-input>
      </div>
    </div>

    <!--    课程列表-->
    <el-table
      border
      v-loading="loading"
      :data="courseList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%">
      <el-table-column fixed prop="avatar" label="头像" width="80px">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column fixed prop="coursename" label="课程名称"></el-table-column>
      <el-table-column prop="courseno" label="课程邀请码"></el-table-column>
      <el-table-column prop="count" label="课程已选课人数"></el-table-column>
      <el-table-column prop="size" label="课程最大选课人数"></el-table-column>
      <el-table-column prop="teachername" label="任课教师"></el-table-column>
      <el-table-column prop="describe" label="课程备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createtime" label="创建时间" sortable></el-table-column>
      <el-table-column fixed="right" label="操作" width="350">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">查看选课学生</el-button>
          <el-button @click="qrCodeGeneration(scope.row)" type="text" size="small">班级邀请码</el-button>
          <el-button @click="pointadd(scope.row)" type="text" size="small">增加知识点</el-button>
<!--          <el-button @click="deletePoint(scope.row)" type="text" size="small">删除知识点</el-button>-->
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
        :total="courseList.length">
      </el-pagination>
    </div>

    <!--学生列表模态框-->
    <el-dialog title="学生列表" :visible.sync="stuListVisable">
      <el-table
        :data="stuList"
        border
        style="width: 100%">
        <el-table-column fixed prop="avatar" label="头像" width="80px"><template slot-scope="scope">
            <el-avatar shape="square" :size="50"  :src="scope.row.avatar"></el-avatar>
        </template></el-table-column>
        <el-table-column fixed prop="name" label="姓名"></el-table-column>
        <el-table-column prop="userno" label="编号"></el-table-column>
        <el-table-column prop="phone" label="电话号码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="gender" label="性别">
          <template slot-scope="scope">
            {{scope.row.gender|genderTrans}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--班级新增编辑模态框-->
    <el-dialog :title="title" :visible.sync="addEditVisable">
      <el-form :model="form">
        <el-form-item label="课程LOGO" :label-width="formLabelWidth">
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
        <el-form-item label="课程邀请码" v-if="title=='编辑课程信息' ? false : true" :label-width="formLabelWidth">
          <el-input v-model="form.courseno" :value="form.courseno" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="form.coursename" :value="form.coursename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大选课人数" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.size" :value="form.size" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程备注" :label-width="formLabelWidth" >
          <el-input v-model="form.describe" :value="form.describe" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="任课教师"  :label-width="formLabelWidth">
          <el-select :data="teachers"  v-model="form.userno" placeholder="请选择任课教师">
            <el-option v-for="(item,index) in teachers" :key="index" :label="item.name" :value="item.userno"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEditVisable = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增知识点模态框-->
    <el-dialog title="新增知识点" :visible.sync="addPointVisable">
      <el-form :model="form">
        <el-form-item label="知识点编号"  :label-width="formLabelWidth">
          <el-input v-model="pointform.pointid" :value="pointform.pointid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识点内容" :label-width="formLabelWidth">
          <el-input v-model="pointform.point" :value="pointform.point" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPointVisable = false">取 消</el-button>
        <el-button type="primary" @click="addPoint">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="二维码" :visible.sync="qrCodeVisible" width="27%" >
      <!-- 二维码图片 -->
      <div id="qrCodeUrl"></div>
      <!-- 取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrCodeVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: "Course",
  data() {
    return {
      qrCodeVisible: false, // 二维码弹框
      /*分页参数*/
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 12, // 每页的数据条数

      title: "新增课程",
      loading: true,
      addEditVisable: false,
      stuListVisable: false,
      addPointVisable: false,
      courseList: [],
      teachers:[],
      fileList:[],
      stuList:[],
      form: {
        courseno: '',
        coursename: '',
        size: '',
        avatar: '',
        describe: '',
        createtime: '',
        userno:'',
      },
      pointform:{
        pointid: '',
        point: '',
        courseno:''
      },
      select: '',
      searchInput: '',
      formLabelWidth: '120px',
    }
  },
  methods: {
    //获取课程列表
    getcourseList(){
      this.axios.get(`/exam/course/select`,{
        params:{
          select: this.select,
          searchInput: this.searchInput
        }
      }).then((response) => {
        this.courseList = response.data
        this.loading = false
      })

    },

    //获取学生列表
    getStuList(courseno){
      this.axios.get(`/exam/user/getCourseStuList`,{
        params:{
          courseno: courseno
        }
      }).then((response) => {
        this.stuList = response.data
      })
    },

    //获取老师列表
    getTeachers(){
      this.axios.get(`/exam/user/getAllTeacher`,).then((response) => {
        this.teachers = response.data
      })
    },

    addbtn(){//添加按钮
      this.title = "新增课程"
      this.getTeachers()
      this.addEditVisable = true
    },

    handleChange(file){
      this.form.avatar = "https://zhaolin.space/wexam/avatar/"+file.name
    },

    //模态框确认
    confirm(){//模态框确认按钮
      if (this.title=="新增课程"){
        if (this.form.userno != ''){
          this.axios.post(`/exam/course/insert`,this.form)
            .then(res=>{
              if (res.data== 0 ){
                this.$message({
                  showClose: true,
                  message: "添加失败!!!",
                  type: 'error'
                });
              }else if (res.data == 1){
                this.$refs.upload.submit()
                this.$message({
                  showClose: true,
                  message: "添加成功!!!",
                  type: 'success'
                });
                this.teachers = []
                this.getcourseList()
                this.addEditVisable = false
              }else if (res.data == 2){
                this.$message({
                  showClose: true,
                  message: "课程已经存在!!!",
                  type: 'error'
                });
              }else if (res.data == 3){
                this.$message({
                  showClose: true,
                  message: "请输入完整信息!!!",
                  type: 'error'
                });
              }
            })
        }else {
          this.$message({
            showClose: true,
            message: "已经没有可以带班的班主任!!!",
            type: 'error'
          });
        }
      }else if(this.title=="编辑课程信息"){
        this.axios.post(`/exam/course/update`,this.form)
          .then(res=>{
            if (res.data != 0){
              this.getcourseList()
              this.addEditVisable = false
              this.$message({
                showClose: true,
                message: "修改成功!!!",
                type: 'success'
              });
            }else{
              this.$message({
                showClose: true,
                message: "修改失败!!!",
                type: 'error'
              });
            }

          }),err=>{
          this.$message({
            showClose: true,
            message: err,
            type: 'error'
          });
        }
      }
    },

    //查询学生列表
    detail(row) {
      this.title=="学生列表"
      this.getStuList(row.courseno);
      this.stuListVisable = true
    },
    qrCodeGeneration(row){
      let courseno = row.courseno
      // 二维码弹框显示
      this.qrCodeVisible = true;
      // 生成二维码
      this.$nextTick(function () {
        document.getElementById("qrCodeUrl").innerHTML = "";
        let qrCodeUrl= new QRCode("qrCodeUrl", {
          width: 200,
          height: 200,
          text: courseno,
          colorDark: "#409EFF",
          colorLight: "#fff"
        });
      });

    },

    //编辑课程信息
    edit(row) {
      this.title = "编辑课程信息"
      this.getTeachers()
      this.form = row //updateClassInfo
      this.addEditVisable = true
    },

    //删除班级信息
    del(row) {
      this.axios.get('/exam/course/delete',{
        params: {
          courseno: row.courseno
        }
      }).then(res => {
          if (res!=0){
            this.getcourseList()
            this.$message({
              showClose: true,
              message: "删除成功！！！",
              type: 'success'
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

    pointadd(row){
      this.addPointVisable = true
      console.log(row.courseno)
      this.pointform.courseno = row.courseno
    },

    //知识点管理
    addPoint(){
      this.axios.get('/exam/points/insert',{
        params: this.pointform
      }).then(res => {
          if (res!=0){
            this.addPointVisable = false
            this.$message.success("添加成功！！！")
          }

        },err => {
        this.addPointVisable = false
          this.$message.error("添加失败！！！")
        }
      )
    },
    deletePoint(){

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
    this.getcourseList()
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
/deep/ .el-dialog__header {
  text-align: center;
}

/deep/ #qrCodeUrl > img {
  margin: 0 auto;
}
</style>
