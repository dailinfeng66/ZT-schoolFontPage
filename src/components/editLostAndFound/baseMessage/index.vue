<template>
  <div class="item">
    <div class="item-content">
      <div class="col-content">
        <div class="row">
          <div class="row-title">id:</div>
          <el-input placeholder="id" v-model="info.id" :disabled="true" class="input"></el-input>
        </div>
        <div class="row">
          <div class="row-title">schoolId:</div>
          <el-input placeholder="schoolId" v-model="info.schoolId" :disabled="false" class="input"></el-input>
        </div>
        <div class="row">
          <div class="row-title">发布时间:</div>
          <el-date-picker
            placeholder="schoolId"
            type="datetime"
            v-model="info.createtime"
            :disabled="false"
            class="input"
          >\</el-date-picker>
        </div>
        <div class="row">
          <div class="row-title">类别:</div>
          <el-input placeholder="categary" v-model="info.category" :disabled="false" class="input"></el-input>
        </div>
      </div>
      <div class="col-content">
        <div class="row">
          <div class="row-title">userId:</div>
          <el-input placeholder="userId" v-model="info.userId" :disabled="true" class="input"></el-input>
        </div>
        <div class="row">
          <div class="row-title">姓名:</div>
          <el-input placeholder="userName" v-model="info.userName" :disabled="true" class="input"></el-input>
        </div>
        <div class="row">
          <div class="row-title">状态:</div>
          <el-input placeholder="state" v-model="info.state" :disabled="false" class="input"></el-input>
        </div>
      </div>
    </div>
    <br>
      
    <hr />
     <img
            :src="info.pic"
            class="image"
            
    />
  <el-upload
  class="avatar-uploader"
  action="https://jsonplaceholder.typicode.com/posts/"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
    <!-- <el-row>
      <el-col :span="5"  v-for="(item,index) of info.pics" :key="index">
        <el-card  >
          <img
            :src="item.picUrl"
            class="image"
          />
            <div >
              <el-button style="padding:20px" type="text" class="button">操作按钮</el-button>
            </div>
        </el-card>
      </el-col>
    </el-row>
       <br>
     -->


  </div>
</template>

<script>
import { getInfo } from "@/api/xy_lostAndFound";
import { array } from "jszip/lib/support";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      id: "",
      
      info: {
        // category : "",
        // content:"",
        // createtime:"",
        // id:"",
        // pics:"",
        // place:"",
        // schoolId:"",
        // state:"",
        // userId:"",
        // userName:"",
      }
    };
  },
  created() {
    this.getRouterData();
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async getRouterData() {
      // 那边编辑的信息的id
      this.id = this.$route.query.id;
      const res = await getInfo(this.id);
      this.info = res.lost;
      this.info.createtime = new Date(this.info.createtime);

      this.info.pics.forEach((item, index, array) => {
        //alert(item.picUrl);
      });
    }
  }
};
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

.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 200px;
    height: 200px;
    display: block;
    float: left;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
