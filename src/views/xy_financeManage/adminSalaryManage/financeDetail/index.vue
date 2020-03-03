<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-tag type="success">管理员ID{{ listQuery.id }}</el-tag>
      <!-- <el-input
        v-model="userName"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getM"
      /> -->
      <!-- 搜索按钮 -->
      <!-- <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getM"
        >搜索</el-button
      >
      <el-select
        @change="findByGrade(selectGrade)"
        v-model="selectGrade"
        placeholder="用户角色"
      >
        <el-option key="" label="全部角色" value=""> </el-option>
        <el-option
          v-for="item in adminSelectGrade"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select> -->

      <!--    <el-select
        v-if="adminRoles == '000' ? true : false"
        @change="findBySchool(selectSchool)"
        v-model="selectSchool"
        placeholder="用户学校"
      >
        <el-option
          v-for="item in shcools"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
<span class="demonstration">时间段筛选:</span>
      <el-date-picker
        @change="changeTime(timeRange)"
        v-model="timeRange"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker> -->
    </div>

    <!-- 以下是表格内容      v-if="dataFlag"-->
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
      <!-- <el-table-column label="管理员ID" prop="id" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <!-- 一列的结束 -->
      <el-table-column label="审核主题ID" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.topicId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核结果" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.auditDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核原因" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.reason }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 下面是修改操作的东西 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pn"
      :limit.sync="listQuery.ps"
      @pagination="findAuditDetail(listQuery)"
    />
  </div>
</template>

<script>
import { getAdminDetailParam } from "@/utils/pageMsg";
import { findAdminAuditDetail } from "@/api/xy_financeManage";
import { alertMsg } from "@/api/utils/remind";
// import { getSchoolId } from "@/utils/auth";
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
  name: "financeDetail",
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
      adminId: "", //管理员ID
      id: "",
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
      listLoading: false,
      listQuery: {
        pn: 1, //第几页
        ps: 10, //每页大小
        id: ""
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          {
            required: true,
            message: "type is required",
            trigger: "change"
          }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          {
            required: true,
            message: "title is required",
            trigger: "blur"
          }
        ]
      },
      downloadLoading: false
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    //加载列表数据
    this.init();
  },
  methods: {
    //   初始化方法
    init() {
      /**
       * 把adminID写入cookie的原因是 方式detail页面刷新后获取不到adminID 就展示了全部信息
       */
      let param = getAdminDetailParam();
      this.listQuery.id = param.id;
      let condition = {
        pn: 1,
        ps: 10,
        id: param.id,
        startTime: param.startTime,
        endTime: param.endTime
      };
      this.findAuditDetail(condition);
    },
    //根据id 查找管理员审核数据
    findAuditDetail(condition) {
      if (condition.id == null || condition.id == "") {
      }
      let _this = this;
      this.listLoading = true;
      findAdminAuditDetail(condition).then(res => {
        let temp = res.queryResult.list;
        temp.map(e => {
          if (e.result == "1" || e.result == 1) {
            e.result = "通过";
          } else {
            e.result = "未通过";
          }
        });
        _this.list = temp;
        _this.total = res.queryResult.total;
        _this.listLoading = false;
      });
    },
    /**
     * 下面的方法不知道有什么用 但是就是不能动
     */
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    }
  }
};
</script>
