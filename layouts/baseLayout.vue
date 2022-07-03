<template>
   <div class="main">
     <div class="mheader">
       <mHeader></mHeader>
     </div>
     <div class="mbody">
       <nuxt></nuxt>  
     </div>
     <div class="mfooter">
       <mFooter></mFooter>
     </div>
   </div>
  
</template>

<script>
export default {
  methods:{
    
  }
}
</script>
<style lang="less" scoped>
.mheader,.mfooter{
  width: 100%;
}
.mbody{
  width: 1200px;
  margin: auto;
  min-height: calc(100vh - 70px - 100px);
}
.mfooter{
  background: rgba(246,246,246)
}
</style>





