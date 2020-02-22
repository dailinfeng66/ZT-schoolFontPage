<template>
  <div>
    <el-select v-model="value" disabled style="width: 200px;">
      <el-option :label="item.label" :value="item.value"> </el-option>
    </el-select>
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
      item: null
    };
  },
  mounted() {
    this.init();
  },
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
    init() {
     let schoolId = getSchoolId()
      this.item = {
        label: schoolId,
        value: schoolId
      };
      this.value = schoolId;
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
