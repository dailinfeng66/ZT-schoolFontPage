<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="queryId"
        placeholder="id搜索"
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
        @click="find(queryId)"
      >订单号搜索</el-button>
       <el-date-picker
        class="filter-item"
        type="datetime"
        placeholder="选择下单开始时间"
        v-model="listQuery.startOrderTime"
        style="width: 13%;"
        @change="findAll(listQuery)"
      ></el-date-picker>
      <label class="filter-item">----</label>
      <el-date-picker
        class="filter-item"
        type="datetime"
        placeholder="选择下单结束时间"
        v-model="listQuery.endOrderTime"
        style="width: 13 %;"
        @change="findAll(listQuery)"
      ></el-date-picker>
       <el-input
        class="filter-item"
        v-model="listQuery.startPrice"
        placeholder="请选择开始价格 "
        @change="findAll(listQuery)"
         style="width:  150px;"
      ></el-input>
        <label class="filter-item">----</label>
         <el-input
           style="width:  150px;"
        class="filter-item"
        v-model="listQuery.endPrice"
        placeholder="请选择结束价格 "
        @change="findAll(listQuery)"
      ></el-input>

<!--
      <el-select
        class="filter-item"
        v-model="listQuery.mgrQueryLostRequest.category"
        placeholder="请选择类型"
        @change="findAll(listQuery)"
      >
        <el-option label value></el-option>
        <el-option label="丢失物品" :value="1"></el-option>
        <el-option label="捡到物品" :value="2"></el-option>
      </el-select>-->
      <el-select
        class="filter-item"
        v-model="listQuery.states"
        placeholder="请选择订单状态 "
        @change="findAll(listQuery)"
      >
        <el-option label value></el-option>
        <el-option label="已下单" value="0"></el-option>
        <el-option label="已支付" value="1"></el-option>
        <el-option label="已确认" value="2"></el-option>
        <el-option label="卖家已取消" value="3"></el-option>
        <el-option label="买家已取消" value="4"></el-option>
      </el-select>

      <!-- <el-input
        v-model="listQuery.mgrQueryLostRequest.userId"
        placeholder="用户名（ID）"
        style="width: 200px;"
        class="filter-item"
        @change="findAll(listQuery)"
      />-->
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

      <el-table-column label="订单ID（号）" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买人" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.buyerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卖出人" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row. sellerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goodsId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="下单时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.orderTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.paidTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="确认时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.confirmTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.states }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="handleUpdate(row)">编辑</el-button>
          <!-- <el-button type="danger" size="small" @click="handleDelete(row, 'draft')">删除</el-button> -->
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
        <el-form-item label="订单号"  >
          <el-input v-model="temp.orderId" readonly="true"/>
        </el-form-item>
        <!-- 第二个字段 -->
        <el-form-item label="购买人">
          <el-input v-model="temp.buyerId" />
        </el-form-item>
        <el-form-item label="卖出人">
          <el-input v-model="temp.sellerId" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="temp.goodsId" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="temp.price" />
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="temp.states" placeholder="请选择订单状态">
            <el-option label="已下单" value="0"></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="已确认" value="2"></el-option>
            <el-option label="卖家已取消" value="3"></el-option>
            <el-option label="买家已取消" value="4"></el-option>
          </el-select>
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
  </div>
</template>

<script>
import { findOrder, findOrderById,editOrderById,findOrderByIdIncludeDES } from "@/api/xy_secondhand";

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
      queryId: "",
      listQuery: {
        ps: 10, //每页大小
        pn: 1, //第几页‘
        buyerId: null,
        endConfirmTime: null,
        endOrderTime: null,
        endPaidTime: null,
        endPrice: null,
        goodsId: null,
        sellerId: null,
        startConfirmTime: null,
        startOrderTime: null,
        startPaidTime: null,
        startPrice: null,
        states: null
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑信息",
        create: "创建订单"
      },
      dialogPvVisible: false,
      pvData: [],

      downloadLoading: false,
      rules: {
        description: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur"
          }
        ]
      }
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
  },
  methods: {
    //获取表格序号
    getIndex($index) {
      //表格序号
      return (this.listQuery.pn - 1) * this.listQuery.ps + $index + 1;
    },
    async findAll(data) {
      this.listLoading = true;
      const res = await findOrder(data);
      const item = res.queryResult.list;
      this.list = [];
      // 遍历返回的list
      item.map(value => {
        const temp = value;
        if (temp.states == 0) {
          temp.states = "已下单";
        } else if (temp.states == 1) {
          temp.states = "已支付";
        } else if (temp.states == 2) {
          temp.states = "已确认";
        } else if (temp.states == 3) {
          temp.states = "卖家已取消";
        } else if (temp.states == 4) {
          temp.states = "买家已取消";
        }
        temp.paidTime = new Date(temp.paidTime);
        temp.orderTime = new Date(temp.orderTime);
        temp.confirmTime = new Date(temp.confirmTime);

        this.list.push(temp);
      });
      //this.listQuery.ps = res.page.ps;
      this.total = res.queryResult.total;
      this.listLoading = false;
    },
    /**
     * end
     */
    // 根据名称查找Role
    getRole() {
      if (this.query == null || this.query == "") {
        this.$delete(this.listQuery, "name"); //vue删除方式
        this.findAll(this.listQuery);
      } else {
        this.find();
      }
    },
    async find() {
      if (this.queryId == "") {
        this.findAll(this.listQuery);
      } else {
        this.listLoading = true;
        const res = await findOrderByIdIncludeDES(this.queryId);
        const item = res.queryResult.list;
        this.list = [];
        // 遍历返回的list
        item.map(value => {
          const temp = value;
          if (temp.states == 0) {
            temp.states = "已下单";
          } else if (temp.states == 1) {
            temp.states = "已支付";
          } else if (temp.states == 2) {
            temp.states = "已确认";
          } else if (temp.states == 3) {
            temp.states = "卖家已取消";
          } else if (temp.states == 4) {
            temp.states = "买家已取消";
          }
          temp.paidTime = new Date(temp.paidTime);
          temp.orderTime = new Date(temp.orderTime);
          temp.confirmTime = new Date(temp.confirmTime);

          this.list.push(temp);
        });
        //this.listQuery.ps = res.page.ps;
        this.total = res.queryResult.total;
        this.listLoading = false;
      }
    },
    resetTemp() {
      this.temp = {};
    },

    handleCreateRole() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    async createData() {
      this.$refs["dataForm"].validate(async valid => {
        if (valid) {
          createRole(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
            this.findAll(this.listQuery);
          });
          this.dialogFormVisible = false;
        }
      });
    },
    async handleUpdate(row) {
      this.resetTemp();
      const res = await findOrderById(row.orderId);
      const item = res.queryResult.list;
      this.temp = item[0];
      console.log(this.temp.orderId);
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
      this.checkStrictly = false;
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
          editOrderById(tempData.orderId,tempData).then(() => {
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
    handleDelete(row) {
      deleteRole(row.id).then(() => {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });

        // const index = this.list.indexOf(row);
        // this.list.splice(index, 1);
        this.findAll(this.listQuery);
      });
    }
  }
};
</script>
