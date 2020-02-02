<template>
<div class="item">
    <div class="item-content">
        <div class="col-content">
            <div class="row">
                <div class="row-title">id:</div>
                <el-input placeholder="id" v-model="input" :disabled="true" class="input">
                </el-input>
            </div>
            <div class="row">
                <div class="row-title">schoolId:</div>
                <el-input placeholder="schoolId" v-model="input" :disabled="false" class="input">
                </el-input>
            </div>
            <div class="row">
                <div class="row-title">发布时间:</div>
                <el-input placeholder="createtime" v-model="input" :disabled="false" class="input">
                </el-input>
            </div>
            <div class="row">
                <div class="row-title">类别:</div>
                <el-input placeholder="categary" v-model="input" :disabled="false" class="input">
                </el-input>
            </div>
        </div>
        <div class="col-content">
            <div class="row">
                <div class="row-title">userId:</div>
                <el-input placeholder="userId" v-model="input" :disabled="true" class="input">
                </el-input>
            </div>
            <div class="row">
                <div class="row-title">姓名:</div>
                <el-input placeholder="userName" v-model="input" :disabled="true" class="input">
                </el-input>
            </div>
            <div class="row">
                <div class="row-title">状态:</div>
                <el-input placeholder="state" v-model="input" :disabled="false" class="input">
                </el-input>
            </div>
        </div>
    </div>
    <hr />

    <el-upload action="https:" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false
        };
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.item {
    .item-content {
        display: flex;

        .col-content {
            width: 40%;
            margin-left: 5%;

            .row {
                display: flex;
                margin-top: 3%;

                .row-title {
                    width: 15%;
                    display: grid;
                    align-items: center;
                    text-align: center;
                    margin-right: 2%;
                }

                .input {
                    width: 85%;
                }
            }
        }
    }

}
</style>
