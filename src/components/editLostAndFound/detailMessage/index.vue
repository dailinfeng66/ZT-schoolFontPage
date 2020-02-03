<template>
<div class="item">
    <div class="item-content">
        <div class="col-content">
            <div class="row">
                <div class="row-title">标题:</div>
                <el-input placeholder="title" v-model="info.title" :disabled="false" class="input">
                </el-input>
            </div>
        </div>

        <div class="col-content">
            <div class="row">
                <div class="row-title">地点:</div>
                <el-input placeholder="place" v-model="info.place" :disabled="false" class="input">
                </el-input>
            </div>
        </div>

    </div>
    <br>
    <br>
     <el-row>
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
    <el-upload
  action="https://jsonplaceholder.typicode.com/posts/"
  list-type="picture-card"
  :on-preview="handlePictureCardPreview"
  :on-remove="handleRemove">
  <i class="el-icon-plus"></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
    
    <!-- <div class="detail-content">
        <div class="detail-content-title">详细内容:</div>
        <el-input placeholder="content" v-model="input" :disabled="false" class="input-specia">
        </el-input>
    </div> -->
    <Tinymce class="tinyme" />
    <!-- <el-upload action="https:" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog> -->
</div>
</template>

<script>
import {
    getInfo,
} from "@/api/xy_lostAndFound";
import Tinymce from '@/components/Tinymce'
export default {
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
             info:{
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
            },
        };
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
            this.id = this.$route.query.id
            const res = await getInfo(this.id)
            this.info = res.lost;
      
           
        }
    },
      created() {
        this.getRouterData();
    },
  
    components: {
        Tinymce
    }
}
</script>

<style lang="scss" scoped>
.item {
    .tinyme {
        margin-top: 4%;
    }

    // .detail-content {
    //     display: flex;

    //     .detail-content-title {
    //         width: 10%;
    //         display: grid;
    //         align-items: center;
    //         text-align: center;
    //         margin-left: 2%;
    //     }

    //     .input-specia {
    //         width: 90%;
    //         margin: 3% 3% 3% 0;
    //     }
    // }
    .image {
    width: 200px;
    height: 200px;
    display: block;
    float: left;
  }
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
