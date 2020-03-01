1<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="topicId"
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
        @click="findAll(topicId)"
      >主题ID搜索</el-button>
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

      <el-table-column label="主题ID（名称）" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.topicId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.reason }}</span>
        </template>
      </el-table-column>

      <el-table-column label="审核人" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.adminId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.audit_date | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAuditInfo } from "@/api/xy_dynamic";
import { getSchoolId } from "@/utils/auth";
import { alertMsg, alertWarning } from "@/api/utils/remind";

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
      list: {}, //表格数据
      topicId: "", //输入的主题ID
      listLoading:false,//加载页面
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
      //提示
     this.$notify({
          title: '提示',
          message: '输入TopicId进行查询',
        });

  },
  methods: {
    async findAll(topicId) {
        //没有输入topicId的话
      if (topicId == null || topicId == "") {
           
        alertWarning("警告", "请输入主题ID", this);
      } else {
       this.listLoading = true;
        const res = await getAuditInfo(topicId);
        const item = res.queryResult.list;
        this.list = [];
        // 遍历返回的list
        item.map(value => {
          const temp = value;
          if (temp.result == "1") {
            temp.result = "通过";
          } else if (temp.result == "0") {
            temp.result = "不通过";
          }
          this.list.push(temp);  //插入到list中
        });
        this.listLoading = false;
      }
    },
  }
};
</script>
