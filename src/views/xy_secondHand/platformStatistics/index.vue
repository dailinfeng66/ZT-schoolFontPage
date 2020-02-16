<template>
  <div>
      <div v-for='item in list' :key="item">{{item}}</div>
      <button @click='click'>改变</button>
      <button @click='hadelClick'>解决方法</button>
            <button @click='fuxian'>复现</button>
  </div>
</template>
<script>
  export default({
    data(){
      return{
        list:[{a:"a"},{b:"b"}],
      }
    },
    methods: {
          click() {
          //  未声明不触发渲染
           this.list.c='c'

          },
          hadelClick(){
            // 解决方法，使用vue提供的$set方法来触发渲染
            
     
          },
          fuxian(){
                   this.list = [{
                  d:"d"
              }]
              this.list = [{
                  c:"c"
              }]
          }
        }
  })
   
</script>
