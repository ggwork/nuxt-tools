<template>
  <div class="mfooter">
    <div class="mf-wrap">
      <div class="mf-u-wrap">
        友情链接：
        <div class="mf-url" v-for="item in myWebUrls">
          <a :href="item.url" target="_blank">{{ item.name }}</a>
        </div>
      </div>
      <div class="mf-txt">
        本人承接各种前端外包，合作可联系微信号:<a @click="copyWx">guo330504</a>
      </div> 
      <div class="mf-area">
        <textarea ref="wxArea" name="" id="wxArea" cols="30" value="guo330504" rows="10">guo330504</textarea>
      </div>
    </div>
    
  </div>
</template>
<script>

export default {
  name:'mFooter',
  data(){
    return {
      myWebUrls:[
        {
          name:'新冠疫情历史数据查询',
          url:'http://covid19.moyutime.cn/'
        },
        {
          name:'videojs中文教程',
          url:'http://videojs.moyutime.cn/'
        },
        {
          name:'墨鱼工具网',
          url:'http://tools.moyutime.cn/'
        },
        {
          name:'墨鱼博客',
          url:'http://www.moyutime.cn/'
        },
        {
          name:'墨鱼推荐',
          url:'http://moyu.moyutime.cn/'
        }
      ]
    }
    
  },
  
  methods:{
    copyWx(){
      this.$refs.wxArea.select()
      document.execCommand('copy')
      this.$toast({
        message:'已成功复制微信号',
        icon: 'like-o',
      })
    }
  }

}
</script>

<style lang="less" scoped>
.mfooter{
  padding:20px 0px;
  box-sizing: border-box;
  border-top:1px solid #eee;
  .mf-wrap{
    width: 1200px;
    margin: auto;
    .mf-u-wrap{
      .mf-url{
        display: inline-block;
        margin-left: 20px;
      }
    }
    .mf-txt{
      font-size: 16px;
      text-align: left ;
      margin-top: 20px;
      a{
        color: blue;
      }
    }

    .mf-area{
      position: absolute;
      top:-1000px;
      left: 0px;
      width: 100%;
      height: 0px;
      textarea{
        width: 100%;
        height: 0;
        border: none;
        outline: none;
      }
    }

  }
  
}
</style>

