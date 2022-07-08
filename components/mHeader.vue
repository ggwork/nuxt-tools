<template>
  <div class="mheader">
    <div class="mh-container">
      <div class="h-name" @click="gotoSy">
        墨鱼工具
      </div>
      <div class="h-menu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item :index="index" v-for="(item,index) in links" @click="gotoWeb(item)" :key="index">{{ item.name }}</el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'mHeader',
  data(){
    return {
      activeIndex:0,
      links:[
        {
          name:'JsonExcel',
          url:'/json',
          type:''
        },
        {
          name:'Json装Csv',
          url:'/json',
          type:''
        },
        {
          name:'Json编辑器',
          url:'/jsonEditor',
          type:''
        },
      ]
    }
  },
  methods:{
    gotoSy(){
      this.$router.push({path:'/'})
    },
    gotoWeb(item){
      this.$router.push({path:item.url})
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style lang="less" scoped>
.mheader{
  width: 100%;
  height: 70px;
  margin: auto;
  font-weight: 300;
  line-height: 1.6;
  color: #333;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 1px 0 0 rgb(17 17 17 / 9%);
  .mh-container{
    width: 1200px;
    margin: auto;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    .h-name{
      height: 70px;
      line-height: 70px;
      font-size: 30px;
      cursor: pointer;
    }
    .h-menu{
      margin-left:60px;
      height: 70px;
      line-height: 70px; 
      color: #161616;
      cursor: pointer;
      .el-menu{
        border: none;
        font-weight: 600;
      }
    }
  }
}
</style>


