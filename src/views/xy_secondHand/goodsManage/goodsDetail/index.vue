<template>
  <!--  v-if="reload" -->
  <div class="item" v-if="onload">
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
      <el-button
        type="primary"
        plain
        class="content"
        v-show="showEditButton"
        @click="saveGoodMsg"
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
            disabled
            placeholder="请输入内容"
            v-model="item.goodsId"
            clearable
          >
          </el-input>
        </div>
        <div class="col">
          <div class="col-title">用户ID:</div>
          <el-input
            disabled
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
            disabled
          >
          </el-input>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="col-title">一级分类:</div>
          <el-select
            v-model="catalog1Value"
            :disabled="disableInput"
            placeholder="请选择"
            @change="selectCatalog1(catalog1Value)"
          >
            <el-option
              v-for="item in catalog1"
              :key="item.catalogId"
              :label="item.name"
              :value="item.catalogId"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col">
          <div class="col-title">二级分类:</div>
          <el-select
            v-model="catalog2Value"
            :disabled="disableInput"
            placeholder="请选择"
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
            disabled
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
import {
  findGoods,
  judgeGoodsPass,
  updateGoodsMsg,
  findAllCatalog,
  findGoodsCatalog
} from "@/api/xy_secondhand";
import { getGoodStateByCode } from "@/api/xy_secondhandUtils";
export default {
  name: "goodsDetail",
  data() {
    return {
      onload: false, //加载完之后再渲染页面
      disableInput: true, //禁用input
      item: null, //存的数据
      pics: [], //物品图片
      goodid: null, //商品的id
      dialogImageUrl: "", //上传图片用
      dialogVisible: false, //上传图片用
      showEditButton: false, //是否显示 确认编辑和取消两个按钮
      catalog1: [], //一级分类列表
      catalog2: [], //二级分类列表
      catalog1Value: "", //下拉列表选项 所选值
      catalog2Value: "", //二级分类下拉列表所选值
      updateGoodsCache: null //更新商品信息的时候 用来提交的对象
    };
  },
  methods: {
    // 在这个方法中执行,页面初始化的方法
    initPage() {
      this.getMsg(); //得到商品详情信息
      this.getCatalog(); //得到商品两级分类信息
      this.onload = true;
    },
    //加载商品的一级分类ID和二级分类ID
    async getCatalog() {
      // 获取一级分类
      const temp = {
        pn: 1, //第几页
        ps: 100, //每页大小
        catalogId: "0"
      };
      //得到所有一级分类
      findAllCatalog(temp).then(res => {
        this.catalog1 = res.queryResult.list;
        let condition = {
          goodsId: this.goodid
        };
        //根据商品id得到一级分类和二级分类
        findGoodsCatalog(condition).then(res1 => {
          // 设置一级分类默认选项
          this.catalog1Value = res1.queryResult.list[0].shCatalog1.catalogId;
          // 得到所有一级分类和目前所选一级分类下的二级分类
          const temp1 = {
            pn: 1, //第几页
            ps: 100, //每页大小
            catalogId: res1.queryResult.list[0].shCatalog1.catalogId
          };
          //获取所有的二级分类
          findAllCatalog(temp1).then(res2 => {
            this.catalog2 = res2.queryResult.list;
            // 设置二级分类默认选项
            this.catalog2Value = res1.queryResult.list[0].shCatalog2.catalogId;
          });
        });
      });
    },
    // 选了一级分类之后    加载二级分类
    async selectCatalog1(val) {
      const temp = {
        pn: 1, //第几页
        ps: 100, //每页大小
        catalogId: "0"
      };
      temp.catalogId = val;
      //设置二级下拉框的内容
      const res = await findAllCatalog(temp);
      this.catalog2 = res.queryResult.list;
    },
    // 得到传过来的ID
    async getMsg() {
      let goodsid = this.$route.query.id; //获取商品管理页面传过来的ID值
      this.goodid = goodsid;
      const temp = {
        goodsId: goodsid,
        pn: 1,
        ps: 1
      };
      const res = await findGoods(temp); //得到商品的详细信息
      //处理图片 以,分割
      let temp1 = res.queryResult.list[0];
      this.pics = temp1.goodsPic.split(",");
      this.item = res.queryResult.list[0];
      // 转化状态
      this.item.goodsJudgeStatus = getGoodStateByCode(
        this.item.goodsJudgeStatus
      );
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
    async saveGoodMsg() {
      this.updateGoodsCache = this.item;
      //设置上传更改的信息    item存在的是一二级分类的 名字 上传要上传成ID
      this.updateGoodsCache.catalog1 = this.catalog1Value;
      this.updateGoodsCache.catalog2 = this.catalog2Value;

      const res = await updateGoodsMsg(this.updateGoodsCache);
      // 得到编辑之后的信息
      this.getMsg();
      this.disableInput = true; //使得input框不能编辑
      this.showEditButton = false; // 使得编辑的按钮消失
      if (res.code == 10000 || res.code == "10000") {
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success",
          duration: 2000
        });
      } else {
        this.$notify({
          title: "失败",
          message: "修改失败",
          type: "error",
          duration: 2000
        });
      }
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
    this.initPage();
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
      width: 90%;
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
