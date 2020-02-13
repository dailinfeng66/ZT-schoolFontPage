<template>
<div class="app-container">
    <div class="filter-container">
        <!-- 标题 input框 -->
        <!-- <el-input v-model="query" placeholder="分类ID" style="width: 200px;" class="filter-item" @keyup.enter.native="getM" /> -->
        <!-- 搜索按钮 -->
        <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getM">搜索</el-button> -->
        <!-- 添加按钮 -->
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addCatalog1()">添加一级分类</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addCatalog()">添加二级分类</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="selectCatalog1()">一级分类</el-button>
        <!-- 下来选择框 -->
        <!-- 一级分类 -->
        <el-select @change="selectCatalog(catalogValue)" v-model="catalogValue" placeholder="请选择">
            <el-option v-for="item in catalog1" :key="item.catalogId" :label="item.name" :value="item.catalogId">
            </el-option>
        </el-select>

    </div>

    <!-- 以下是表格内容 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
        <!-- 一列的开始 -->
        <el-table-column label="ID" prop="id" align="center" :class-name="getSortClass('id')">
            <template slot-scope="{ row }">
                <span>{{ row.catalogId }}</span>
            </template>
        </el-table-column>
        <!-- 一列的结束 -->
        <el-table-column label="分类名称" width align="center">
            <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="父分类ID" width align="center">
            <template slot-scope="{ row }">
                <span>{{ row.parentId }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
            <!-- 右边按钮区域 -->
            <template slot-scope="{ row }">
                <el-button type="primary" size="small" @click="handleUpdate(row)">编辑信息</el-button>
                <el-button type="danger" size="small" @click="handleDelete(row, 'draft')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 下面是修改操作的东西 -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pn" :limit.sync="listQuery.ps" @pagination="selectCatalog(catalogValue)" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <!-- 第一个字段 -->
            <el-form-item label="分类名称 ">
                <el-input v-model="temp.name" />
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确定</el-button>
        </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
        <el-form :model="role" label-width="80px" label-position="left">
            <el-form-item label="Menus">
                <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" />
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
    findAllCatalog,
    insertCatalog,
    updateCatalog,
    deleteCatalog
} from "@/api/xy_sceondhand";
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
    name: "catalogManage",

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
            catalogValue: '', //分类选项的 所选值de id
            catalog1: [], //一级分类选项
            /**
             * 添加按钮有两个  一个是添加一级分类 一个是添加二级分类 他们的处理方式不一样
             * 但是添加的表单只有一个,所以要通过一个flag来区分 到底是添加一级分类还是二级分类
             * 所以用这个flag  
             * 当添加一级分类的时候 它为 catalog1 
             * 当添加二级分类的时候 它为 catalog2
             * 
             * 控制着个flag的改变 是添加一级分类 添加二级分类的按钮的事件里面
             */
            addCatalogFlag: 'catalog1',
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
                catalogId: '0'
            },
            importanceOptions: [1, 2, 3],
            calendarTypeOptions,
            statusOptions: ["published", "draft", "deleted"],
            showReviewer: false,
            temp: {

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
                type: [{
                    required: true,
                    message: "type is required",
                    trigger: "change"
                }],
                timestamp: [{
                    type: "date",
                    required: true,
                    message: "timestamp is required",
                    trigger: "change"
                }],
                title: [{
                    required: true,
                    message: "title is required",
                    trigger: "blur"
                }]
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
        this.selectCatalog1();
    },
    methods: {
        // 一级分类信息维护
        async selectCatalog1() {
            this.listLoading = true;
            const temp = {
                pn: 1, //第几页
                ps: 10, //每页大小
                catalogId: '0'
            };
            const res = await findAllCatalog(temp)
            this.list = res.queryResult.list;
            this.total = res.queryResult.total;
            this.listLoading = false;
        },
        // 在这里写自己的方法
        async getMenu(id) {
            const name = await getMenu(id);
            return Promise.resolve(name.menu.name);
        },
        // 第一次加载所有的一级分类ID
        async findAllCatalog1() {
            const temp = {
                pn: 1, //第几页
                ps: 100, //每页大小
                catalogId: '0'
            }
            const res = await findAllCatalog(temp);
            this.catalog1 = res.queryResult.list;
        },
        // 一级分类下拉选择框选中事件   val为选中一级分类的id
        async selectCatalog(val) {
            this.listLoading = true;
            const temp = this.listQuery;
            temp.catalogId = val;
            const res = await findAllCatalog(temp)
            this.list = res.queryResult.list;
            this.total = res.queryResult.total;
            this.listLoading = false;
        },

        // 重置temp  -> 这个temp是添加和修改的中间变量
        resetTemp() {
            this.temp = {
                catalogId: null,
                name: null,
                parentId: null
            };
        },
        // 添加二级分类
        addCatalog() {
            if (this.catalogValue == '') {
                this.$message.error('请先选择一级分类');
            } else {
                this.addCatalogFlag = "catalog2"
                this.resetTemp();
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs["dataForm"].clearValidate();
                });
            }

        },
        // 添加一级分类
        addCatalog1() {
            this.addCatalogFlag = "catalog1";
            this.resetTemp();
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        //添加两级分类
        createData() {
            this.$refs["dataForm"].validate(async valid => {
                if (valid) {
                    // 表示是添加一级分类
                    if (this.addCatalogFlag == "catalog1") {
                        const catalog = {
                            name: '',
                            parentId: '0'
                        }
                        let dataMsg = [];
                        catalog.name = this.temp.name;
                        dataMsg.push(catalog)
                        this.dialogFormVisible = false;
                        const res = await insertCatalog(dataMsg);
                        if (res.code == 10000 || res.code == "10000") {
                            this.$notify({
                                title: "成功",
                                message: "添加分类成功",
                                type: "success",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "失败",
                                message: "添加分类失败",
                                type: "error",
                                duration: 2000
                            });
                        }
                    }
                    // 表示是添加二级分类
                    if (this.addCatalogFlag == "catalog2") {
                        const catalog = {
                            name: '',
                            parentId: '0'
                        }
                        let dataMsg = [];
                        catalog.name = this.temp.name;
                        catalog.parentId = this.catalogValue;
                        dataMsg.push(catalog)
                        this.dialogFormVisible = false;
                        const res = await insertCatalog(dataMsg);
                        if (res.code == 10000 || res.code == "10000") {
                            this.$notify({
                                title: "成功",
                                message: "添加分类成功",
                                type: "success",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "失败",
                                message: "添加分类失败",
                                type: "error",
                                duration: 2000
                            });
                        }
                    }
                    this.selectCatalog(this.catalogValue);
                }
            });
        },
        // 修改两级分类  点击 打开 修改面板
        handleUpdate(row) {
            this.temp = Object.assign({}, row); // copy obj
            // this.temp.timestamp = new Date(this.temp.timestamp);

            this.dialogStatus = "update";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 更新两级分类  确定按钮
        updateData() {
            this.$refs["dataForm"].validate(async valid => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp);
                    let content = [];
                    content.push(this.temp)
                    this.dialogFormVisible = false;
                    const res = await updateCatalog(content);
                    this.selectCatalog(this.catalogValue);
                    if (res.code == 10000 || res.code == "10000") {
                        this.$notify({
                            title: "成功",
                            message: "修改分类成功",
                            type: "success",
                            duration: 2000
                        });
                    } else {
                        this.$notify({
                            title: "失败",
                            message: "修改分类失败",
                            type: "error",
                            duration: 2000
                        });
                    }

                }
            });
        },
        // 删除两级分类信息
        async handleDelete(row) {
            let content = [];
            content.push(row.catalogId);
            // console.log(row.catalogId)
            // console.log(content)
            const res = await deleteCatalog(content);
            this.selectCatalog(this.catalogValue);
            if (res.code == 10000 || res.code == "10000") {
                this.$notify({
                    title: "成功",
                    message: "删除分类成功",
                    type: "success",
                    duration: 2000
                });
            } else {
                this.$notify({
                    title: "失败",
                    message: "删除分类失败",
                    type: "error",
                    duration: 2000
                });
            }
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
        getSortClass: function (key) {
            const sort = this.listQuery.sort;
            return sort === `+${key}` ?
                "ascending" :
                sort === `-${key}` ?
                "descending" :
                "";
        }
    }
};
</script>
