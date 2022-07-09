<template>
  <div style="display: flex;flex-direction: column;height: 100%">
    <!--表格上功能区-->
    <div class="function">
      <div><el-button
          type="primary"
          @click="excelDialogVisible = true"
          class="function_addbtn">Excel导入
      </el-button></div>
      <div><el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addbtn"
          class="function_addbtn">增加
      </el-button></div>
      <div>
        <el-input placeholder="请输入内容" v-model="searchInput" style="width: 600px">
          <el-select v-model="select" clearable  slot="prepend" placeholder="请选择题型">
            <el-option label="单选题" value="1"></el-option>
            <el-option label="多选题" value="2"></el-option>
            <el-option label="判断题" value="3"></el-option>
            <el-option label="填空题" value="4"></el-option>
            <el-option label="简答题" value="5"></el-option>
          </el-select>
          <el-button slot="append" type="primary" icon="el-icon-search"  @click="this.getproplemList" style="background: #456FFF;color: white"></el-button>
        </el-input>
      </div>
    </div>

    <!--表格-->
    <el-table
      border
      v-loading="loading"
      :data="proplemList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%;"
      :max-height="tableheight">
      <el-table-column fixed prop="title" label="题目" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="type" label="题型">
        <template slot-scope="scope">
        {{scope.row.type|typeTrans}}
      </template></el-table-column>
      <el-table-column prop="difficulty" label="难度系数"></el-table-column>
      <el-table-column prop="selecta" label="选项A"></el-table-column>
      <el-table-column prop="selectb" label="选项B"></el-table-column>
      <el-table-column prop="selectc" label="选项C"></el-table-column>
      <el-table-column prop="selectd" label="选项D"></el-table-column>
      <el-table-column prop="score" label="分数"></el-table-column>
      <el-table-column prop="answer" label="答案" show-overflow-tooltip></el-table-column>
      <el-table-column prop="anlysis" label="解析" show-overflow-tooltip></el-table-column>
      <el-table-column prop="courseno" label="所属课程编码"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180"><template slot-scope="scope">
        <el-button @click="detail(scope.row)"  type="text" size="small">查看知识点</el-button>
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
        :total="proplemList.length">
      </el-pagination>
    </div>

    <!--新增修改模态框-->
    <el-dialog :title="title" :visible.sync="addEditVisable">
      <el-form :model="form">
        <el-form-item label="题型"  :label-width="formLabelWidth" v-if="title=='修改题目信息' ? false : true">
          <el-select  v-model="form.type" placeholder="请选择">
            <el-option label="单选题" value="1"></el-option>
            <el-option label="多选题" value="2"></el-option>
            <el-option label="判断题" value="3"></el-option>
            <el-option label="填空题" value="4"></el-option>
            <el-option label="简答题" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目"  :label-width="formLabelWidth">
          <el-input v-model="form.title" :value="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识点"  :label-width="formLabelWidth">
          <el-row>
            <el-col :span="18">
              <el-select  v-model="points" multiple clearable :multiple-limit="limit" placeholder="请选择知识点(最多五个)" class="points">
                <el-option v-for="(item,index) in pointList" :key="index" :label="item.point" :value="item.pointid"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select :data="courseList" v-model="form.courseno" placeholder="请先选择课程" class="courseList" @change="getPoints">
                <el-option v-for="(item,index) in courseList" :key="index" :label="item.coursename" :value="item.courseno"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="难度系数"  :label-width="formLabelWidth">
          <el-input v-model="form.difficulty" :value="form.difficulty" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分数"  :label-width="formLabelWidth">
          <el-input v-model="form.score" :value="form.score" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项A" v-if="form.type == 1 || form.type == 2 "  :label-width="formLabelWidth">
          <el-input v-model="form.selecta" :value="form.selecta" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项B" v-if="form.type == 1 || form.type == 2 "  :label-width="formLabelWidth">
          <el-input v-model="form.selectb" :value="form.selectb" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项C" v-if="form.type == 1 || form.type == 2 "  :label-width="formLabelWidth">
          <el-input v-model="form.selectc" :value="form.selectc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选项D" v-if="form.type == 1 || form.type == 2 "  :label-width="formLabelWidth">
          <el-input v-model="form.selectd" :value="form.selectd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-input v-model="form.answer" :value="form.answer" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="分析"  :label-width="formLabelWidth">
          <el-input v-model="form.anlysis" :value="form.anlysis" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEditVisable = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <!--Excel导入-->
    <el-dialog
      title="Excel导入题目"
      :visible.sync="excelDialogVisible"

      width="30%"
      center>
      <el-upload
        drag
        ref="upload"
        accept=".xlsx,.xls"
        action="exam/fileUpload/excel"
        :auto-upload="false"
        :on-success="uploadSuccess"
        :on-progress="progress"
        :on-error="uploadError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx/xls文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="excelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Question",
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 12, // 每页的数据条数
      tableheight:'',
      excelDialogVisible: false,
      size:'19%',
      drawer: false,
      direction: 'rtl',
      title: "",
      loading: true,
      addEditVisable: false,
      proplemList:[],
      form: {
        id:"",
        type: "",
        difficulty: "",
        points: "",
        title:"",
        score:"",
        selecta:"",
        selectb:"",
        selectc:"",
        selectd:"",
        answer:"",
        anlysis:"",
        courseno: ''
      },
      select: '',
      searchInput: '',
      formLabelWidth: '120px',
      limit: 5,
      points:[],
      pointList:[],
      courseList:[],
      courseno:''
    }
  },
  methods: {

    search(){
      this.getproplemList();
    },

    addbtn(){
      this.form = {}
      this.title = "新增题目"
      this.axios.get(`/exam/course/selectAll`).then((response) => {
        this.courseList = response.data
        this.loading = false
      })
      this.addEditVisable = true
    },

    edit(row) {
      this.title = "修改题目信息"
      this.axios.get(`/exam/course/selectAll`).then((response) => {
        this.courseList = response.data
        this.loading = false
      })
      this.form = row; //updateClassInfo
      this.addEditVisable = true
    },

    detail(row){
      console.log(row)
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

    getproplemList(){
      this.loading = true
      this.axios.get(`/exam/proplem/selectAll1`,{
        params:{
          select: this.select,
          searchInput: this.searchInput,
        }
      }).then((res) => {
        this.proplemList = res.data
        this.loading = false
      })
    },

    confirm(){//模态框确认按钮
      if (this.title=="新增题目"){
        this.form.points = JSON.stringify(this.points)
        this.axios.post(`/exam/proplem/insert`,this.form)
          .then(res=>{
            if(res != 0){
              this.$message({
                showClose: true,
                message: "新增成功!!!",
                type: 'success'
              });
              this.getproplemList()
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
      }else if(this.title=="修改题目信息"){
        console.log(this.form)
        this.axios.post(`/exam/proplem/update`,this.form)
          .then(res=>{
            if (res!=0){
              this.$message({
                showClose: true,
                message: "修改成功！！！",
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: "修改失败！",
                type: 'error'
              });
            }
            this.getproplemList()
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

    del(row) {
      this.axios.get('/exam/proplem/delete',{
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
            this.getproplemList()
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

    confirmImport(){
      this.excelDialogVisible = false
      this.$refs.upload.submit()
    },

    uploadSuccess(response, file, fileList){
      this.$message.success(response)
      this.getproplemList();
      this.loading = false
    },
    progress(){
      this.loading = true
    },
    uploadError(err, file, fileList){
      this.loading = false
      this.getproplemList()
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
    this.getproplemList()
    this.tableheight = window.innerHeight - 120 + 'px';
  },
  filters: {
    typeTrans: function(type) {
      switch (parseInt(type)) {
        case 1:
          return '单选题'
        case 2:
          return '多选题'
        case 3:
          return '判断题'
        case 5:
          return '填空题'
        case 6:
          return '简答题'
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
.el-drawer{
  width: 20% !important;
}
.points{
  width: 100% !important;
}
.courseList{
  width: 100% !important;
}

.el-button{
  border-radius: 0px !important;
}
</style>
