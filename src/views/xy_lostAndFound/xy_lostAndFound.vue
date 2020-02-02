<template>
<div class="app-container">
    <div class="filter-container">
        <!-- 标题 input框 -->
        <el-input v-model="listQuery.title" placeholder="标题搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="getRole" />
        <!-- 搜索按钮 -->
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="findAll(listQuery)">标题搜索</el-button>
        <el-date-picker class="filter-item" type="datetime" placeholder="选择开始时间" v-model="listQuery.mgrQueryLostRequest.startTime" style="width: 13%;" @change ="findAll(listQuery)"></el-date-picker>
        <label class="filter-item">----</label>
        <el-date-picker class="filter-item" type="datetime" placeholder="选择结束时间" v-model="listQuery.mgrQueryLostRequest.endTime" style="width: 13 %;" @change ="findAll(listQuery)" ></el-date-picker>

        <el-select class="filter-item" v-model="listQuery.mgrQueryLostRequest.category" placeholder="请选择类型" @change ="findAll(listQuery)">
            <el-option label="" value=""></el-option>
            <el-option label="丢失物品" :value=1></el-option>
            <el-option label="捡到物品" :value=2></el-option>
        </el-select>
        <el-select class="filter-item" v-model="listQuery.mgrQueryLostRequest.state" placeholder="请选择失物招领状态 " @change ="findAll(listQuery)">
            <el-option label="" value=""></el-option>
            <el-option label="未审核通过" value="0"></el-option>
            <el-option label="未解决" value="1"></el-option>
            <el-option label="解决" value="2"></el-option>
            <el-option label="用户删除" value="3"></el-option>

        </el-select>

        <el-input v-model="listQuery.mgrQueryLostRequest.userId" placeholder="用户名（ID）" style="width: 200px;" class="filter-item"  @change ="findAll(listQuery)"/>
        <!-- <el-input v-model="listQuery.mgrQueryLostRequest.schoolId" placeholder="学校名（ID）" style="width: 200px;" class="filter-item" @change ="findAll(listQuery)"/> -->
    </div>

    <!-- 以下是表格内容 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <!-- 一列的开始 -->
        <el-table-column label="ID" prop="id" align="center" width="160" :class-name="getSortClass('id')" v-if="false">
            <template slot-scope="{ row }">
                <span>{{ row.id }}</span>
            </template>
        </el-table-column>
        <!-- 一列的结束 -->
          <el-table-column label="序号" prop="" width="180" align="center">
            <template slot-scope="scope">
              <span v-text="getIndex(scope.$index)"> </span>
            </template>
          </el-table-column>

        

        <el-table-column label="学校ID（名称）" width align="center">
            <template slot-scope="{ row }">
                <span>{{ row.schoolId }}</span>
            </template>
        </el-table-column>
        <el-table-column label="用户名" width="" align="center">
            <template slot-scope="{ row }">
                <span>{{ row.userName }}</span>
            </template>
        </el-table-column>
         <el-table-column label="标题"  align="center">
            <template slot-scope="{ row }">
                <span>{{ row.title }}</span>
            </template>
        </el-table-column>
          <el-table-column prop="image" label="封面" align="center" width="200px">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
                <img :src="scope.row.pic" width="100%" height="100px"/>
            </template>
        </el-table-column>
        <el-table-column label="地点" width align="center">
            <template slot-scope="{ row }">
                <span>{{ row.place }}</span>
            </template>
        </el-table-column>
      <el-table-column label="发布时间" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.createtime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
           <el-table-column label="类型" width align="center">
            <template slot-scope="{ row }">
                <span style="border:2px solid yellow;">{{ row.category }}</span>
            </template>
        </el-table-column>


        <el-table-column label="发布状态" width align="center">
            <template slot-scope="{ row }">
                <el-button type="primary" size="small" @click="handleUpdate(row)" :disabled=row.show>
                    {{row.state}}</el-button>
            </template>
        </el-table-column>
         <el-table-column label="删除状态" width align="center">
            <template slot-scope="{ row }">
                <el-button type="danger" size="small" @click="handleUpdate(row)" :disabled=row.dshow>
                    {{row.dstate}}</el-button>
            </template>
        </el-table-column>
        <!-- <el-table-column label="内容" width align="center">
            <template slot-scope="{ row }">
                <span>{{ row.content }}</span>
            </template>
        </el-table-column> -->

       
        
     
      

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <!-- 右边按钮区域 -->
            <template slot-scope="{ row }">
                <el-button type="primary" size="small" @click="handleUpdate(row)">
                    编辑</el-button>
                <!-- <el-button type="danger" size="small" @click="handleDelete(row, 'draft')">删除</el-button> -->

            </template>
        </el-table-column>
    </el-table>
    <!-- 下面是修改操作的东西 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="findAll(listQuery)" />
</div>
</template>

<script>
import {
    findAll,
} from "@/api/xy_lostAndFound";

import waves from "@/directive/waves"; // waves directive
import {
    parseTime
} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [{
    key: "CN",
    display_name: "China"
}];

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
            listQuery: {
                size: 10, //每页大小
                page: 1, //第几页
                mgrQueryLostRequest: {
                    category: "",
                    endTime: "",
                    schoolId: [ 
                    ],
                    startTime: "",
                    state: "",
                    userId: ""
                },
                title:"",
            },
            importanceOptions: [1, 2, 3],
            calendarTypeOptions,
            statusOptions: ["published", "draft", "deleted"],
            showReviewer: false,
            temp: {
                id: undefined,
                name: "",
                description: ""
            },
            dialogFormVisible: false,
            dialogStatus: "",
            textMap: {
                update: "编辑信息",
                //create: "创建角色"
            },
            dialogPvVisible: false,
            pvData: [],

            downloadLoading: false,
            rules: {
                description: [{
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    },

                ],
                name: [{
                        required: true,
                        message: '请输入角色名',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 20,
                        message: '长度在 2 到 20 个字符',
                        trigger: 'blur'
                    }
                ]
            },
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
        // this.getRoutes();
    },
    methods: {
       
        //获取表格序号
      getIndex($index) {
        //表格序号
        return (this.listQuery.page - 1) * this.listQuery.size + $index + 1
      },
        async findAll(data) {
          
            this.listLoading = true;
            const res = await findAll(data);
            const item = res.queryResult.list;
            this.list = [];
            // 遍历返回的list
            item.map(value => {
                const temp = value;
                if (temp.state == 0) {
                    temp.dstate = "未删除"
                    temp.dshow=false
                    temp.state = "未发布"
                    temp.show = false
                } else if (temp.state == 1) {
                    temp.dstate = "未删除"
                      temp.dshow=false
                    temp.state = "已发布"
                    temp.show = true
                } else if (temp.state == 2) {
                    temp.dstate = "未删除"
                      temp.dshow=false
                    temp.state = "已发布"
                    temp.show = true
                } else if (temp.state == 3) {
                    temp.dstate = "已删除"
                      temp.dshow=true
                    temp.state = "未发布"
                    temp.show = false
                }
                if (temp.category == 1) {
                    temp.category = "失物"
                }
                if (temp.category == 2) {
                    temp.category = "招领"
                }
                temp.createtime = new Date(temp.createtime)
                if (temp.schoolId == 1) {
                    temp.schoolId = "成都信息工程大学"
                } else if (temp.schoolId == 2) {
                    temp.schoolId = "四川大学"
                }

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

            this.listQuery.name = this.query;
            const res = await findAll(this.listQuery);

            this.listLoading = true;
            const item = res.page.list;
            this.list = [];
            // 遍历返回的list
            item.map(value => {
                const temp = value;
                //const menu = temp.menuIds;
                this.list.push(temp);
            });
            this.listQuery.ps = res.page.ps;
            this.total = res.page.total;
            this.listLoading = false;
        },
        resetTemp() {
            this.temp = {
                id: undefined,
                name: "",
                description: ""
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
        handleUpdate(row) {
            this.temp = Object.assign({}, row); // copy obj
            console.log(this.temp);
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
