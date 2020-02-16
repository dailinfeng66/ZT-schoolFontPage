<template>
  <!--  v-if="reload" -->
  <div class="item">
    <el-row class="enable-edit">
      <el-button type="primary" plain class="content" @click="quit"
        >退出详情页</el-button
      >
      <el-button
        type="primary"
        plain
        class="content"
        v-show="showEditButton"
        @click="cacleEdit"
        >取消</el-button
      >
      <el-button type="primary" plain class="content" v-show="showEditButton" @click="saveGoodMsg"
        >确定编辑</el-button
      >
      <el-button type="primary" plain class="content" @click="editItem"
        >编辑商品信息</el-button
      >
      <el-button type="danger" plain class="content">审核不通过</el-button>
      <el-button type="success" plain class="content" @click="acceptItem"
        >审核通过</el-button
      >
    </el-row>
    <div class="row-content">
      <div class="row">
        <div class="col">
          <div class="col-title">商品ID:</div>
          <el-input
            disabled="true"
            placeholder="请输入内容"
            v-model="item.goodsId"
            clearable
          >
          </el-input>
        </div>
        <div class="col">
          <div class="col-title">用户ID:</div>
          <el-input
            disabled="true"
            placeholder="请输入内容"
            v-model="item.userId"
            clearable
          >
          </el-input>
        </div>
        <div class="col">
          <div class="col-title">发布时间:</div>
          <el-input
            placeholder="请输入内容"
            v-model="item.goodsReleaseTime"
            clearable
            disabled="true"
          >
          </el-input>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="col-title">一级分类:</div>
          <el-input
            :disabled="disableInput"
            placeholder="请输入内容"
            v-model="item.catalog1"
            clearable
          >
          </el-input>
        </div>
        <div class="col">
          <div class="col-title">二级分类:</div>
          <el-input
            :disabled="disableInput"
            placeholder="请输入内容"
            v-model="item.catalog2"
            clearable
          >
          </el-input>
        </div>
        <div class="col">
          <div class="col-title">商品价格:</div>
          <el-input
            class="col-content"
            placeholder="请输入内容"
            v-model="item.goodsPrice"
            clearable
            :disabled="disableInput"
          >
          </el-input>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="col-title">学校:</div>
          <el-input
            placeholder="请输入内容"
            :disabled="disableInput"
            v-model="item.schoolId"
            clearable
          >
          </el-input>
        </div>
        <div class="col">
          <div class="col-title">商品标题:</div>
          <el-input
            class="col-content"
            placeholder="请输入内容"
            v-model="item.goodsTitle"
            clearable
            :disabled="disableInput"
          >
          </el-input>
        </div>
        <div class="col">
          <div class="col-title">商品状态:</div>
          <el-input
            class="col-content"
            placeholder="请输入内容"
            v-model="item.goodsJudgeStatus"
            clearable
            :disabled="disableInput"
          >
          </el-input>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="col-title">浏览量:</div>
          <el-input
            placeholder="请输入内容"
            v-model="item.goodsBrose"
            clearable
            :disabled="disableInput"
          >
          </el-input>
        </div>
      </div>
    </div>
    <div class="row2-content">
      <div class="row2-title">商品详情:</div>
      <div class="content">
        <el-input
          type="textarea"
          :disabled="disableInput"
          autosize
          placeholder="请输入内容"
          v-model="item.goodsContent"
        >
        </el-input>
      </div>
    </div>
    <hr />
    <div class="img-content">
      <img v-for="item in pics" :key="item" :src="item" class="image" />
      <el-upload
        style="margin-top:5%;"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { findGoods, judgeGoodsPass } from "@/api/xy_secondhand";
export default {
  name: "goodsDetail",
  data() {
    return {
      disableInput: "true", //禁用input
      item: null, //存的数据
      pics: [], //物品图片
      goodid: null, //商品的id
      dialogImageUrl: "", //上传图片用
      dialogVisible: false, //上传图片用
      showEditButton: false //是否显示 确认编辑和取消两个按钮
    };
  },
  methods: {
    // 得到传过来的ID
    async getMsg() {
      let goodsid = this.$route.query.id;
      this.goodid = goodsid;
      const temp = {
        goodsId: goodsid,
        pn: 1,
        ps: 1
      };
      const res = await findGoods(temp);
      let temp1 = res.queryResult.list[0];
      this.pics = temp1.goodsPic.split(",");
      this.item = res.queryResult.list[0];
      // 下面的代码是格式化时间
      let oldtime = new Date(this.item.goodsReleaseTime).getTime();
      var date = new Date(oldtime);
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.item.goodsReleaseTime =
        date.getFullYear() +
        "-" +
        month +
        "-" +
        strDate +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
    },
    // 用户点了取消编辑按钮
    cacleEdit() {
      this.getMsg();
      this.disableInput = true;
      this.showEditButton = false;
    },
    // 用户点了编辑按钮
    editItem() {
      this.disableInput = false;
      this.showEditButton = true;
    },
    // 用户点了退出详情页
    quit() {
      this.$router.push({ path: "goodsManage" });
    },
    // 用户点击了 确定编辑
    saveGoodMsg(){
      
    },
    // 用户点了通过审核
    async acceptItem() {
      const res = await judgeGoodsPass(this.goodid);
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
      this.quit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  created() {
    this.getMsg();
  }
};
</script>

<style lang="less" scoped>
.item {
  .enable-edit {
    .content {
      float: right;
      margin: 10px;
    }
  }
  .row-content {
    .row {
      display: flex;
      .col {
        margin: 10px;
        display: flex;
        width: 33%;
        .col-title {
          display: grid;
          align-items: center;
          text-align: center;
          width: 20%;
        }
        .col-content {
          width: 80%;
        }
      }
    }
  }
  .row2-content {
    display: flex;
    margin: 10px;
    .row2-title {
      display: grid;
      align-items: center;
      margin-right: 1%;
    }
    .content {
      width: 94%;
      margin: 0%;
    }
  }
  .img-content {
    display: flex;
    .image {
      width: 15%;
      height: 15%;
    }
  }
}
</style>
