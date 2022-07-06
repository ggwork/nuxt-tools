<template>
  <div class="mheader">
    <div class="mh-container">
      <div class="h-name" @click="gotoSy">
        墨鱼工具
      </div>
      <div class="h-menu">
        <ul>
          <li v-for="item in links" @click="gotoWeb(item)">{{ item.name }}</li>
        </ul>
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
          name:'JSON装Excel',
          url:'/json',
          type:''
        }
      ]
    }
  },
  methods:{
    gotoSy(){
      this.$router.push({path:'/'})
    },
    gotoWeb(item){
      this.$router.push({path:item.url})
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
      ul{
        margin: 0px;
        padding:0px;
        li{
          margin: 0px;
          padding:0px;
          list-style-type: none;
          font-weight: 400;
          &:hover{
            color: #4d90fe;
          }
        }
      }
    }
  }
}
</style>


