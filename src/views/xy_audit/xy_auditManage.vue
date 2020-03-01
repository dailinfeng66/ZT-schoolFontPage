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

      <!-- 开始时间和结束时间 -->
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
    <!-- 选择学校 -->
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
 
      <el-table-column label="发布时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.createDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="handleAudit(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页的配置 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pn"
      :limit.sync="listQuery.ps"
      @pagination="findAll(listQuery)"
    />

    <!-- 审核的弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        label-position="left"
        label-width="70px"
        style="width: 300px; margin-left:50px;"
      >
   
       <el-form-item label="内容:">
           <textarea style="width:500px;height:300px" v-model="detail.topicContent" readonly></textarea>
        </el-form-item>
         <el-form-item label="图片">  
      <div>
        <img style="width:100px;height:100px" :src="detail.pics[0]" alt />
        <img style="width:100px;height:100px" :src="detail.pics[1]" alt />
        <img style="width:100px;height:100px" :src="detail.pics[2]" alt />
      </div>
         </el-form-item>
       <el-form-item label="原因">
          <el-input  v-model="audit.reason" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="auditPass()" type="primary">审核通过</el-button>
        <el-button @click="auditNotPass()" type="danger">审核不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryDynamic,
  deleteDynamic,
  auditNotPass,
  auditPass
} from "@/api/xy_dynamic";
import { getSchoolId } from "@/utils/auth";
import { alertMsg,alertWarning } from "@/api/utils/remind";

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
      //详情的集合
      detail: {
        topicContent: "",
        pics: []
      },
      //审核传入的学校，主题Id  和原因
      audit: {
        topicId: "",
        reason: ""
      },
      //角色名
      adminRoles: "",
      dialogVisible: false,
      // 这个里面就是 存的数据
      list: null,
      // 这个是数据的总长度-->多少条
      total: 0,
      listLoading: true,
      //查询条件
      listQuery: {
        ps: 10, //每页大小
        pn: 1, //第几页
        userId: "",
        type: "",
        topicId: "",
        topicContent: "",
        status: "1",
        schoolId: getSchoolId(),
        startCreateDate: "",
        endCreateDate: ""
      },
      //详情页面
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        detail: "信息详情"
      },
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
    //获取角色名
    this.adminRoles = sessionStorage.getItem("roles");
    // this.getRoutes();
  },
  methods: {
    //获取表格序号
    getIndex($index) {
      //表格序号
      return (this.listQuery.pn - 1) * this.listQuery.ps + $index + 1;
    },
    //查询所有，带条件
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
        this.list.push(temp);
      });
      //this.listQuery.ps = res.page.ps;
      this.total = res.queryResult.total;
      this.listLoading = false;
    },
    //审核
    handleAudit(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.detail.pics = row.topicPics.split(",");
      this.audit.topicId = row.topicId;
      console.log(this.detail.pics);
      console.log(this.temp);
      this.dialogStatus = "detail";
      this.detail.topicContent = row.topicContent;
      this.dialogFormVisible = true;
    },
    //审核通过
    async auditPass() {
      if (this.audit.reason == null || this.audit.reason == "") {
         alertWarning("警告","请填写原因",this);
      }else{
           const res = await auditPass(this.audit);
           alertMsg(res,"",this)
          this.findAll(this.listQuery);
          this.dialogFormVisible = false;
      }

    },
    //审核不通过
    async auditNotPass() {
      if (this.audit.reason == null || this.audit.reason == "") {
         alertWarning("警告","请填写原因",this);
      }else{
          const res = await  auditNotPass(this.audit);
          alertMsg(res,"",this)
          this.findAll(this.listQuery);
          this.dialogFormVisible = false;
      }
    }
  }
};
</script>
