<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="listQuery.ID"
        placeholder="ID"
        style="width: 200px;"
        class="filter-item"
      />
      <!-- 搜索按钮 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="findByUserId"
        >搜索</el-button
      >
      <!-- 添加按钮 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >添加</el-button
      >
      <!-- 导出按钮 -->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="deleteListComfirm"
        >删除</el-button
      >
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
      @sort-change="sortChange"
    >
      <el-checkbox-group v-model="checked" :label="checked">
        <!-- 一列的开始 -->
        <!-- 排序 -->
        <el-table-column
          label
          prop="id"
          align="center"
          width="80"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{ row }">
            <el-checkbox
              key="{{row.id}}"
              @change="handleCheckedCitiesChange(row.id, $event)"
            ></el-checkbox>
            <!-- <span>{{ row.id }}</span> -->
          </template>
        </el-table-column>
      </el-checkbox-group>
      <!-- 一列的结束 -->

      <el-table-column label="姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="账号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column label="密码" v-if="false" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像 ">
        <template slot-scope="{ row }">
          <span>{{ row.profileUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱 ">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="QQ" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.qq }}</span>
        </template>
      </el-table-column>
      <!-- 需要添加字段的话可以直接加 -->

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"
            >编辑</el-button
          >
          <!-- <el-button size="mini" type="success" @click="handleModifyStatus(row, 'published')">发布</el-button> -->
          <!-- <el-button size="mini" type="danger" @click="deleteUserConfirm(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 下面是修改操作的东西 -->
    <!-- 这个是分页的东西 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
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
        <el-form-item label="姓名">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- 第二个字段 -->
        <el-form-item label="账号">
          <el-input
            v-model="temp.account"
            :disabled="dialogStatus == 'update'"
          />
        </el-form-item>
        <!-- 第三个字段 -->
        <el-form-item label="密码">
          <el-input v-model="temp.password" />
        </el-form-item>
        <!-- 第四个字段 -->
        <el-form-item label="性别">
          <el-col :span="12">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ temp.gender }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="男">男</el-dropdown-item>
                <el-dropdown-item command="女">女</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-form-item>
        <!-- 第五个字段 -->
        <el-form-item label="头像">
          <el-upload
            class="upload-demo"
            action
            :file-list="fileList"
            :auto-upload="true"
            :http-request="uploadSectionFile"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <!-- 第六个字段 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <!-- 第七个字段 -->
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="temp.qq" />
        </el-form-item>
        <!-- 需要添加字段的话可以直接加 -->
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
  getusers,
  findByUserId,
  deleteUsers,
  createUser,
  updateUser
} from "@/api/systemManage";
import { imgupload } from "@/api/fileupload";
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
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      var regEmail = /(^$)|(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$)/;
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号的规则
    var checkPhone = (rule, value, cb) => {
      //验证手机号的正则表达式
      var regPhone = /(^$)|(^[1]([3-9])[0-9]{9}$)/;
      if (regPhone.test(value)) {
        //合法的手机号
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    //验证qq号的规则
    var checkQq = (rule, value, cb) => {
      //验证qq号的正则表达式
      var regQq = /(^$)|([1-9][0-9]{4,10})/;
      if (regQq.test(value)) {
        //合法的qq号
        return cb();
      }
      cb(new Error("请输入合法的qq号"));
    };
    return {
      // 上传图片用的
      fileList: [],
      // 这一段是复选框的
      // 这个list里面是复选框中已经选择的记录的id
      checked: [],
      // 这一段是复选框的
      tableKey: 0,
      // 这个里面就是 存的数据
      list: null,
      // 这个是数据的总长度-->多少条
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        ID: undefined,
        type: undefined,
        sort: "+id"
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
        name: "",
        account: "",
        password: "",
        gender: "男",
        profile: null,
        email: "",
        phone: "",
        qq: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
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
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        qq: [{ validator: checkQq, trigger: "blur" }]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getusers();
  },
  methods: {
    // 文件上传处理的方法
    uploadSectionFile(param) {
      const res = imgupload(param);
      console.log("文件上传的返回");
      console.log(res);
    },
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
    async getusers() {
      this.listLoading = true;

      const res = await getusers();
      const item = res.page.list;
      this.list = [];
      // 遍历返回的list
      item.map(value => {
        const temp = value;
        if (value.gender === 1) {
          temp.gender = "男";
        } else {
          temp.gender = "女";
        }
        this.list.push(temp);
      });
      this.total = item.length;
      this.listLoading = false;
    },
    /**
     * end
     */
    // 根据ID查找User
    async findByUserId() {
      this.listLoading = true;
      const res = await findByUserId({ userId: this.listQuery.ID });
      if (res.msg == "该用户不存在") {
        this.$message({
          message: "该用户不存在",
          type: "warning"
        });
        this.getusers();
      } else if (res.msg == "用户id不能为空") {
        this.$message({
          message: "用户id不能为空",
          type: "warning"
        });
      } else {
        const item = res.user;
        if (item.gender == 1) {
          item.gender = "男";
        } else {
          item.gender = "女";
        }
        this.list = [];
        // 遍历返回的list
        this.list.push(item);
        this.total = item.length;
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
        this.$message({
          message: "删除成功",
          type: "success"
        });
        console.log(this.checked);
      } else {
        this.$message({
          message: "删除失败",
          type: "error"
        });
      }
    },
    // 删除批量用户确认框
    deleteListComfirm() {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
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
    // 删除单个用户确认框
    deleteUserConfirm(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteUsers(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      console.log(row.id);
    },
    // 点击编辑按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
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
        account: "",
        password: "",
        gender: "男",
        profile: null,
        email: "",
        phone: "",
        qq: ""
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
          const tempData = this.temp;
          if (tempData.gender == "男") {
            tempData.gender = 1;
          } else {
            tempData.gender = 0;
          }
          JSON.stringify(tempData);
          createUser(tempData).then(res => {
            this.dialogFormVisible = false;
            if (res.msg == "success") {
              this.$notify({
                title: "成功",
                message: res.msg,
                type: "添加成功",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.msg,
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },

    updateData() {
      this.dialogFormVisible = false;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = this.temp;
          if (tempData.gender == "男") {
            tempData.gender = 1;
          } else {
            tempData.gender = 2;
          }
          JSON.stringify(tempData);
          updateUser(tempData).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.getusers();
              this.$notify({
                title: "修改成功",
                // message: res.msg,
                type: "修改成功",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "修改失败",
                // message: res.msg,
                type: "修改失败",
                duration: 2000
              });
            }
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
