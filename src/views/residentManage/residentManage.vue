<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 input框 -->
      <el-input
        v-model="listQuery.code"
        placeholder="code"
        style="width: 200px;"
        class="filter-item"
       
      />
      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="findAll(listQuery)">搜索</el-button>
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
      <el-table-column v-if="false" label="ID" prop="id" align="center" width >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 一列的结束 -->
      <el-table-column label="居民编号" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="居民名称" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.registerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="图片" min-width>
        <!-- 图片的显示 -->
        <template slot-scope="scope">
          <img :src="scope.row.profile" min-width="70" height="70" />
        </template>
      </el-table-column>

      <el-table-column label="openId" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lastLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称集合" width align="center">
        <template slot-scope="{ row }">
          <span>{{ row.roleNames }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="拥有权限" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.menuIds }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <!-- 右边按钮区域 -->
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="jie(row)">解冻</el-button>
          <el-button type="danger" size="small" @click="dong(row)">冻结</el-button>
          <!-- <el-button type="primary" size="small" @click="handleUpdatePer(row)">编辑权限</el-button> -->
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
        <el-form-item label="菜单名">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- 第二个字段 -->
        <el-form-item label="父Id">
          <el-input v-model="temp.pId" />
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
        <el-form-item label="类型">
          <el-input v-model="temp.type" />
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

  </div>
</template>

<script>
import { getAll,frozenResident } from "@/api/residentManage";
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
        residentId:"",
        status:""
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
    this.findAll(this.listQuery);
  },
  methods: {

    async findAll(data) {
      // const res2 = await findMenuTree();
      this.listLoading = true;
      const res = await getAll(this.listQuery);

      const item = res.residentList.list;
      this.list = [];
      // 遍历返回的list
      item.map(value => {
        const temp = value;
        if (temp.status == 1) {
          temp.status = "正常";
        } else {
          temp.status = "冻结";
        }
        if (temp.roleNames == "") {
          temp.roleNames = "暂无";
        } else {
          //遍历待处理
        }
        this.list.push(temp);
      });
      this.total = item.length;
      this.listLoading = false;
    },
  
    jie(row) {
       this.temp.residentId = Object.assign({}, row).id; // copy obj
        this.temp.status = "1";
        frozenResident(this.temp).then(() => {
          this.$notify({
              title: "成功",
              message: "解冻成功",
              type: "success",
              duration: 2000
            });
            this.findAll(this.listQuery);
        });
      
    },
    dong(row) {
        this.temp.residentId = Object.assign({}, row).id; // copy obj
        this.temp.status = "0";
        frozenResident(this.temp).then(() => {
          this.$notify({
              title: "成功",
              message: "冻结成功",
              type: "success",
              duration: 2000
            });
            this.findAll(this.listQuery);
        });
      
    },
  }
};
</script>
