<template>
  <div class="grade">
    <div class="lefttable">
      <!--学生成绩列表-->
      <el-table v-loading="loading"
                :data="problemList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                border style="width: 100%;flex: 1" >
        <el-table-column fixed prop="title" label="题目"></el-table-column>
        <el-table-column prop="type" label="题型">
          <template slot-scope="scope">
            {{scope.row.type==1 ? '单选题' : '多选题'}}
          </template>
        </el-table-column>
        <el-table-column prop="points" label="知识点"></el-table-column>
        <el-table-column prop="difficulty" label="难度系数"></el-table-column>
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
          :total="problemList.length">
        </el-pagination>
      </div>
    </div>
    <div class="righttable">
      <div ref="bingtu" class="bingtu"></div>
      <div ref="tiaoxingtu" class="tiaoxingtu"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Student",
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 12, // 每页的数据条数
      loading: true,
      problemList: [
        {
          name: "孙悟空",
          coursename: "高等数学",
          totalscore: 90,
          starttime: " 12:20:30"
        }, {
          name: "孙悟空",
          coursename: "高等数学",
          totalscore: 90,
          starttime: " 12:20:30"
        },
      ],
      bintu:{
        title: {
          text: '题目难度系数分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '易(0.0~0.20)' },
              { value: 735, name: '偏易(0.21~0.40)' },
              { value: 580, name: '适中(0.41~0.60)' },
              { value: 484, name: '偏难(0.61~0.80)' },
              { value: 300, name: '难(0.81~0.95)' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      tiaoxingtu: {
        title: {
          text: '学生成绩分布',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: ['不及格', '60~70', '71~80', '80~90', '90~100']
        },
        yAxis: {
          type: 'value'
        },
        barWidth:35,
        series: [
          {
            data: [
              {
                value: 15,
                itemStyle: {
                  color: '#0a50de',
                }
              },
              {
                value: 20,
                itemStyle: {
                  color: '#0a50de',
                }
              },
              {
                value: 40,
                itemStyle: {
                  color: '#0a50de',
                }
              },
              {
                value: 25,
                itemStyle: {
                  color: '#0a50de',
                }
              },
              {
                value: 15,
                itemStyle: {
                  color: '#0a50de',
                }
              },
            ],
            type: 'bar'
          }
        ]
      }

    }
  },
  methods: {
    bingClick(){
      this.$message.error("饼图")
    },

    getProLost(){
      let id = this.$route.query.id
      console.log(id)

      this.axios.get(`/exam/proplem/list`,{
        params:{
          id: id
        }
      }).then(res=>{
          this.problemList = res.data
        this.loading = false
      })
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },

    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.currentPage = val;
    },

  },
  mounted() {
    this.getProLost()
    let bingtu = this.$echarts.init(this.$refs.bingtu)
    bingtu.setOption(this.bintu)
    let tiaoxingtu = this.$echarts.init(this.$refs.tiaoxingtu)
    tiaoxingtu.setOption(this.tiaoxingtu)
  }
}
</script>

<style scoped>
.grade{
  display: flex;
  height: 100%;
}
.lefttable{
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
.righttable{
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 600px;
}
.bingtu{
  width: 600px;
  height: 500px;
}
.tiaoxingtu{
  width: 100%;
  flex: 1;
}
</style>
