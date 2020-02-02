<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input v-model="queryID" placeholder="ID" style="width: 200px;" class="filter-item" />
      <!-- 搜索按钮 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="findById"
      >搜索</el-button>
      <!-- 添加按钮 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <!-- 导出按钮 -->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="deleteListComfirm"
      >删除</el-button>
      <!-- 审核人 选择框 -->
      <!-- <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey = tableKey + 1"
      >审核人</el-checkbox>-->
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
      <el-checkbox-group v-model="checked" :label="checked">
        <!-- 一列的开始 -->
        <!-- 排序 -->
        <el-table-column
          label="ID"
          prop="id"
          align="center"
          width="80"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{ row }">
            <el-checkbox
              key="{{row.id}}"
              @change="handleCheckedCitiesChange(row.id,$event)"
            >{{ row.id}}</el-checkbox>
            <!-- <span>{{ row.id }}</span> -->
          </template>
        </el-table-column>
      </el-checkbox-group>
      <!-- 一列的结束 -->

      <el-table-column label="配置名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="配置类型" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column label="配置值" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否应用" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.isSelection }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否删除 ">
        <template slot-scope="{ row }">
          <span>{{ row.isDelete }}</span>
        </template>
      </el-table-column>
      <!-- 需要添加字段的话可以直接加 -->

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <!-- <el-button size="mini" type="success" @click="handleModifyStatus(row, 'published')">发布</el-button> -->
          <!-- <el-button size="mini" type="danger" @click="deleteUserConfirm(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 下面是修改操作的东西 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pn"
      :limit.sync="listQuery.ps"
      @pagination="getAll(listQuery)"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 490px; margin-left:50px;"
      >
        <!-- 下面这个是时间选择器  需要的时候直接把这个时间选择器替换 el-form-item 所包裹的内容 -->
        <!-- 
             <el-date-picker
            v-model="temp.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        -->
        <!-- 下面这个是下拉选择框  下拉选择框中的内容 要用的话参考 也是直接替换el-form-item 所包裹的内容 -->
        <!-- 

             <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        -->

        <!-- 第一个字段 -->
        <el-form-item label="系统配置名">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- 第二个字段 -->
        <el-form-item label="配置值">
          <el-input v-model="temp.value" />
        </el-form-item>
        <!-- 第三个字段 -->
        <el-form-item label="配置类型">
          <el-input v-model="temp.type" />
        </el-form-item>

        <!-- 需要添加字段的话可以直接加 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findAllConfig, addConfig, findconfig } from "@/api/configManage";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [{ key: "CN", display_name: "China" }];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
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
      // 这一段是复选框的
      // 这个list里面是复选框中已经选择的记录的id
      checked: [],
      // 这一段是复选框的
      tableKey: 0,
      // 这个里面就是 存的数据
      list: null,
      // 这个是数据的总长度-->多少条
      total: 0,
      // 查询的id
      queryID: "",
      listLoading: true,
      listQuery: {
        ps: 10, //每页大小
        pn: 1 //第几页
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: null,
        name: "",
        value: "",
        type: ""
      },
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
          { required: true, message: "type is required", trigger: "change" }
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
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getAll(this.listQuery);
  },
  methods: {
    /**
     * 复选框的方法
     */
    handleCheckedCitiesChange(id, e) {
      if (e) {
        this.checked.push(id);
      } else {
        // 删除复选框中指定元素
        this.checked = this.checked.filter(item => item !== id);
      }
    },
    /**
     * 复选框的方法
     */
    /**
     * start
     */
    // 在这里写自己的方法
    async getAll(data) {
      this.listLoading = true;
      const res = await findAllConfig(data);
      const item = res.page.list;
      this.list = [];
      // 遍历返回的list
      item.map(value => {
        const temp = value;
        if (value.isSelection == 1) {
          temp.isSelection = "应用";
        } else {
          temp.isSelection = "未应用";
        }
        if (value.isDelete == 1) {
          temp.isDelete = "未删除";
        } else {
          temp.isDelete = "删除";
        }
        this.list.push(temp);
      });
      this.total = res.page.total;
      // this.listQuery.ps = res.page.ps;
      this.listLoading = false;
    },
    /**
     * end
     */
    // 根据ID查找User
    async findById() {
      this.listLoading = true;
      const res = await findconfig(this.queryID);
      if (res.message == "暂无该系统配置信息") {
        this.$notify({
          title: "  ",
          message: "暂无该系统配置信息",
          type: "warning",
          duration: 2000
        });
        this.getAll(this.listQuery);
      } else if (res.msg == "success") {
        const item = res.systemConfig;
        if (item.isSelection == 1) {
          item.isSelection = "应用";
        } else {
          item.isSelection = "未应用";
        }
        if (item.isDelete == 1) {
          item.isDelete = "未删除";
        } else {
          item.isDelete = "删除";
        }
        this.list = [];
        // 遍历返回的list
        this.list.push(item);
        this.total = item.length;
      } else {
        this.getAll(this.listQuery);
      }
      this.listLoading = false;
    },

    // 删除用户的方法
    async deleteUsers(param) {
      const res = await deleteUsers({ userIds: param });
      if (res.msg == "success") {
        this.getusers();
        if (Array.isArray(param)) {
          //判断是删除批量用户还是单独一个用户
          // 批量用户的话就清空复选框
          this.checked = [];
        }
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
        console.log(this.checked);
      } else {
        this.$notify({
          title: "成功",
          message: "删除失败",
          type: "error",
          duration: 2000
        });
      }
      this.getAll(this.listQuery);
    },
    // 删除批量用户确认框
    deleteListComfirm() {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteUsers(this.checked.toString());
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 点击编辑按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 添加用户
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 重新给temp赋值
    resetTemp() {
      this.temp = {
        id: null,
        name: "",
        value: "",
        type: ""
      };
    },
    // 添加 或修改表单的性别选择下拉框
    handleCommand(command) {
      if (command == "男") {
        this.temp.gender = "男";
      } else {
        this.temp.gender = "女";
      }
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          JSON.stringify(this.temp);
          console.log(this.temp);

          addConfig(this.temp).then(res => {
            if (res.code == 200) {
              if (res.msg == "success") {
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
              } else {
                this.$notify({
                  title: "失败",
                  message: res.msg,
                  type: "warning",
                  duration: 2000
                });
              }
            }
            this.dialogFormVisible = false;
            this.getAll(this.listQuery);
            this.resetTemp();
          });
        }
      });
    },

    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
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
