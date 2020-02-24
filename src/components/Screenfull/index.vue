<template>
  <div>
    <el-select
      v-if="canShow"
      v-model="value"
      :disabled="canChoose"
      style="width: 200px;"
    >
      <!-- <el-option :label="item.label" :value="item.value"> </el-option> -->
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input
      v-model="rolesName"
      :placeholder="rolesName"
      disabled
      style="width: 100px;"
    ></el-input>
    <!-- <el-tag type="success" style="width: 100px;">{{rolesName}}</el-tag> -->
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script>
import screenfull from "screenfull";
import { getSchoolId } from "@/utils/auth";
export default {
  name: "Screenfull",
  data() {
    return {
      isFullscreen: false,
      value: null,
      options: null,
      canChoose: true,
      item: null,
      canShow: false,
      rolesName: "" //用户角色
    };
  },
  created() {
    this.init();
  },
  // mounted() {
  //   let roles = sessionStorage.getItem("roles");
  //   //判断是否能够选择学校和添加角色名
  //   switch (roles) {
  //     case "000":
  //       this.canChoose = true;
  //       break;
  //     case "001":
  //       this.canChoose = true;
  //       break;
  //     case "002":
  //       this.canChoose = true;
  //       break;
  //     default:
  //       this.canChoose = false;
  //   }
  //   this.canShow = true;
  //   this.$forceUpdate()
  // },
  // mounted() {},
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    setRoleName(val) {
      this.rolesName = val;
      // this.$set(this.rolesName, val);
    },
    init() {
      this.options = [
        //设置学校的下拉框
        {
          label: "全部学校",
          value: "00000"
        },
        {
          label: "成都信息工程大学",
          value: "00001"
        },
        {
          label: "西南民族大学",
          value: "00002"
        }
      ];
      let schoolId = getSchoolId();
      let schoolName = null;
      switch (schoolId) {
        case "00000":
          schoolName = "全部学校";
          break;
        case "00001":
          schoolName = "成都信息工程大学";
          break;
        case "00002":
          schoolName = "西南民族大学";
          break;
      }
      this.item = {
        label: schoolName,
        value: schoolId
      };
      this.value = schoolId; //设置学校

      let roles = sessionStorage.getItem("roles");
      //判断是否能够选择学校和添加角色名
      switch (roles) {
        case "000":
          this.canChoose = true;
          this.setRoleName("超级管理员");
          break;
        case "001":
          this.canChoose = true;
          this.setRoleName("总财务会计");
          break;
        case "002":
          this.canChoose = true;
          this.setRoleName("总审核员");
          break;
        case "003":
          this.setRoleName("校区负责人");
          break;
        case "004":
          this.setRoleName("校区财务会计");
          break;
        case "005":
          this.setRoleName("校区审核员");
          break;
      }
      this.canShow = true;
      this.$forceUpdate();
      if (screenfull.enabled) {
        screenfull.on("change", this.change);
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off("change", this.change);
      }
    }
  }
};
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
