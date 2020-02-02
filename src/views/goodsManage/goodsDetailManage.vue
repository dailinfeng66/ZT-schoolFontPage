<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="query"
        placeholder="ID"
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
      >搜索</el-button>
      <!-- 添加按钮 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateRole"
      >添加</el-button>
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
      <el-table-column
        label="商品详情id"
        prop="id"
        align="center"
        width=""
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 一列的结束 -->

      <el-table-column label="商品名称" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goodsId }}</span>
        </template>
      </el-table-column>

    
       <el-table-column label="社区id" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.communityId }}</span>
        </template>
      </el-table-column>
       <el-table-column label="现金价格 " width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.cashPrice }}</span>
        </template>
      </el-table-column>
       <el-table-column label="积分价格" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.integralPrive }}</span>
        </template>
      </el-table-column>
       <el-table-column label="库存" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.totalNum }}</span>
        </template>
      </el-table-column>
        <el-table-column label="销量" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.salesNum }}</span>
        </template>
      </el-table-column>
       <el-table-column label="上下架状态" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>


      <!-- <el-table-column label="拥有权限" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.menuIds }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="200px"
        class-name="small-padding fixed-width"
      >
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <!-- <el-button type="primary" size="small" @click="handleUpdate(row)">编辑信息</el-button>
          <el-button type= "danger" size="small" @click="handleDelete(row, 'draft')">删除</el-button>
          <el-button type="primary" size="small" @click="handleUpdatePer(row)">编辑权限</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 下面是修改操作的东西 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pn"
      :limit.sync="listQuery.ps"
      @pagination="findAll(this.listQuery)"
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
        <el-form-item label="商品id ">
          <el-input v-model="temp.goodsId" />
        </el-form-item>
        <!-- 第二个字段 -->
        <el-form-item label="社区id">
          <el-input v-model="temp.communityId" />
        </el-form-item>
          <el-form-item label="现金价格 ">
          <el-input v-model="temp.cashPrice" />
          </el-form-item>
         <el-form-item label="销量">
          <el-input v-model="temp.salesNum" />
        </el-form-item>
          <el-form-item label="上下架状态">
          <el-input v-model="temp.status" />
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
    findPage,
    insertGoodsDetail,

} from "@/api/goodsDetailManage";
import {
   findById,

} from "@/api/goodsManage";
import {
  getCommunity,
} from "@/api/communityInfoManage";
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
      id: "",
      query:"",
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
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        goodsId: "",
        communityId : "",
        cashPrice:"",
        integralPrive:"",
        totalNum:"",
        salesNum:"",
        status:"",
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
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    this.findAll();

  },
  methods: {
    /**
     * start
     */
    // 在这里写自己的方法



    async getGoodsName(id) {
      const name = await findById(id);
      return Promise.resolve(name.goods.name);
    },
    async getCommunity(id) {
      const name = await getCommunity(id);
      return Promise.resolve(name.community.name);
    },
    async findAll(data) {
      // const res2 = await findMenuTree();
      this.listLoading = true;
      const res = await findPage(this.listQuery);

      const item = res.goodsDetailList.list;
      this.list = [];
      // 遍历返回的list
      item.map(value => {
        const temp = value;
        this.getGoodsName(temp.goodsId).then(name => {
             temp.goodsId = name;
           });
        this.getCommunity(temp.communityId).then(name => {
             temp.communityId = name;
        });
        if(temp.status == 1){
            temp.status = "未上架";
        }else if(temp.status == 2){
            temp.status = "上架";
        }else if(temp.status == 3){
             temp.status = "下架";
        }
        this.list.push(temp);
      });
      this.total = item.length;
      this.listLoading = false;
    },
    /**
     * end
     */
    // 根据ID查找Role
    getM() {
      if (this.query== null || this.query == "") {
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
        goodsId: "",
        communityId : "",
        cashPrice:"",
        integralPrive:"",
        totalNum:"",
        salesNum:"",
        status:"",
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
          insertGoodsDetail(this.temp).then(() => {
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
      this.temp = Object.assign({}, row); // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp);

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
          //tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRole(tempData).then(() => {
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
      deleteRole(row.id);
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
