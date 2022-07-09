<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <!--    功能-->
    <div class="function">
      <el-button type="primary" @click="addButton" class="function_addbtn">生成试卷</el-button>
      <div>
        <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select" style="width: 600px;">
          <el-select v-model="select" slot="prepend" placeholder="请选择" class="function_select">
            <el-option label="所属课程" value="1"></el-option>
            <el-option label="班级名称" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="this.getpaperList" style="background: #456FFF;color: white"></el-button>
        </el-input>
      </div>
    </div>

    <!--    试卷列表-->
    <el-table v-loading="loading" :data="paperList" border style="width: 100%;flex: 1">
      <el-table-column fixed prop="coursename" label="试卷标题" show-overflow-tooltip></el-table-column>
      <el-table-column prop="difficulty" label="难度系数"></el-table-column>
      <el-table-column prop="totalscore" label="总分"></el-table-column>
      <el-table-column prop="starttime" label="考试开始时间"></el-table-column>
      <el-table-column prop="endtime" label="考试结束时间"></el-table-column>
      <el-table-column prop="type" label="考试状态">
        <template slot-scope="scope">
          {{scope.row.type==0 ? '未发布考试' : '已发布考试'}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="400px"><template slot-scope="scope">
        <el-button @click="detail(scope.row)" type="text" size="small">查看详情</el-button>
        <el-button @click="sendTime(scope.row)" type="text" size="small">设置考试时间</el-button>
        <el-button @click="sendTest(scope.row)" type="text" size="small" v-if="scope.row.type==0">发布考试</el-button>
        <el-button @click="cancelTest(scope.row)" type="text" size="small" style="color: red" v-if="scope.row.type==1">取消考试</el-button>
        <el-button @click="deletePaper(scope.row)" type="text" size="small" style="color: red" v-if="scope.row.type==0">删除试卷</el-button>
      </template></el-table-column>
    </el-table>

    <!--时间选择器-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="block">
        <span class="demonstration">默认</span>
        <el-date-picker
          v-model="date"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dateConfire">确 定</el-button>
      </span>
    </el-dialog>

    <!--侧边抽屉-->
    <el-drawer
      title="请输入试卷参数!"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="所属课程" :label-width="formLabelWidth">
            <el-select :data="courseList" v-model="form.courseno" placeholder="请先选择课程" class="courseList" @change="getPoints">
              <el-option v-for="(item,index) in courseList" :key="index" :label="item.coursename" :value="item.courseno"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="知识点" :label-width="formLabelWidth">
            <el-select  v-model="points" multiple clearable :multiple-limit="limit"  placeholder="请选择知识点" style="width: 100%">
              <el-option v-for="(item,index) in pointList" :key="index" :label="item.point" :value="item.pointid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题型" :label-width="formLabelWidth">
            <el-select  v-model="form.typeid" clearable  placeholder="请选择题型" style="width: 100%">
              <el-option v-for="(item,index) in typeList" :key="index" :label="item.title" :value="item.typeid"></el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="难度系数" :label-width="formLabelWidth">
                <el-input v-model="form.difficulty" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row style="width: 100%;height: 40px;"></el-row>
        <div class="demo-drawer__footer">
          <el-button @click="dialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmForm">确认</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "Paper",
  data() {
    return {
      title: "新增班级",
      loading: true,
      addEditVisable: false,
      dialogVisible:false,
      /*试卷列表*/
      paperList: [],
      typeList:[
        {
          typeid: '1',
          title: '(1) 单选(5题,10分)、多选(5题,10分)'
        },{
          typeid: '2',
          title: '(2) 单选(5题,10分)、判断(5题,10分)'
        },{
          typeid: '3',
          title: '(3) 单选(10题,10分)'
        }
        ],
      types:[],
      courseList: [],
      points: [],
      pointList: [],
      form: {
        title: "",
        points: "",
        typeid: "",
        difficulty: "",
        courseno: ""
      },
      dialog: false,
      select: '',
      searchInput: '',
      limit: 20,
      date: [new Date(), new Date()],
      formLabelWidth: '80px',
    }
  },
  methods: {
    getpaperList(){
      this.loading = true
      this.axios.get(`/exam/paper/select`,{
        params:{
          select: this.select,
          searchInput: this.searchInput,
        }
      }).then((response) => {
        this.paperList = response.data
        this.loading = false
      })
    },

    addButton(){
      this.dialog = true
      this.axios.get(`/exam/course/select`)
        .then((response) => {
        this.courseList = response.data
        this.loading = false
      })
    },

    getPoints(e){
      this.axios.get(`/exam/points/selectByCourseno`,{
        params:{
          courseno: e
        }
      }).then((res) => {
        this.pointList = res.data
      })
    },

    confirmForm() {
      this.form.points = JSON.stringify(this.points);
      this.axios.post(`/exam/paper/insert`,this.form)
      .then(res=>{
        this.getpaperList()
        this.$message.success("生成成功！！！")
        this.dialog = false;
      }),err=>{
        this.$message.error(err)
      }

    },

    detail(row){
      this.$router.push({
        path: '/grade',
        query:{
          id: row.id
        }
      })
    },

    sendTime(row){
      if(row.type==1){
        this.$message.error("已经发布考试")
      }else {
        this.dialogVisible = true
        this.id = row.id
      }

    },

    dateConfire(){
      this.dialogVisible = false;
      this.axios.get(`exam/paper/update`,{params:{
          starttime: this.date[0],
          endtime: this.date[1],
          id:this.id
        }}).then(res=>{
          if (res!=0){
            this.$message.success("设置成功！！！")
            this.getpaperList();
          }else
            this.$message.error("设置失败！！！")
      }),err=>{
        this.$message.error(err)
      }
    },

    sendTest(row){
      if(row.type==1){
        this.$message.error("已经发布考试！！！")
      }else {
        this.axios.get(`exam/paper/sendTest`,{params:{
            id: row.id
          }}).then(res=>{
          if (res!=0){
            this.$message.success("设置成功！！！")
            this.getpaperList();
          }

        }),err=>{
          this.$message.error(err)
        }
      }
    },

    cancelTest(row){
      if(row.type==1){
        this.axios.get(`exam/paper/cancelTest`,{params:{
            id: row.id
          }}).then(res=>{
          if (res!=0){
            this.$message.success("取消成功！！！")
            this.getpaperList();
          }

        }),err=>{
          this.$message.error(err)
        }

      }else {
        this.$message.error("未发布考试！！！")
      }

    },

    deletePaper(row){
      if(row.type==1){
        this.$message.error("已经发布考试！！！")
      }else{
        this.axios.get(`exam/paper/delete`,{params:{
            id: row.id
          }}).then(res=>{
          if (res!=0){
            this.$message.success("删除成功！！！")
            this.getpaperList();
          }

        }),err=>{
          this.$message.error(err)
        }
      }
      }


  },
  mounted() {
    this.getpaperList()
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
.function_select{
  width: 140px !important;
}
.demo-drawer__footer{
  display: flex;
  justify-content: center;
}
.demo-drawer__footer .el-button{
  width: 45%;
}
.el-button{
  border-radius: 0px !important;
}
</style>
