<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="query"
        placeholder="名字搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getM"
      />
      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getM">名字搜索</el-button>
      <!-- 添加按钮 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateRole"
      >添加</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-delete"
        @click="deleteListComfirm"
      >删除</el-button>
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
      <!-- 一列的开始 -->
      <el-checkbox-group v-model="checked" :label="checked">
        <!-- 一列的开始 -->
        <!-- 排序 -->
        <el-table-column label prop="id" align="center" width="80">
          <template slot-scope="{ row }">
            <el-checkbox key="{{row.id}}" @change="handleCheckedCitiesChange(row.id,$event)"></el-checkbox>
            <!-- <span>{{ row.id }}</span> -->
          </template>
        </el-table-column>
      </el-checkbox-group>
      <!-- 一列的结束 -->

      <el-table-column label="名字" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="父ID" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.pId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父名字" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.pName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="拥有权限" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.menuIds }}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        label="操作"
        align="center"
        width="200px"
        class-name="small-padding fixed-width"
      >
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="handleUpdate(row)">编辑信息</el-button>
          <!-- <el-button type= "danger" size="small" @click="handleDelete(row, 'draft')">删除</el-button>
          <el-button type="primary" size="small" @click="handleUpdatePer(row)">编辑权限</el-button>-->
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
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- 第一个字段 -->
        <el-form-item label="菜单名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- 第二个字段 -->
        <el-form-item label="父Id" prop="pId" >
          <el-input v-model.number="temp.pId" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="temp.permission" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.orderNo" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择类型">
            <el-option label="目录" value="0"></el-option>
            <el-option label="菜单" value="1"></el-option>
            <el-option label="微信端页面" value="2"></el-option>
            <el-option label="微信端功能" value="3"></el-option>
            <el-option label="微信端接口" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>

      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findAll,
  createMenu,
  getMenu,
  deleteMenu,
  updateMenu
} from "@/api/menuManage";
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
      rules: {
        type: [
          {
            required: true,
            message: "请选择菜单类型",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur"
          },
           { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ], 
        pId: [
          {
            required: true,
            message: "请输入父Id",
            trigger: "blur"
          },
          {
            type:'number',
            required: true,
            message: "请输入数字",
            trigger: "blur"
          }
          // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],

      },
      // 这个list里面是复选框中已经选择的记录的id
      checked: [],
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
        pn: 1 //第几页
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        name: "",
        pId: "",
        url: "",
        permission: "",
        orderNo: "",
        type: "",
        remark: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑菜单信息",
        create: "添加菜单"
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
    this.findAll();
    //this.getRoutes();
  },
  methods: {
    /**
     * start
     */
    // 在这里写自己的方法

    async getMenu(id) {
      const name = await getMenu(id);
      // return ;
      return Promise.resolve(name.menu);
    },
    async findAll(data) {
      // const res2 = await findMenuTree();
      this.listLoading = true;
      const res = await findAll(this.listQuery);

      const item = res.page.list;
      this.list = [];
      // 遍历返回的list
      item.map(value => {
        const temp = value;
        if (temp.type == 0) {
          temp.type = "目录";
        } else if (temp.type == 1) {
          temp.type = "菜单";
        } else if (temp.type == 2) {
          temp.type = "微信端页面 ";
        } else if (temp.type == 3) {
          temp.type = "微信端功能 ";
        } else if (temp.type == 4) {
          temp.type = "微信端接口 ";
        }
        if (temp.status == true) {
          temp.status = "使用";
        } else {
          temp.status = "未使用";
        }
        this.list.push(temp);
      });
      this.total = res.page.total;
      this.listLoading = false;
    },
    /**
     * end
     */
    // 根据ID查找Role
    getM() {
      if (this.query == null || this.query == "") {
        this.findAll();
      } else {
        this.find();
      }
    },
    async find() {
      // this.returnName="权限未知";
      // const res2 = await findMenuTree();

      const res = await getMenu(this.query);

      if (res.msg == "无此菜单") {
        this.$message({
          message: "无此信息",
          type: "error"
        });
      } else {
        this.listLoading = true;
        let item = res.menu;

        this.list = [];
        // 遍历返回的list
        // const ids = item.menuIds.trim().split(",");
        // item.menuIds = "";

        // for (let i = 0; i < ids.length; i++) {
        //   this.getMenu(ids[i]).then(name => {
        //     item.menuIds += " " + name;
        //   });
        // }

        this.list.push(item);
        this.total = item.length;
        this.listLoading = false;
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        pId: "",
        url: "",
        permission: "",
        orderNo: "",
        type: "",
        remark: ""
      };
    },
    handleCreateRole() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createMenu(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
            // this.list.unshift(this.temp);
            this.findAll();
          });
        }
      });
    },
    handleUpdate(row) {
      let menuId = Object.assign({}, row).id; // copy obj
      this.getMenu(menuId).then(name => {
        this.temp = name;
      });
      this.temp.type = Number(this.temp.type);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    async handleUpdatePer(row) {
      const res = await getRole(row.id);
      this.id = row.id;
      let list = [];

      if (res.role.menuIds != null) {
        list = res.role.menuIds.split(",");
      }
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(list);
      });
    },
    confirmRole() {
      let list = this.$refs.tree.getCheckedKeys();
      let sids = "";
      let i = 0;
      for (i = 0; i < list.length - 1; i++) {
        sids = sids + list[i] + ",";
      }
      sids += list[i];
      updateJurisdiction(sids, this.id);
      this.dialogVisible = false;
      this.$notify({
        title: "成功",
        message: "更新成功",
        type: "success",
        duration: 2000
      });
      this.findAll();
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          console.log(tempData);
          //tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMenu(tempData).then(() => {
            this.findAll(this.listQuery);
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
    // handleDelete(row) {
    //   deleteRole(row.id);
    //   this.$notify({
    //     title: "成功",
    //     message: "删除成功",
    //     type: "success",
    //     duration: 2000
    //   });
    //   const index = this.list.indexOf(row);
    //   this.list.splice(index, 1);
    // },
    // 删除批量用户确认框
  
    deleteListComfirm() {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMenu(this.checked.toString()).then(() => {
                  this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
           
                this.findAll(this.listQuery);
                 this.checked = [];
             
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
    }
  }
};
</script>
