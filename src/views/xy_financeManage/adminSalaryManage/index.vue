<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="userName"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getM"
      />
      <!-- 搜索按钮 -->
      <el-button
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
      </el-select>

      <el-select
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
      </el-date-picker>
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
      <el-table-column label="用户名" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容详情" width="200" align="center">
            <template slot-scope="{ row }">
                <span>{{ row.goodsContent }}</span>
            </template>
        </el-table-column> -->
      <el-table-column label="角色" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.gradeRole }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校名" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.schoolId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核数量" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.judgeNums }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300px"
        class-name="small-padding fixed-width"
      >
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="convertToDetail(row)"
            >查看详情</el-button
          >
          <!-- <el-button type="success">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 下面是修改操作的东西 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pn"
      :limit.sync="listQuery.ps"
      @pagination="getFinanceMsg(listQuery)"
    />

    <!-- 更改管理员 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- 第一个字段 -->
        <el-form-item label="用户ID ">
          <el-input disabled v-model="temp.id" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input disabled v-model="temp.loginName" />
        </el-form-item>
        <el-form-item label="用户角色 ">
          <el-select v-model="adminGrade" placeholder="请选择">
            <el-option
              v-for="item in adminSelectGrade"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户学校"
          v-if="adminRoles == '000' ? true : false"
        >
          <el-select v-model="adminSchool" placeholder="请选择">
            <el-option
              v-for="item in shcools"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="用户密码">
          <el-input show-password v-model="temp.loginPassword" />
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSchoolNameById,
  getSchoolIdByName,
  getGrades
} from "@/api/xy_admin";
import { findAllFinanceJudgeMsg } from "@/api/xy_financeManage";
import { alertMsg } from "@/api/utils/remind";
import { getSchoolId } from "@/utils/auth";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { setAdminDetailParam } from "@/utils/pageMsg";
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
  name: "adminManage",
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
      resetPassTemp: {
        id: "",
        loginName: "",
        loginPassword: ""
      }, //重置密码中间变量
      resetPassDialog: false, //重置密码弹窗
      userName: "", //用户名
      selectGrade: "", //用户角色
      selectSchool: "", //用户学校
      confirmPass: "", //确认密码
      //时间段选择   -> 快捷选项的配置
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      adminSchool: "", //学校选中
      shcools: [
        {
          value: "00000",
          label: "全部学校"
        },
        {
          value: "00001",
          label: "成都信息工程大学"
        },
        {
          value: "00002",
          label: "西南民族大学"
        }
      ], //学校 ->code 和名字
      adminGrade: "", //角色选中
      adminRoles: "null",
      adminSelectGrade: null, //角色列表
      timeRange: null, //时间段的选择数据
      dataFlag: false, //加载数据的flag
      createAdminTemp: {
        loginName: "",
        loginPassword: "",
        grade: "",
        schoolId: ""
      }, //添加用户的表单的中间变量
      createAdminVisible: false, //是否显示添加用户的表单
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
        ps: 10 //每页大小
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
    this.getFinanceMsg(this.listQuery);
    // 加载角色信息
    this.getAllGrades();
    //获取管理员角色
    this.adminRoles = sessionStorage.getItem("roles");
  },
  methods: {
    // 跳转到详情页面
    convertToDetail(row) {
      let date1 = null;
      let date2 = null;
      if (this.timeRange != null) {
        date1 = new Date(this.timeRange[0]);
        date2 = new Date(this.timeRange[1]);
      }
      let param = {
        id: row.id,
        startTime: date1,
        endTime: date2
      };
      setAdminDetailParam(param);
      this.$router.push({
        name: "financeDetail"
      });
    },
    //获取列表数据
    async getFinanceMsg(condition) {
      // alert("查询数据");
      this.listLoading = true;
      // const res = await
      let _this = this;
      findAllFinanceJudgeMsg(condition).then(res => {
        let resList = res.queryResult.list;
        resList.map(item => {
          // 转化学校
          item.schoolId = getSchoolNameById(item.schoolId); //把ID转化为名字
          //转化状态
          if (item.state == "1") {
            item.state = "正常";
          }
          if (item.state == "0") {
            item.state = "禁用";
          }
        });
        _this.list = resList;
        _this.total = res.queryResult.total;
        _this.listLoading = false;
      });
    },
    // 加载角色信息
    async getAllGrades() {
      const res = await getGrades();
      this.adminSelectGrade = [];
      let result = [];
      res.queryResult.list.map(item => {
        let temp = {
          value: item.grade,
          label: item.role
        };
        this.adminSelectGrade.push(temp);
      });
    },
    //根据角色选择
    findByGrade(val) {
      let date1 = new Date(this.timeRange[0]);
      let date2 = new Date(this.timeRange[1]);
      let temp = this.selectSchool;
      if (temp == "00000") {
        //点全部学校的时候应该是显示所有的学校而不是  "全部学校"
        temp = "";
      }
      let condition = {
        grade: val,
        schoolId: temp,
        endTime: date2,
        startTime: date1,
        pn: 1,
        ps: 10
      };
      this.getFinanceMsg(condition);
    },
    //根据学校筛选
    findBySchool(val) {
      let date1 = new Date(this.timeRange[0]);
      let date2 = new Date(this.timeRange[1]);
      let temp = val;
      if (val == "00000") {
        temp = "";
      }
      let conditions = {
        grade: this.selectGrade,
        pn: 1,
        ps: 10,
        endTime: date2,
        startTime: date1,
        schoolId: temp
      };
      this.getFinanceMsg(conditions);
    },
    // 根据时间筛选
    changeTime(val) {
      let temp = this.selectSchool;
      if (temp == "00000") {
        //点全部学校的时候应该是显示所有的学校而不是  "全部学校"
        temp = "";
      }
      let date1 = new Date(val[0]);
      let date2 = new Date(val[1]);
      let conditions = {
        pn: 1,
        ps: 10,
        endTime: date2,
        startTime: date1,
        grade: this.selectGrade,
        schoolId: temp
      };
      this.getFinanceMsg(conditions);
    },
    // 根据用户名搜索用户
    getM() {
      let queryCondition = {
        pn: 1,
        ps: 10,
        loginName: this.userName
      };
      this.getFinanceMsg(queryCondition);
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
