<template>
<div class="item">
    <el-tabs class="itemNav" v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息管理" name="first">
            <baseMessage />
        </el-tab-pane>
        <el-tab-pane label="详细信息管理" name="second">
            <detailMessage />
        </el-tab-pane>
        <el-tab-pane label="评论回复管理" name="third">
             <commentMessage />
        </el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
</div>
</template>

<script>

import baseMessage from '@/components/editLostAndFound/baseMessage'
import detailMessage from '@/components/editLostAndFound/detailMessage'
import commentMessage from '@/components/commentMessage'
export default {
    data() {
        return {
            id: ''
        }
    },
    components: {
        baseMessage,
        detailMessage,
        commentMessage
    },
    created() {
        this.getRouterData();
    },
    methods: {
        getRouterData() {
            // 那边编辑的信息的id
            this.id = this.$route.query.id
        }
    },

}
</script>

<style lang="scss">
.item {
    .itemNav {}
}
</style>
