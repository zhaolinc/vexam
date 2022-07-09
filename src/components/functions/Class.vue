<template>
  <div style="display: flex;flex-direction: column;height: 100%">
    <!--功能-->
    <div class="function">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addbtn" class="function_addbtn">增加</el-button>
      <el-button type="primary"  @click="addbtn" class="function_addbtn" style="width: 125px">导出班级信息</el-button>
      <div>
        <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select" style="width: 600px;">
          <el-select v-model="select" clearable slot="prepend" placeholder="请选择">
            <el-option label="班级编号" value="1"></el-option>
            <el-option label="班级名称" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="this.getClassList" style="background: #456FFF;color: white"></el-button>
        </el-input>
      </div>
    </div>

    <!--班级列表-->
    <el-table
      border
      v-loading="loading"
      style="width: 100%;flex: 1"
      :data="classList.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column fixed prop="avatar" label="头像" width="80px"><template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
      </template></el-table-column>
      <el-table-column fixed prop="classname" label="班级名称"></el-table-column>
      <el-table-column prop="classno" label="班级编号"></el-table-column>
      <el-table-column prop="count" label="班级现在人数"></el-table-column>
      <el-table-column prop="size" label="班级最大人数"></el-table-column>
      <el-table-column prop="master" label="班主任"></el-table-column>
      <el-table-column prop="describe" label="班级备注" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作"><template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">查看学生列表</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small" style="color: red">删除</el-button>
      </template></el-table-column>
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
        :total="classList.length">
      </el-pagination>
    </div>

    <!--学生列表-->
    <el-dialog title="学生列表" :visible.sync="stuListVisable">
      <el-table
        :data="stuList"
        border
        style="width: 100%">
        <el-table-column fixed prop="avatar" label="头像" width="80px">
          <template slot-scope="scope">
            <el-avatar shape="square" :size="50"  :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column fixed prop="name" label="姓名"></el-table-column>
        <el-table-column prop="userno" label="编号"></el-table-column>
        <el-table-column prop="phone" label="电话号码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="gender" label="性别">
          <template slot-scope="scope">
            {{scope.row.gender==0? '女' : '男'}}
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

    <!--增加班级信息模态框-->
    <el-dialog :title="title" :visible.sync="addEditVisable">
      <el-form :model="form">
        <el-form-item label="班级头像" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="exam/fileUpload/image"
            :on-change="handleChange"
            list-type="picture"
            :limit= "1"
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="班级编号" v-if="title=='编辑班级信息' ? false : true" :label-width="formLabelWidth">
          <el-input v-model="form.classno" :value="form.classno" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="form.classname" :value="form.classname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级最大人数" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.size" :value="form.size" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级备注" :label-width="formLabelWidth" >
          <el-input v-model="form.describe" :value="form.describe" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班主任"  :label-width="formLabelWidth">
          <el-select :data="teachers"  v-model="form.teacherno" placeholder="请选择班主任">
            <el-option v-for="(item,index) in teachers" :key="index" :label="item.name" :value="item.userno"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Class",
  data() {
    return {
      /*分页参数*/
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 12, // 每页的数据条数
      title: "新增班级",
      loading: true,
      addEditVisable: false,
      stuListVisable: false,
      classList: [],
      teachers:[],
      fileList:[],
      stuList:[],
      form: {
        classno: '',
        classname: '',
        size: '',
        master: '',
        avatar: '',
        describe: '',
        createtime: '',
        teacherno:'',
      },
      select: '',
      searchInput: '',
      formLabelWidth: '120px',
    }
  },
  methods: {
    //获取班级List
    getClassList(){
      this.loading = true
      this.axios.get(`/exam/classes/select`,{params:{
        select: this.select,
        searchInput: this.searchInput
      }})
        .then((response) => {
        this.classList = response.data
        this.loading = false
      }),err=>{
        this.loading = false
        this.$message.error(err)
      }
    },

    //获取学生List
    getStuList(classno){
      this.axios.get(`/exam/user/getClassStuList`,{
        params:{
          classno: classno
        }
      }).then((response) => {
        this.stuList = response.data
      })
    },

    //获取老师列表
    getTeachers(){
      this.axios.get(`/exam/user/getTeachers`,)
        .then((response) => {
        this.teachers = response.data
      })
    },

    //添加按钮
    addbtn(){
      this.title = "新增班级"
      this.getTeachers()
      this.addEditVisable = true
    },

    //修改头像
    handleChange(file){
      this.form.avatar = this.$global.imageurl+file.name
    },

    //新增编辑模态框确认
    confirm(){
      if (this.title=="新增班级"){
        //新增班级代码开始
        if (this.form.userno != ''){
          this.axios.post(`/exam/classes/insert`,this.form)
            .then(res=>{
              if (res.data == 1){
                this.$refs.upload.submit()
                this.$message.success("添加成功!!!")
                this.form = {
                  classno: '',
                  classname: '',
                  size: '',
                  master: '',
                  avatar: '',
                  describe: '',
                  createtime: '',
                  teacherno:'',
                }
                this.teachers = []
                this.getClassList()
                this.addEditVisable = false
              }
              if (res.data== 0 ) this.$message.error("添加失败!!!")
              if (res.data == 2) this.$message.error("班级已经存在!!!")
            })
        }else {
          this.$message.error("已经没有可以带班的班主任!!!")
        }
      //新增班级代码结束
      }else if(this.title=="编辑班级信息"){
        //编辑班级信息代码开始
        this.axios.post(`/exam/classes/updateClassInfo`,this.form)
          .then(res=>{
            if (res.data != 0){
              this.getClassList()
              this.addEditVisable = false
              this.$message.success("修改成功!!!")
            }else this.$message.error("修改失败!!!")
          })
        //编辑班级信息代码结束
      }
    },

    cancel(){
      this.addEditVisable  = false;
      this.form = {
        classno: '',
        classname: '',
        size: '',
        master: '',
        avatar: '',
        describe: '',
        createtime: '',
        teacherno:'',
      }
    },

    //查询学生列表
    detail(row) {
      this.title=="学生列表"
      this.getStuList(row.classno);
      this.stuListVisable = true
    },

    //编辑班级信息
    edit(row) {
      this.title = "编辑班级信息";
      this.getTeachers();
      this.form = row;
      this.addEditVisable = true;
    },

    //删除班级信息
    del(row) {
      this.axios.get('/exam/classes/delete',{params: {
          classno: row.classno
        }}).then(res => {
          if (res!=0){
            this.$message.success("删除成功!!!")
            this.getClassList()
          }
        },err => {
          this.$message.error(err)
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
    this.getClassList()
    this.tableheight = window.innerHeight - 120 + 'px';
  }
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
