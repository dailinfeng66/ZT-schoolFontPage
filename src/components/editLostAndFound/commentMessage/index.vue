<template>
<el-collapse v-model="activeName" accordion>
    
  <!-- <el-collapse-item v-for="value in list"  :title="value.from_name"  :name="value" :key="value" @click.native="findReply(value.comment._id)">
     -->
     <el-collapse-item v-for="value in list"  :title="value.from_name"  :name="value" :key="value" @click.native="findReply(value.comment._id)">
  <div style="padding-left:80px;margin-bottom:20px">{{value.comment.content}}<el-button style="margin-left:80px" type="danger" size="mini" @click="deleteComment(value.comment._id)">删除</el-button></div>
  <el-collapse v-model="activeName" >
  <el-collapse-item style="padding-left:160px" class="border" v-for="bvalue of blist"  :title="bvalue.title"  :name="1" :key="bvalue">    
    <div style="padding-left:80px;">{{bvalue.reply.content}}<el-button style="margin-left:80px" type="danger" size="mini" @click="deleteReplky(bvalue.reply._id)">删除</el-button></div>
  </el-collapse-item>
    </el-collapse>
  </el-collapse-item>

 
</el-collapse>
</template>

<script>
import {
    getComment,
    getReply
} from "@/api/xy_lostAndFound"

export default {
    data() {
         return {
        activeName: '1',
        id:"",
        list:null,
        blist:null,
      };
    },
    methods: {
       async findComment(){
             this.id = this.$route.query.id;
             const res = await getComment(this.id);
             this.list=[];
             console.log(res.queryResult);
             res.queryResult.list.map(value => {
                const temp = value;
               
                temp.from_name = temp.from_name+"的评论";
                temp.comment.content = "评论内容:"+ temp.comment.content
                this.list.push(temp);
             });
             console.log(this.list)
       },
       deleteComment(id){
           alert(id);
       },
       deleteReply(id){
           alert(id);
       },

       async findReply(id){
          // alert(id);
           const res = await getReply(id);
           this.blist=[];
            res.queryResult.list.map(value => {
                const temp = value;
                temp.title = "回复人："+temp.from_name+"@"+temp.to_name;
               
                temp.reply.content = "回复内容:"+ temp.reply.content
                this.blist.push(temp);
             });
             console.log(this.blist)

       }
    },
     created() {
       this.findComment();
       
    },
  
 
}
</script>
<style >
    .border{
         border:1px solid  rgb(53, 21, 21);
    } 
</style>