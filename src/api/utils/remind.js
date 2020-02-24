   //操作提示
   /**
    * 
    * @param {直接传await 请求接口之后的res  eg-> const res = await func();} res 
    * @param {操作名称   eg: 更新操作就传更新} text 
    *  @param {上下文  传调用这个方法的this上下文} _this 
    */
   export function alertMsg(res, text, _this) {
       if (res.code == 10000 || res.code == "10000") {
           _this.$notify({
               title: "成功",
               message: text + "成功",
               type: "success",
               duration: 2000
           });
       } else {
           _this.$notify({
               title: "失败",
               message: text + "失败!网络错误",
               type: "error",
               duration: 2000
           });
       }
   }