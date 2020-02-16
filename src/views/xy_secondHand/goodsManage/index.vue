<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="query"
        placeholder="用户手机号"
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
      <!-- 添加按钮 -->
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addCatalog1()">添加一级分类</el-button> -->
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addCatalog()">添加二级分类</el-button> -->
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="selectCatalog1()">一级分类</el-button> -->
      <!-- 下来选择框 -->
      <!-- 一级分类 -->
      <el-select
        clearable
        @change="selectCatalog(catalogValue)"
        v-model="catalogValue"
        placeholder="一级分类"
      >
        <el-option
          v-for="item in catalog1"
          :key="item.catalogId"
          :label="item.name"
          :value="item.catalogId"
        >
        </el-option>
      </el-select>
      <!-- 二级分类 -->
      <el-select
        clearable
        @change="selectCatalog2(catalogValue2)"
        v-model="catalogValue2"
        placeholder="二级分类"
      >
        <el-option
          v-for="item in catalog2"
          :key="item.catalogId"
          :label="item.name"
          :value="item.catalogId"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 以下是表格内容 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      v-if="dataFlag"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- 一列的开始 -->
      <!-- <el-table-column label="商品ID" prop="id" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goodsId }}</span>
        </template>
      </el-table-column> -->
      <!-- 一列的结束 -->
      <el-table-column label="用户名" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="image"
        label="封面图片"
        align="center"
        width="200px"
      >
        <!-- 图片的显示 -->
        <template slot-scope="scope">
          <img :src="scope.row.goodsPic" width="100" height="100px" />
        </template>
      </el-table-column>
      <el-table-column label="标题" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goodsTitle }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容详情" width="200" align="center">
            <template slot-scope="{ row }">
                <span>{{ row.goodsContent }}</span>
            </template>
        </el-table-column> -->
      <el-table-column label="一级分类名" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.catalog1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一级分类名" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.catalog2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校ID" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.schoolId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品发布时间" width align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.goodsReleaseTime | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goodsBrose }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="200px"
        class-name="small-padding fixed-width"
      >
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="edit(row)"
            >编辑</el-button
          >
          <el-button type="success" size="small" @click="enterDetail(row)"
            >进入详情</el-button
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
      @pagination="selectCatalog(catalogValue)"
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
        <el-form-item label="分类名称 ">
          <el-input v-model="temp.name" />
        </el-form-item>
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

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'"
    >
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
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findAllCatalog, findGoods, judgeGoodsPass } from "@/api/xy_secondhand";
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
  name: "goodsManage",

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
      dataFlag: false,
      catalogValue: "", //分类选项的 所选值de id
      catalogValue2: "", //二级分类选项的值 的id
      catalog1: [], //一级分类选项
      catalog2: [], //二级分类选项
      /**
       * 添加按钮有两个  一个是添加一级分类 一个是添加二级分类 他们的处理方式不一样
       * 但是添加的表单只有一个,所以要通过一个flag来区分 到底是添加一级分类还是二级分类
       * 所以用这个flag
       * 当添加一级分类的时候 它为 catalog1
       * 当添加二级分类的时候 它为 catalog2
       *
       * 控制着个flag的改变 是添加一级分类 添加二级分类的按钮的事件里面
       */
      addCatalogFlag: "catalog1",
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
      listLoading: false,
      listQuery: {
        pn: 1, //第几页
        ps: 10, //每页大小
        catalogId: "0"
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
    this.findAllCatalog1();
    this.shouGoodsMsg({
      pn: 1,
      ps: 10
    });
  },
  methods: {
    // 根据用户ID查找商品
    async getM() {
      // let conditions = {
      //     pn: 1,
      //     ps: 10,
      //     userId: ''
      // }
      // conditions.userId = this.query;
      // this.shouGoodsMsg(conditions);
    },
    // 一级分类信息维护
    async selectCatalog1() {
      this.listLoading = true;
      const temp = {
        pn: 1, //第几页
        ps: 10, //每页大小
        catalogId: "0"
      };
      const res = await findAllCatalog(temp);
      this.list = res.queryResult.list;
      this.total = res.queryResult.total;
      this.listLoading = false;
    },
    // 第一次加载所有的一级分类ID
    async findAllCatalog1() {
      const temp = {
        pn: 1, //第几页
        ps: 100, //每页大小
        catalogId: "0"
      };
      const res = await findAllCatalog(temp);
      this.catalog1 = res.queryResult.list;
    },
    // 查询商品信息
    async shouGoodsMsg(data) {
      this.dataFlag = false;
      const res1 = await findGoods(data);
      let temp = res1.queryResult.list;
      temp.map(value => {
        value.goodsReleaseTime = new Date(value.goodsReleaseTime);
      });
      this.list = temp;
      this.total = res1.queryResult.total;
      this.dataFlag = true;
    },
    // 一级分类下拉选择框选中事件   val为选中一级分类的id
    async selectCatalog(val) {
      this.listLoading = true;
      // 查找这个一级分类下的所有商品
      let conditions = {
        pn: 1,
        ps: 10,
        catalog1: ""
      };
      conditions.catalog1 = val;
      //如果选的不是  全部  这个选项 就加载相应一级分类下的商品
      const temp = this.listQuery;
      temp.catalogId = val;
      //设置二级下拉框的内容
      const [res] = await Promise.all([findAllCatalog(temp)]);
      this.shouGoodsMsg(conditions);
      this.catalog2 = res.queryResult.list;
      this.listLoading = false;
    },

    // 二级分类下拉选择框选中事件   val为选中二级分类的id
    async selectCatalog2(val) {
      this.list = [];
      this.listLoading = true;
      //如果 的不是全部选项 就加载相应的
      let conditions = {
        pn: 1,
        ps: 10,
        catalog2: ""
      };
      conditions.catalog2 = val;
      this.shouGoodsMsg(conditions);
      this.listLoading = false;
    },
    //审核通过
    async pass(row) {
      const res = await judgeGoodsPass(row.goodsId);
      this.shouGoodsMsg({
        pn: 1,
        ps: 10
      });
      if (res.code == 10000 || res.code == "10000") {
        this.$notify({
          title: "成功",
          message: "审核成功",
          type: "success",
          duration: 2000
        });
      } else {
        this.$notify({
          title: "失败",
          message: "审核失败",
          type: "error",
          duration: 2000
        });
      }
    },
    // 审核不通过
    async noPass(row) {},

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
