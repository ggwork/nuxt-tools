<template>
  <div class="me" v-if="showMeComonent">
    <div class="m-wrap">
      <div class="m-title">
        <span>提示</span>
        <i class="el-icon-close" @click="closeMe"></i>
      </div>
      <div class="m-cont">
        免费额度是500k，大于1M可以联系我，我这边给你人工转换。微信：guo330504，或扫下面二维码。
      </div>
      <div class="m-qr">
        <img src="https://qr-1300661199.cos.ap-beijing.myqcloud.com/qr.png" alt="微信二维码" srcset="">
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name:'Me',
  props:{
    showMeComonent:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    closeMe(){
      this.$emit('closeMeComonent')
    }
  }
}
</script>

<style lang="less" scoped>
.me{
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  .m-wrap{
    width: 600px;
    border-radius: 8px;
    padding:20px;
    background: white;
    margin: auto;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .m-title{
      height: 40px;
      text-align: center;
      border-bottom: 1px solid #eee;
      .el-icon-close{
        float: right;
        cursor: pointer;
      }
    }
    .m-cont{
      margin-top: 10px;
      line-height: 30px;
    }
    .m-qr{
      text-align: center;
      margin-top: 10px;
      img{
        width: 300px;
        height: 300px;
      }
    }
  }
}
</style>

