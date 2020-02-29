<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="listQuery.topicId"
        placeholder="主题ID搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getRole"
      />
      <!-- 搜索按钮 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="findAll(listQuery)"
      >主题ID搜索</el-button>

      <el-date-picker
        class="filter-item"
        type="datetime"
        placeholder="选择开始时间"
        v-model="listQuery.startCreateDate"
        style="width: 13%;"
        @change="findAll(listQuery)"
      ></el-date-picker>
      <label class="filter-item">----</label>
      <el-date-picker
        class="filter-item"
        type="datetime"
        placeholder="选择结束时间"
        v-model="listQuery.endCreateDate"
        style="width: 13 %;"
        @change="findAll(listQuery)"
      ></el-date-picker>

      <el-select
        class="filter-item"
        v-if="adminRoles == '000' ? true : false"
        @change="findAll(listQuery)"
        v-model="listQuery.schoolId"
        placeholder="学校"
      >
        <el-option label="所有学校" value="00000"></el-option>
        <el-option label="成都信息工程大学" value="00001"></el-option>
        <el-option label="西南民族大学" value="00002"></el-option>
      </el-select>

      <el-select
        class="filter-item"
        @change="findAll(listQuery)"
        v-model="listQuery.status"
        placeholder="状态"
      >
        <el-option label value></el-option>
        <el-option label="待审核" value="1"></el-option>
        <el-option label="审核不通过" value="0"></el-option>
        <el-option label="审核通过" value="2"></el-option>
      </el-select>
      <el-select
        class="filter-item"
        @change="findAll(listQuery)"
        v-model="listQuery.type"
        placeholder="类型"
      >
        <el-option label value></el-option>
        <el-option label="二手平台" value="00001"></el-option>
        <el-option label="有偿求助" value="00002"></el-option>
        <el-option label="失物招领" value="00003"></el-option>
      </el-select>
      <!-- <el-input v-model="listQuery.mgrQueryLostRequest.schoolId" placeholder="学校名（ID）" style="width: 200px;" class="filter-item" @change ="findAll(listQuery)"/> -->
    </div>
    <!-- 以下是表格内容 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 一列的开始 -->
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="160"
        :class-name="getSortClass('id')"
        v-if="false"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 一列的结束 -->
      <el-table-column label="序号" prop width="180" align="center">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"></span>
        </template>
      </el-table-column>

      <el-table-column label="主题ID（名称）" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.topicId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.topicContent }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="发布时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.createDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="图片(待定)" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.topicPics }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="handleDetail(row)">查看详情</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row, 'draft')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 下面是修改操作的东西 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pn"
      :limit.sync="listQuery.ps"
      @pagination="findAll(listQuery)"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        label-position="left"
        label-width="70px"
        style="width: 300px; margin-left:50px;"
      ></el-form>

        内容：{{detail.topicContent}}
        图片：
        <div>
           <img :src="detail.pics[0]" alt="">
           <img :src="detail.pics[1]" alt="">
           <img :src="detail.pics[2]" alt="">
        </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDynamic, deleteDynamic } from "@/api/xy_dynamic";
import { getSchoolId } from "@/utils/auth";
import { alertMsg } from "@/api/utils/remind";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  {
    key: "CN",
    display_name: "China"
  }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      detail:{
        topicContent:"",
        pics:[],
      },
      adminRoles: "",
      show: "true",
      id: "",
      query: "",
      routes: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableKey: 0,
      // 这个里面就是 存的数据
      list: null,
      // 这个是数据的总长度-->多少条
      total: 0,
      listLoading: true,
      listQuery: {
        ps: 10, //每页大小
        pn: 1, //第几页
        userId: "",
        type: "",
        topicId: "",
        topicContent: "",
        status: "",
        schoolId: getSchoolId(),
        startCreateDate: "",
        endCreateDate: ""
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        name: "",
        description: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        detail: "信息详情"
      },
      dialogPvVisible: false,
      pvData: [],

      downloadLoading: false
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    // 传的参数就是 第几个页面 1就是 第一页 开始的时候
    this.findAll(this.listQuery);
    this.adminRoles = sessionStorage.getItem("roles");
    // this.getRoutes();
  },
  methods: {
    //获取表格序号
    getIndex($index) {
      //表格序号
      return (this.listQuery.pn - 1) * this.listQuery.ps + $index + 1;
    },
    async findAll(data) {
      this.listLoading = true;
      const res = await queryDynamic(data);
      const item = res.queryResult.list;
      this.list = [];
      // 遍历返回的list
      item.map(value => {
        const temp = value;
        if (temp.type == "00001") {
          temp.type = "二手平台";
        } else if (temp.type == "00002") {
          temp.type = "有偿求助";
        } else if (temp.type == "00003") {
          temp.type = "失物招领";
        }
        if (temp.status == "0") {
          temp.status = "审核不通过";
        } else if (temp.status == "1") {
          temp.status = "待审核";
        } else if (temp.status == "2") {
          temp.status = "审核通过";
        }
        this.list.push(temp);
      });
      //this.listQuery.ps = res.page.ps;
      this.total = res.queryResult.total;
      this.listLoading = false;
    },

    handleDetail(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.detail.pics = row.topicPics.split(",");
      console.log( this.detail.pics);
      console.log(this.temp);
      this.dialogStatus = "detail";
      this.detail.topicContent = row.topicContent;
      this.dialogFormVisible = true;
      
    },
    // updateData() {
    //   this.$refs["dataForm"].validate(valid => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp);
    //       updateRole(tempData).then(() => {
    //         for (const v of this.list) {
    //           if (v.id === this.temp.id) {
    //             const index = this.list.indexOf(v);
    //             this.list.splice(index, 1, this.temp);
    //             break;
    //           }
    //         }
    //         this.dialogFormVisible = false;
    //         this.$notify({
    //           title: "成功",
    //           message: "更新成功",
    //           type: "success",
    //           duration: 2000
    //         });
    //       });
    //     }
    //   });
    // },
    async handleDelete(row) {
      let topicIds = new Array();
      topicIds[0] = row.topicId;
      //  const res =  deleteDynamic(topicIds).then(() => {
      //    console.log(res+"11111111");
      //     alertMsg(res,"删除",this)
      //     this.findAll(this.listQuery);
      //   });
      const res = await deleteDynamic(topicIds);
        this.findAll(this.listQuery);
    }
  }
};
</script>
